import os
from random import randint

import ffmpeg
from celery import shared_task
from django.core.files import File

from .models import Recording


@shared_task
def transform_video(instance_pk: int):
    """Compress and resize video file then move to permanent storage"""

    # get instance from id sent by the queue (celery)
    recording = Recording.objects.get(pk=instance_pk)

    # transform video and store in temp folder
    temp_output_path = (
        recording.temp_upload.path[: recording.temp_upload.path.rfind(".")] + ".mp4"
    )
    ffmpeg.input(recording.temp_upload.path).output(
        temp_output_path, vcodec="libx264", acodec="aac"
    ).run()

    # create nice output filename
    # (possible race conditions if multiple recordings saved at same time)
    i = 1
    while True:
        for filename in [
            os.path.basename(r.upload.name)
            for r in recording.meeting.recordings.all()
            if r.upload.name
        ]:
            if int(filename.split(".")[0].split("_")[-1]) == i:
                i += 1
                continue
        break
    output_name = recording.meeting.hashed_id + "_recording_" + f"{i:03}" + ".mp4"

    # save transformed video to permanent storage
    with open(temp_output_path, "rb") as f:
        recording.upload.save(output_name, File(f))

    # delete temp files
    recording.temp_upload.delete()
    os.remove(temp_output_path)
