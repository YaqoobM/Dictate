import os

import ffmpeg
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.files import File
from django.core.files.storage import storages
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from sqids import Sqids

from .helpers import get_hashed_alphabet


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

    def transform_temp_upload(self):
        if not self.temp_upload:
            raise Exception("File does not exist in 'temp_upload'")

        if self.upload:
            raise Exception("File already exists in 'upload'")

        # transform video and store in temp folder
        temp_output_path = (
            self.temp_upload.path[: self.temp_upload.path.rfind(".")] + ".mp4"
        )
        ffmpeg.input(self.temp_upload.path).filter("scale", w=720, h=-2).filter(
            "fps", fps=30, round="up"
        ).output(temp_output_path, vcodec="libx264", crf=24, acodec="aac").run()

        # create nice output filename
        # (possible race conditions if multiple recordings saved at same time)
        i = 1
        while True:
            for filename in [
                os.path.basename(r.upload.name)
                for r in self.meeting.recordings.all()
                if r.upload.name
            ]:
                if int(filename.split(".")[0].split("_")[-1]) == i:
                    i += 1
                    continue
            break
        output_name = self.meeting.hashed_id + "_recording_" + f"{i:03}" + ".mp4"

        # save transformed video to permanent storage
        with open(temp_output_path, "rb") as f:
            self.upload.save(output_name, File(f))

        # delete temp files
        self.temp_upload.delete()
        os.remove(temp_output_path)


class Notes(HashedIdModel):
    meeting = models.OneToOneField(Meeting, models.CASCADE)
    title = models.CharField(
        _("notes title"),
        max_length=150,
        default="My notes",
    )
    content = models.TextField()
