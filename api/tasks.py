import ffmpeg
from celery import shared_task

from .models import Recording


@shared_task(bind=True)
def transform_video(self, instance_pk: int):
    """Compress and resize video file then move to permanent storage"""

    # get instance from id sent by the queue (celery)
    recording = Recording.objects.get(pk=instance_pk)

    try:
        recording.transform_temp_upload()
    except ffmpeg.Error as e:
        raise self.retry(exc=e, countdown=5, max_retries=3)
