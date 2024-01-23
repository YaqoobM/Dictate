import os
from random import randint

import ffmpeg
from celery import shared_task
from django.core.files import File

from .models import Recording


@shared_task
def transform_video(instance_pk: int):
    """Compress and resize video file then move to permanent storage"""

    recording = Recording.objects.get(pk=instance_pk)

    output_name = (
        recording.meeting.hashed_id + "_recording_" + f"{randint(0, 99999):05}" + ".mp4"
    )

    output_path = (
        recording.temp_upload.path[: recording.temp_upload.path.rfind("/")]
        + "/"
        + output_name
    )

    ffmpeg.input(recording.temp_upload.path).output(output_path).run()

    with open(output_path, "rb") as f:
        recording.upload.save(output_name, File(f))

    recording.temp_upload.delete()
    os.remove(output_path)
