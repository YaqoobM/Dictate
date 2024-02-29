from datetime import datetime
from typing import TypedDict

from asgiref.sync import async_to_sync
from autobahn.exception import Disconnected
from channels.generic.websocket import JsonWebsocketConsumer
from django.core.cache import cache

from .models import Meeting, Notes


class User(TypedDict):
    channel: str
    id: str | None
    username: str | None
    email: str | None
    audio_muted: bool
    video_muted: bool


class MeetingConsumer(JsonWebsocketConsumer):
    def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            return super().receive(text_data, bytes_data, **kwargs)
        except Exception:
            self.disconnect({"code": 4011})
            self.close()
            raise

    def send_json(self, content, close=False):
        try:
            return super().send_json(content, close)
        except Disconnected:
            self.disconnect({"code": 4011})
            self.close()

    def connect(self):
        """
        Handle new connection to meeting including validation and auth. If connection is
        valid:
        - add user to db (if private meeting)
        - add user to cache (storing current participants)
        - send group broadcast announcing new user to current participants
        - send individual message back to new user with list of current participants.
        """

        self.meeting_id = self.scope["url_route"]["kwargs"]["meeting_id"]

        # meeting exists?
        try:
            self.meeting = Meeting.objects.get(
                pk=Meeting.decode_hashed_id(self.meeting_id)
            )
        except Meeting.DoesNotExist:
            self.close(code=4404)

        # initialise user repr
        self.user: User = {
            "channel": self.channel_name,
            "id": None,
            "email": None,
            "username": None,
            "audio_muted": True,
            "video_muted": True,
        }

        if self.scope["user"].is_authenticated:
            self.user["id"] = self.scope["user"].hashed_id
            self.user["email"] = self.scope["user"].email
            self.user["username"] = self.scope["user"].username

        # team meeting?
        if (
            self.meeting.team
            and self.scope["user"] not in self.meeting.team.members.all()
        ):
            self.close(code=4401)

        # completed checks
        self.accept()

        # broadcast new user to group
        async_to_sync(self.channel_layer.group_send)(
            self.meeting_id,
            {
                "type": "user.new",
                "user": self.user,
            },
        )

        # add user to group broadcast
        async_to_sync(self.channel_layer.group_add)(self.meeting_id, self.channel_name)

        # add user to db if private meeting
        if not self.meeting.team and self.scope["user"].is_authenticated:
            self.meeting.participants.add(self.scope["user"])

        # add user to current meeting participants in cache
        current_participants: list[User] | None = cache.get(
            f"meeting_{self.meeting_id}_members"
        )

        if current_participants:
            current_participants.append(self.user)
        else:
            current_participants = [self.user]

        #                                                               1 week expiry
        cache.set(
            f"meeting_{self.meeting_id}_members", current_participants, 60 * 60 * 24 * 7
        )

        # send new connection their meeting details
        self.send_json(content={"type": "your_connection", "user": self.user})

        # send new connection current members
        self.send_json(
            content={
                "type": "all_users",
                "users": current_participants,
            }
        )

        # send new connection group notes if available or if saved
        notes = None

        if hasattr(self.meeting, "notes"):
            notes = self.meeting.notes.content

        notes = cache.get(f"meeting_{self.meeting_id}_notes", notes)

        if notes:
            self.send_json(
                content={
                    "type": "group_notes",
                    "content": notes,
                    "from": None,
                }
            )

    def disconnect(self, close_code):
        """
        Handle dropped connection.
        - remove user from cache (storing current participants)
        - send group broadcast announcing dropped user to current participants
        - set meeting end_time if last participant
        - save group notes (if available) to db
        """
        # remove user from group broadcast
        async_to_sync(self.channel_layer.group_discard)(
            self.meeting_id, self.channel_name
        )

        # remove user from current meeting participants in cache
        current_participants: list[User] = cache.get(
            f"meeting_{self.meeting_id}_members"
        )
        cache.set(
            f"meeting_{self.meeting_id}_members",
            [p for p in current_participants if p["channel"] != self.channel_name],
            60 * 60 * 24 * 7,
        )

        # broadcast user left to group
        async_to_sync(self.channel_layer.group_send)(
            self.meeting_id,
            {
                "type": "user.left",
                "user": self.user,
            },
        )

        # set end_time if last participant
        if (
            len([p for p in current_participants if p["channel"] != self.channel_name])
            == 0
        ):
            self.meeting.end_time = datetime.now()
            self.meeting.save()

        # save group notes if available
        notes = cache.get(f"meeting_{self.meeting_id}_notes")
        if notes:
            if hasattr(self.meeting, "notes"):
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

        active_participants: list[User] = cache.get(
            f"meeting_{self.meeting_id}_members"
        )

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
            elif content["to"] not in [p["channel"] for p in active_participants]:
                return self.send_json(
                    content={"status": "error", "message": "invalid user channel"}
                )

            if "signal" not in content:
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "missing key-value pair: {'signal': <webrtc-signal>}",
                    }
                )

            if not isinstance(content["signal"], str):
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "'signal' must be a string",
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
                    "from": self.user,
                    "signal": content["signal"],
                    "message_type": content["message_type"],
                },
            )
        elif content["type"] == "group_notes":
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
                    "from": self.user,
                },
            )
        elif content["type"] == "set_username":
            if "username" not in content:
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "missing key: 'username'",
                    }
                )

            elif not isinstance(content["username"], str):
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "'username' must be a string.",
                    }
                )

            self.user["username"] = content["username"]

            cache.set(
                f"meeting_{self.meeting_id}_members",
                [p for p in active_participants if p["channel"] != self.channel_name]
                + [self.user],
                60 * 60 * 24 * 7,
            )

            async_to_sync(self.channel_layer.group_send)(
                self.meeting_id,
                {
                    "type": "user.update",
                    "user": self.user,
                },
            )
        elif content["type"] == "user_media":
            if "audio_muted" not in content and "video_muted" not in content:
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "missing key(s): 'audio_muted', 'video_muted'",
                    }
                )

            if "audio_muted" in content and not isinstance(
                content["audio_muted"], bool
            ):
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "'audio_muted' must be a boolean.",
                    }
                )

            if "video_muted" in content and not isinstance(
                content["video_muted"], bool
            ):
                return self.send_json(
                    content={
                        "status": "error",
                        "message": "'video' must be a boolean.",
                    }
                )

            if "audio_muted" in content:
                self.user["audio_muted"] = content["audio_muted"]

            if "video_muted" in content:
                self.user["video_muted"] = content["video_muted"]

            cache.set(
                f"meeting_{self.meeting_id}_members",
                [p for p in active_participants if p["channel"] != self.channel_name]
                + [self.user],
                60 * 60 * 24 * 7,
            )

            async_to_sync(self.channel_layer.group_send)(
                self.meeting_id,
                {
                    "type": "user.update",
                    "user": self.user,
                },
            )
        else:
            self.send_json(
                content={
                    "status": "error",
                    "message": "unknown message type",
                }
            )

    def user_new(self, event):
        """Send new connection alert to individual peer"""

        self.send_json(content={"type": "user_joined", "user": event["user"]})

    def user_left(self, event):
        """Send dropped connection alert to individual peer"""

        if self.channel_name != event["user"]["channel"]:
            self.send_json(
                content={
                    "type": "user_left",
                    "user": event["user"],
                }
            )

    def user_update(self, event):
        """Send updated user to individual peer"""

        self.send_json(
            content={
                "type": "user_update",
                "user": event["user"],
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

        self.send_json(
            content={
                "type": "group_notes",
                "content": event["content"],
                "from": event["from"],
            }
        )
