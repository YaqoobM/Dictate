from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import storages
from django.db import models
from django.utils.translation import gettext_lazy as _
from sqids import Sqids

from .helpers import get_hashed_alphabet


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True, blank=True, null=True)

    USERNAME_FIELD = "email"

    @property
    def hashed_id(self) -> str:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=5)
        return sqids.encode([self.id])

    def decode_hash(self, hash) -> int:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=5)
        return sqids.decode(hash)[0]


class Team(models.Model):
    members = models.ManyToManyField(User, related_name="teams")
    name = models.CharField(
        _("team name"),
        max_length=150,
    )

    @property
    def hashed_id(self) -> str:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=10)
        return sqids.encode([self.id])

    def decode_hash(self, hash) -> int:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=10)
        return sqids.decode(hash)[0]


class Meeting(models.Model):
    team = models.ForeignKey(
        Team, models.CASCADE, related_name="meetings", blank=True, null=True
    )
    users = models.ManyToManyField(User, related_name="meetings", blank=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)

    @property
    def websocket(self) -> str:
        return f"{settings.PRODUCTION_URL}/ws/meetings/{self.hashed_id}"

    @property
    def hashed_id(self) -> str:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=5)
        return sqids.encode([self.id])

    def decode_hash(self, hash) -> int:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=5)
        return sqids.decode(hash)[0]


class Recording(models.Model):
    meeting = models.ForeignKey(
        Meeting, models.CASCADE, related_name="recordings", blank=True, null=True
    )

    title = models.CharField(
        _("recording title"),
        max_length=150,
        default="My recording",
    )

    upload = models.FileField(
        _("post-processed recording"),
        upload_to="recordings/",
        storage=storages["s3"],
        blank=True,
        null=True,
    )

    temp_upload = models.FileField(
        _("pre-processed recording"),
        upload_to="temp_recordings/",
        storage=storages["default"],
        # required externally
        blank=False,
        # allow setting null internally (after processing)
        null=True,
    )

    @property
    def hashed_id(self) -> str:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=15)
        return sqids.encode([self.id])

    def decode_hash(self, hash) -> int:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=15)
        return sqids.decode(hash)[0]


class Notes(models.Model):
    meeting = models.OneToOneField(Meeting, models.CASCADE, blank=True, null=True)

    title = models.CharField(
        _("notes title"),
        max_length=150,
        default="My notes",
    )

    content = models.TextField()

    @property
    def hashed_id(self) -> str:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=15)
        return sqids.encode([self.id])

    def decode_hash(self, hash) -> int:
        sqids = Sqids(alphabet=get_hashed_alphabet(), min_length=15)
        return sqids.decode(hash)[0]
