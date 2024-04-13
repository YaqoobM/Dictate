from datetime import timedelta
from shutil import rmtree
from tempfile import mkdtemp
from unittest.mock import patch

from django.contrib import auth
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import Meeting, Notes, Recording, Team, User


class ProfileTests(APITestCase):
    def setUp(self):
        # create test users
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

    def test_login_success(self):
        url = reverse("user-login")
        data = {"email": "tester_1@dictate.com", "password": "12345678"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(auth.get_user(self.client).is_authenticated)

    def test_login_bad_credentials(self):
        url = reverse("user-login")
        data = {"email": "tester123@dictate.com", "password": "12345678"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(auth.get_user(self.client).is_authenticated)

    def test_login_bad_session(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-login")
        data = {"email": "tester_1@dictate.com", "password": "12345678"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-logout")
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(auth.get_user(self.client).is_authenticated)

    def test_logout_bad_session(self):
        url = reverse("user-logout")
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(auth.get_user(self.client).is_authenticated)

    def test_signup_success(self):
        user_count = User.objects.count()

        url = reverse("user-signup")
        data = {"username": "John", "email": "john@gmail.com", "password": "12345678"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(auth.get_user(self.client).is_authenticated)
        self.assertEqual(User.objects.count(), user_count + 1)
        self.assertEqual(auth.get_user(self.client).email, "john@gmail.com")

    def test_signup_bad_required_fields(self):
        user_count = User.objects.count()

        url = reverse("user-signup")
        data = {"username": "John", "password": "12345678"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), user_count)

    def test_signup_bad_credentials(self):
        user_count = User.objects.count()

        url = reverse("user-signup")
        data = {
            "username": "John",
            "email": "tester_1@dictate.com",
            "password": "12345678",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), user_count)

    def test_get_profile_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-profile")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_profile_bad_session(self):
        url = reverse("user-profile")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-detail", args=[self.test_user_2.hashed_id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_bad_id(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-detail", args=["RandomId"])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_user_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-detail", args=[self.test_user_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(auth.get_user(self.client).is_authenticated)

    def test_delete_user_bad_session(self):
        url = reverse("user-detail", args=[self.test_user_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_user_bad_target(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-detail", args=[self.test_user_2.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(auth.get_user(self.client).is_authenticated)

    def test_update_user_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-detail", args=[self.test_user_1.hashed_id])
        data = {"username": "secret_name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(auth.get_user(self.client).username, "secret_name")

    def test_update_user_bad_session(self):
        url = reverse("user-detail", args=[self.test_user_1.hashed_id])
        data = {"username": "secret_name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_user_bad_target(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("user-detail", args=[self.test_user_2.hashed_id])
        data = {"username": "secret_name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TeamTests(APITestCase):
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

    def test_get_team_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("team-detail", args=[self.team_1.hashed_id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team_bad_id(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("team-detail", args=["RandomId"])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_join_team_success(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("team-join", args=[self.team_1.hashed_id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(auth.get_user(self.client).teams.count(), 1)

    def test_join_team_bad_target(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("team-join", args=[self.team_1.hashed_id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_leave_team_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("team-leave", args=[self.team_1.hashed_id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(auth.get_user(self.client).teams.count(), 0)

    def test_leave_team_bad_target(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("team-leave", args=[self.team_1.hashed_id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_team_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("team-list")
        data = {"name": "New Team"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.json()["members"]), 1)

    def test_create_team_bad_session(self):
        url = reverse("team-list")
        data = {"name": "New Team"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_team_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("team-detail", args=[self.team_1.hashed_id])
        data = {"name": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Team.objects.get(pk=self.team_1.pk).name, "secret name")

    def test_update_team_bad_session(self):
        url = reverse("team-detail", args=[self.team_1.hashed_id])
        data = {"name": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_team_bad_target(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("team-detail", args=[self.team_1.hashed_id])
        data = {"name": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_team_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("team-detail", args=[self.team_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(auth.get_user(self.client).teams.count(), 0)

    def test_delete_team_bad_session(self):
        url = reverse("team-detail", args=[self.team_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_team_bad_target(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("team-detail", args=[self.team_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MeetingTests(APITestCase):
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

        self.meeting_1 = Meeting.objects.create(
            team=self.team_1, end_time=timezone.now() + timedelta(hours=1)
        )

    def test_get_meeting_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("meeting-detail", args=[self.meeting_1.hashed_id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_meeting_bad_id(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("meeting-detail", args=["RandomId"])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_meeting_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("meeting-list")
        data = {}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.json()["participants"]), 1)

    def test_create_meeting_bad_datetime(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("meeting-list")
        data = {
            "start_time": "02/12/2024 00:00:00",
            "end_time": "01/12/2024 00:00:00",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_meeting_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("meeting-detail", args=[self.meeting_1.hashed_id])
        data = {"end_time": "01/06/24 00:00:00"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            Meeting.objects.get(pk=self.meeting_1.pk).end_time.isoformat(),
            "2024-06-01T00:00:00+00:00",
        )

    def test_update_meeting_bad_session(self):
        url = reverse("meeting-detail", args=[self.meeting_1.hashed_id])
        data = {"start_time": "01/12/2024 00:00:00"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_meeting_bad_datetime(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("meeting-detail", args=[self.meeting_1.hashed_id])
        data = {"start_time": "01/12/2024 00:00:00"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_meeting_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("meeting-detail", args=[self.meeting_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(auth.get_user(self.client).meetings.count(), 0)

    def test_delete_meeting_bad_session(self):
        url = reverse("meeting-detail", args=[self.meeting_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_meeting_bad_target(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("meeting-detail", args=[self.meeting_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class RecordingTests(APITestCase):
    def setUp(self):
        self.MEDIA_ROOT = mkdtemp()

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

        self.meeting_1 = Meeting.objects.create(
            team=self.team_1, end_time=timezone.now() + timedelta(hours=1)
        )

        self.recording_1 = Recording.objects.create(meeting=self.meeting_1)

    def tearDown(self):
        rmtree(self.MEDIA_ROOT, ignore_errors=True)

    def test_get_recording_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("recording-detail", args=[self.recording_1.hashed_id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_recording_bad_id(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("recording-detail", args=["RandomId"])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch("api.signals.transform_video.delay")
    def test_create_recording_success(self, transform_video_fn):
        recordings_count = self.meeting_1.recordings.count()

        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("recording-list")
        data = {
            "meeting": self.meeting_1.hashed_id,
            "recording": SimpleUploadedFile(
                "file.webm", b"fake_recording", "video/webm"
            ),
        }

        with self.settings(MEDIA_ROOT=self.MEDIA_ROOT):
            response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Meeting.objects.get(pk=self.meeting_1.pk).recordings.count(),
            recordings_count + 1,
        )
        self.assertEqual(transform_video_fn.call_count, 1)

    @patch("api.signals.transform_video.delay")
    def test_create_recording_bad_file(self, transform_video_fn):
        recordings_count = self.meeting_1.recordings.count()

        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("recording-list")
        data = {
            "meeting": self.meeting_1.hashed_id,
            "recording": SimpleUploadedFile("file.mp4", b"fake_recording", "video/mp4"),
        }

        with self.settings(MEDIA_ROOT=self.MEDIA_ROOT):
            response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            Meeting.objects.get(pk=self.meeting_1.pk).recordings.count(),
            recordings_count,
        )
        self.assertEqual(transform_video_fn.call_count, 0)

    def test_update_recording_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("recording-detail", args=[self.recording_1.hashed_id])
        data = {"title": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            Recording.objects.get(pk=self.recording_1.pk).title,
            "secret name",
        )

    def test_update_recording_bad_session(self):
        url = reverse("recording-detail", args=[self.recording_1.hashed_id])
        data = {"title": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_recording_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("recording-detail", args=[self.recording_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            Meeting.objects.get(pk=self.meeting_1.pk).recordings.count(), 0
        )

    def test_delete_recording_bad_session(self):
        url = reverse("recording-detail", args=[self.recording_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_recording_bad_target(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("recording-detail", args=[self.recording_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class NotesTests(APITestCase):
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

        self.meeting_1 = Meeting.objects.create(
            team=self.team_1, end_time=timezone.now() + timedelta(hours=1)
        )

        self.notes_1 = Notes.objects.create(meeting=self.meeting_1, content="testing")

    def test_get_notes_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("notes-detail", args=[self.notes_1.hashed_id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_notes_bad_id(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("notes-detail", args=["RandomId"])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_notes_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("notes-detail", args=[self.notes_1.hashed_id])
        data = {"title": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Notes.objects.get(pk=self.team_1.pk).title, "secret name")

    def test_update_notes_bad_session(self):
        url = reverse("notes-detail", args=[self.notes_1.hashed_id])
        data = {"name": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_notes_bad_target(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("notes-detail", args=[self.notes_1.hashed_id])
        data = {"name": "secret name"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_notes_success(self):
        self.client.login(email="tester_1@dictate.com", password="12345678")

        url = reverse("notes-detail", args=[self.notes_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(hasattr(Meeting.objects.get(pk=self.meeting_1.pk), "notes"))

    def test_delete_notes_bad_session(self):
        url = reverse("notes-detail", args=[self.notes_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_notes_bad_target(self):
        self.client.login(email="tester_2@dictate.com", password="12345678")

        url = reverse("notes-detail", args=[self.notes_1.hashed_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
