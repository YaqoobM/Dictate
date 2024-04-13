from channels.routing import URLRouter
from channels.testing import WebsocketCommunicator
from django.contrib.auth.models import AnonymousUser
from django.core.cache import cache
from django.test import TestCase

from ..models import Meeting, Team, User
from ..routing import websocket_urlpatterns


class MeetingTests(TestCase):
    def setUp(self):
        self.test_user_1 = User.objects.create_user(
            username="Tester_1",
            email="tester_1@dictate.com",
            password="12345678",
        )
        self.test_user_2 = User.objects.create_user(
            username="Tester_2",
            email="tester_2@dictate.com",
            password="12345678",
        )

        self.team_1 = Team.objects.create(name="Team 1")
        self.team_1.members.set([self.test_user_1])
        self.team_1.save()

        self.meeting_1 = Meeting.objects.create()
        self.meeting_2 = Meeting.objects.create(team=self.team_1)

    def tearDown(self):
        cache.clear()

    async def test_websocket_connection_success_anonymous_user(self):
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator.scope["user"] = AnonymousUser()

        connected, _ = await communicator.connect()
        response_1 = await communicator.receive_json_from()
        response_2 = await communicator.receive_json_from()

        self.assertTrue(connected)
        self.assertEqual(response_1["type"], "your_connection")
        self.assertEqual(response_2["type"], "all_users")
        self.assertTrue(
            response_1["user"]["channel"] in [u["channel"] for u in response_2["users"]]
        )

    async def test_websocket_connection_success_authenticated_user(self):
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator.scope["user"] = self.test_user_1

        connected, _ = await communicator.connect()
        response_1 = await communicator.receive_json_from()
        response_2 = await communicator.receive_json_from()

        self.assertTrue(connected)
        self.assertEqual(response_1["type"], "your_connection")
        self.assertEqual(response_1["user"]["username"], "Tester_1")
        self.assertEqual(response_2["type"], "all_users")
        self.assertTrue(
            response_1["user"]["channel"] in [u["channel"] for u in response_2["users"]]
        )

    async def test_websocket_connection_bad_id(self):
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), "ws/meetings/RandomId/"
        )
        communicator.scope["user"] = AnonymousUser()
        connected, error_code = await communicator.connect()

        self.assertFalse(connected)
        self.assertEqual(error_code, 4404)

    async def test_websocket_connection_bad_meeting(self):
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_2.hashed_id}/"
        )
        communicator.scope["user"] = self.test_user_2
        connected, error_code = await communicator.connect()

        self.assertFalse(connected)
        self.assertEqual(error_code, 4401)

    async def test_websocket_user_joined_success_anonymous_user(self):
        communicator_1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_1.scope["user"] = AnonymousUser()

        communicator_2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_2.scope["user"] = AnonymousUser()

        await communicator_1.connect()
        await communicator_2.connect()

        # message_type: "your_connection"
        response_1 = await communicator_1.receive_json_from()
        response_2 = await communicator_2.receive_json_from()
        # message_type: "all_users"
        await communicator_1.receive_json_from()
        response_3 = await communicator_2.receive_json_from()
        # message_type: "user_joined"
        response_4 = await communicator_1.receive_json_from()

        self.assertEqual(response_3["type"], "all_users")
        self.assertTrue(
            response_1["user"]["channel"] in [u["channel"] for u in response_3["users"]]
        )
        self.assertEqual(response_4["type"], "user_joined")
        self.assertDictEqual(response_2["user"], response_4["user"])

    async def test_websocket_user_joined_success_authenticated_user(self):
        communicator_1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_1.scope["user"] = self.test_user_1

        communicator_2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_2.scope["user"] = self.test_user_2

        await communicator_1.connect()
        await communicator_2.connect()

        # message_type: "your_connection"
        response_1 = await communicator_1.receive_json_from()
        response_2 = await communicator_2.receive_json_from()
        # message_type: "all_users"
        await communicator_1.receive_json_from()
        response_3 = await communicator_2.receive_json_from()
        # message_type: "user_joined"
        response_4 = await communicator_1.receive_json_from()

        self.assertTrue(response_1["user"]["username"] is not None)
        self.assertTrue(response_2["user"]["username"] is not None)
        self.assertEqual(response_3["type"], "all_users")
        self.assertTrue(
            response_1["user"]["channel"] in [u["channel"] for u in response_3["users"]]
        )
        self.assertTrue(
            response_1["user"]["username"]
            in [u["username"] for u in response_3["users"]]
        )
        self.assertEqual(response_4["type"], "user_joined")
        self.assertDictEqual(response_2["user"], response_4["user"])

    async def test_websocket_webrtc_message_success(self):
        communicator_1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_1.scope["user"] = AnonymousUser()

        communicator_2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_2.scope["user"] = AnonymousUser()

        await communicator_1.connect()
        await communicator_2.connect()

        # message_type: "your_connection"
        await communicator_1.receive_json_from()
        await communicator_2.receive_json_from()
        # message_type: "all_users"
        await communicator_1.receive_json_from()
        await communicator_2.receive_json_from()
        # message_type: "user_joined"
        response_1 = await communicator_1.receive_json_from()

        await communicator_1.send_json_to(
            {
                "type": "webrtc_signal",
                "to": response_1["user"]["channel"],
                "signal": "test signal",
                "message_type": "offer",
            }
        )

        # message_type: "webrtc_signal"
        response_2 = await communicator_2.receive_json_from()

        self.assertEqual(response_2["type"], "webrtc_signal")
        self.assertEqual(response_2["signal"], "test signal")
        self.assertEqual(response_2["message_type"], "offer")

    async def test_websocket_webrtc_message_bad_peer(self):
        communicator_1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_1.scope["user"] = AnonymousUser()

        await communicator_1.connect()

        # message_type: "your_connection"
        await communicator_1.receive_json_from()
        # message_type: "all_users"
        await communicator_1.receive_json_from()

        await communicator_1.send_json_to(
            {
                "type": "webrtc_signal",
                "to": "fake peer",
                "signal": "test signal",
                "message_type": "offer",
            }
        )

        response_1 = await communicator_1.receive_json_from()

        self.assertEqual(response_1["status"], "error")

    async def test_websocket_group_notes_message_success(self):
        communicator_1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_1.scope["user"] = AnonymousUser()

        communicator_2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_2.scope["user"] = AnonymousUser()

        await communicator_1.connect()
        await communicator_2.connect()

        # message_type: "your_connection"
        response_1 = await communicator_1.receive_json_from()
        await communicator_2.receive_json_from()
        # message_type: "all_users"
        await communicator_1.receive_json_from()
        await communicator_2.receive_json_from()
        # message_type: "user_joined"
        await communicator_1.receive_json_from()

        await communicator_1.send_json_to(
            {
                "type": "group_notes",
                "content": "test message",
            }
        )

        # message_type: "group_notes"
        await communicator_1.receive_json_from()
        response_2 = await communicator_2.receive_json_from()

        self.assertEqual(response_2["type"], "group_notes")
        self.assertEqual(response_2["content"], "test message")
        self.assertDictEqual(response_1["user"], response_2["from"])

    async def test_websocket_group_notes_message_bad_content(self):
        communicator_1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_1.scope["user"] = AnonymousUser()

        communicator_2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_2.scope["user"] = AnonymousUser()

        await communicator_1.connect()
        await communicator_2.connect()

        # message_type: "your_connection"
        response_1 = await communicator_1.receive_json_from()
        await communicator_2.receive_json_from()
        # message_type: "all_users"
        await communicator_1.receive_json_from()
        await communicator_2.receive_json_from()
        # message_type: "user_joined"
        await communicator_1.receive_json_from()

        await communicator_1.send_json_to(
            {
                "type": "group_notes",
                "content": None,
            }
        )

        # message_type: "group_notes"
        response_2 = await communicator_1.receive_json_from()

        self.assertEqual(response_2["status"], "error")

    async def test_websocket_disconnect_success(self):
        communicator_1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_1.scope["user"] = AnonymousUser()

        communicator_2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns), f"ws/meetings/{self.meeting_1.hashed_id}/"
        )
        communicator_2.scope["user"] = AnonymousUser()

        await communicator_1.connect()
        await communicator_2.connect()
        await communicator_2.disconnect()

        # your_connection
        await communicator_1.receive_json_from()
        # all_users
        await communicator_1.receive_json_from()
        # user_joined
        response_1 = await communicator_1.receive_json_from()
        # user_left
        response_2 = await communicator_1.receive_json_from()

        self.assertEqual(response_2["type"], "user_left")
        self.assertEqual(response_1["user"]["channel"], response_2["user"]["channel"])
