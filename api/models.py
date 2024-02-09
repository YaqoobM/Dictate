from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.files.storage import storages
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from sqids import Sqids

from .helpers import get_hashed_alphabet, get_remote_storage


class HashedIdModel(models.Model):
    @staticmethod
    def _get_sqids():
        return Sqids(alphabet=get_hashed_alphabet(), min_length=6)

    @classmethod
    def decode_hashed_id(cls, hash: str) -> int:
        decoded_hash = cls._get_sqids().decode(hash)

        if len(decoded_hash) != 1:
            raise ValueError("Invalid hash")

        return decoded_hash[0]

    @property
    def hashed_id(self) -> str:
        return self._get_sqids().encode([self.id])

    class Meta:
        abstract = True


class User(AbstractUser, HashedIdModel):
    username_validator = UnicodeUsernameValidator()

    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(
        _("username"),
        max_length=150,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


class Team(HashedIdModel):
    members = models.ManyToManyField(User, related_name="teams")
    name = models.CharField(
        _("team name"),
        max_length=150,
    )


class Meeting(HashedIdModel):
    team = models.ForeignKey(
        Team, models.CASCADE, related_name="meetings", blank=True, null=True
    )
    participants = models.ManyToManyField(User, related_name="meetings", blank=True)
    start_time = models.DateTimeField(default=now)
    end_time = models.DateTimeField(blank=True, null=True)

    @property
    def websocket(self) -> str:
        if settings.PRODUCTION_URL.find("https://") > -1:
            return f"{settings.PRODUCTION_URL.replace('https', 'wss', 1)}/ws/meetings/{self.hashed_id}"

        return f"{settings.PRODUCTION_URL.replace('http', 'ws', 1)}/ws/meetings/{self.hashed_id}"


class Recording(HashedIdModel):
    meeting = models.ForeignKey(Meeting, models.CASCADE, related_name="recordings")
    title = models.CharField(
        _("recording title"),
        max_length=150,
        default="My recording",
    )
    upload = models.FileField(
        _("post-processed recording"),
        validators=[FileExtensionValidator(["mp4"])],
        upload_to="recordings/",
        storage=get_remote_storage,
        blank=True,
        null=True,
    )
    temp_upload = models.FileField(
        _("pre-processed recording"),
        validators=[FileExtensionValidator(["webm"])],
        upload_to="temp_recordings/",
        storage=storages["local"],
        # required externally (default)
        blank=False,
        # allow setting null internally (after processing)
        null=True,
    )


class Notes(HashedIdModel):
    meeting = models.OneToOneField(Meeting, models.CASCADE)
    title = models.CharField(
        _("notes title"),
        max_length=150,
        default="My notes",
    )
    content = models.TextField()
