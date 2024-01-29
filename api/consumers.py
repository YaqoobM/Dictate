import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from channels.layers import get_channel_layer
from django.core.cache import cache

from .models import Meeting, Notes


class MeetingConsumer(JsonWebsocketConsumer):
    def connect(self):
        """
        Handle new connection to meeting including validation and auth. If connection is
        valid:
        - add user to db (if private meeting)
        - add user to cache (storing current participants)
        - send group broadcast announcing new user to current participants
        - send individual message back to new user with list of current participants.
        """

        self.user = self.scope["user"]
        self.meeting_id = self.scope["url_route"]["kwargs"]["meeting_id"]

        # meeting exists?
        try:
            self.meeting = Meeting.objects.get(
                pk=Meeting.decode_hashed_id(self.meeting_id)
            )
        except Meeting.DoesNotExist:
            self.close(code=4404)

        # team meeting?
        if self.meeting.team and self.user not in self.meeting.team.members.all():
            self.close(code=4401)

        # completed checks
        self.accept()

        # broadcast new user to group
        async_to_sync(self.channel_layer.group_send)(
            self.meeting_id,
            {
                "type": "user.new",
                "user_id": self.channel_name,
            },
        )

        # add user to group broadcast
        async_to_sync(self.channel_layer.group_add)(self.meeting_id, self.channel_name)

        # add user to db if private meeting
        if not self.meeting.team and self.user.is_authenticated:
            self.meeting.participants.add(self.user)

        # add user to current meeting participants in cache
        current_participants = cache.get(f"meeting_{self.meeting_id}_members")

        if current_participants:
            current_participants.append(self.channel_name)
        else:
            current_participants = [self.channel_name]

        #                                                               1 week expiry
        cache.set(
            f"meeting_{self.meeting_id}_members", current_participants, 60 * 60 * 24 * 7
        )

        # send user current meeting member ids
        self.send_json(
            content={
                "type": "list_users",
                "users": [p for p in current_participants if p != self.channel_name]
                or [],
            }
        )

    def disconnect(self, close_code):
        """
        Handle dropped connection.
        - remove user from cache (storing current participants)
        - send group broadcast announcing dropped user to current participants
        - save group notes (if available) to db
        """

        # remove user from group broadcast
        async_to_sync(self.channel_layer.group_discard)(
            self.meeting_id, self.channel_name
        )

        # remove user from current meeting participants in cache
        current_participants = cache.get(f"meeting_{self.meeting_id}_members")
        cache.set(
            f"meeting_{self.meeting_id}_members",
            [p for p in current_participants if p != self.channel_name],
            60 * 60 * 24 * 7,
        )

        # broadcast user left to group
        async_to_sync(self.channel_layer.group_send)(
            self.meeting_id,
            {
                "type": "user.left",
                "user_id": self.channel_name,
            },
        )

        # save group notes if available
        notes = cache.get(f"meeting_{self.meeting_id}_notes")
        if notes:
            if self.meeting.notes:
                self.meeting.notes.content = notes
                self.meeting.save()
            else:
                Notes.objects.create(meeting=self.meeting, content=notes)

    def receive_json(self, content):
        """
        Handle connection messages, either:
        - webrtc signal (proxy message to peer after validation and transformation)
        - group notes (proxy message to all connections in group and save to cache)
        """

        # type exists?
        if "type" not in content:
            return self.send_json(
                content={
                    "status": "error",
                    "message": "missing key-value pair: {'type': <message-type>}",
                }
            )

        active_participants = cache.get(f"meeting_{self.meeting_id}_members")

        # meeting exists in cache?
        if not active_participants:
            return self.send_json(
                content={
                    "status": "error",
                    "message": "something went wrong with meeting session",
                }
            )

        if content["type"] == "webrtc_signal":
            if "to" not in content:
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "missing key-value pair: {'to': <peer-id>}",
                    }
                )
            elif content["to"] not in active_participants:
                return self.send_json(
                    content={"status": "error", "message": "invalid peer id"}
                )

            if "signal" not in content:
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "missing key-value pair: {'signal': <webrtc-signal>}",
                    }
                )

            if "message_type" not in content or not (
                content["message_type"] == "offer"
                or content["message_type"] == "answer"
            ):
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "missing key-value pair: {'message_type': 'offer' | 'answer'}",
                    }
                )

            async_to_sync(self.channel_layer.send)(
                content["to"],
                {
                    "type": "user.signal",
                    "from": self.channel_name,
                    "signal": content["signal"],
                    "message_type": content["message_type"],
                },
            )

        if content["type"] == "group_notes":
            if "content" not in content:
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "missing key: 'content'",
                    }
                )
            elif not isinstance(content["content"], str):
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "'content' must be a string, try stringified JSON.",
                    }
                )

            # to do: throttle cache interactions
            cache.set(
                f"meeting_{self.meeting_id}_notes", content["content"], 60 * 60 * 24 * 7
            )

            async_to_sync(self.channel_layer.group_send)(
                self.meeting_id,
                {
                    "type": "notes.new",
                    "content": content["content"],
                    "from": self.channel_name,
                },
            )

    def user_new(self, event):
        """Send new connection alert to individual peer"""

        self.send_json(
            content={
                "type": "new_user",
                "user_id": event["user_id"],
            }
        )

    def user_left(self, event):
        """Send dropped connection alert to individual peer"""

        self.send_json(
            content={
                "type": "user_left",
                "user_id": event["user_id"],
            }
        )

    def user_signal(self, event):
        """Send webrtc signal to individual peer"""

        self.send_json(
            content={
                "type": "webrtc_signal",
                "from": event["from"],
                "signal": event["signal"],
                "message_type": event["message_type"],
            }
        )

    def notes_new(self, event):
        """Send updated group notes to individual peer"""

        if self.channel_name != event["from"]:
            self.send_json(
                content={
                    "type": "group_notes",
                    "content": event["content"],
                }
            )
