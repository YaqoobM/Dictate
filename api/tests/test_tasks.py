from datetime import timedelta
from shutil import rmtree
from tempfile import mkdtemp
from unittest.mock import patch

import ffmpeg
from celery.exceptions import Retry
from django.utils import timezone
from rest_framework.test import APITestCase

from ..models import Meeting, Recording, User
from ..tasks import transform_video


class TaskTests(APITestCase):
    def setUp(self):
        self.MEDIA_ROOT = mkdtemp()

        self.test_user_1 = User.objects.create_user(
            username="Tester_1",
            email="tester_1@dictate.com",
            password="12345678",
        )

        self.meeting_1 = Meeting.objects.create(
            end_time=timezone.now() + timedelta(hours=1)
        )
        self.meeting_1.participants.set([self.test_user_1])
        self.meeting_1.save()

        self.recording_1 = Recording.objects.create(meeting=self.meeting_1)

    def tearDown(self):
        rmtree(self.MEDIA_ROOT, ignore_errors=True)

    @patch("api.tasks.Recording.transform_temp_upload")
    def test_task_transform_video_success(self, transform_video_fn):
        transform_video(self.recording_1.pk)

        self.assertEqual(transform_video_fn.call_count, 1)

    @patch("api.tasks.Recording.transform_temp_upload")
    @patch("api.tasks.transform_video.retry")
    def test_task_transform_video_success(self, retry_fn, transform_video_fn):
        retry_fn.side_effect = Retry()
        transform_video_fn.side_effect = ffmpeg.Error("a", "b", "c")

        self.assertRaises(Retry, transform_video, instance_pk=self.recording_1.pk)
        self.assertEqual(transform_video_fn.call_count, 1)
