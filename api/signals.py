from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from .models import Recording, Team, User
from .tasks import transform_video


@receiver(m2m_changed, sender=User.teams.through)
def m2m_user_teams_handler(sender, instance, action, pk_set, *args, **kwargs):
    """
    Prune empty teams.
    Todo: add logic for post_clear and post_remove for both instance: User | Team
    """
    if isinstance(instance, User) and action == "post_remove":
        for t in Team.objects.filter(id__in=pk_set):
            if not t.members.exists():
                t.delete()


@receiver(post_save, sender=Recording)
def post_save_recording_handler(sender, instance, *args, **kwargs):
    if instance.temp_upload and not instance.upload:
        transform_video.delay(instance.pk)
