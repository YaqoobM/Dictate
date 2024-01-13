import re

from django.utils.timezone import now
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .helpers import get_hashed_alphabet
from .models import Meeting, Notes, Recording, Team, User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = [
            "url",
            "hashed_id",
            "email",
            "username",
            "password",
            "teams",
            "meetings",
        ]
        read_only_fields = ["meetings"]
        extra_kwargs = {
            "password": {"write_only": True},
            "teams": {"lookup_field": "hashed_id"},
            "meetings": {"lookup_field": "hashed_id"},
            "url": {"lookup_field": "hashed_id"},
        }

    def update(self, instance, validated_data):
        if "teams" in validated_data:
            ids = map(
                lambda hash: Team.decode_hashed_id(hash),
                validated_data.pop("teams"),
            )
            instance.teams.set(ids)

        if "password" in validated_data:
            password = validated_data.pop("password")
            instance.set_password(password)

        return super().update(instance, validated_data)

    def to_internal_value(self, data):
        if "teams" in data:
            teams = data.pop("teams")

            # Validation
            if not isinstance(teams, list):
                raise ValidationError(
                    {"teams": "Must be a valid array of hashed_id strings"}
                )

            for team in teams:
                if not isinstance(team, str):
                    raise ValidationError(
                        {"teams": "Must be a valid array of hashed_id strings"}
                    )

                if not re.match(f"^[{get_hashed_alphabet()}]+$", team):
                    raise ValidationError(
                        {"teams": "Must be a valid array of hashed_id strings"}
                    )

                if not Team.objects.filter(
                    id=Team.decode_hashed_id(team),
                ).exists():
                    raise ValidationError({"teams": f"Team: {team} does not exist"})

            validated_data: dict = super().to_internal_value(data)
            validated_data["teams"] = teams
            return validated_data

        return super().to_internal_value(data)


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = ["url", "hashed_id", "name", "members", "meetings"]
        read_only_fields = ["members", "meetings"]
        extra_kwargs = {
            "members": {"lookup_field": "hashed_id"},
            "meetings": {"lookup_field": "hashed_id"},
            "url": {"lookup_field": "hashed_id"},
        }


class MeetingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Meeting
        fields = [
            "url",
            "hashed_id",
            "websocket",
            "start_time",
            "end_time",
            "team",
            "participants",
            "recordings",
            "notes",
        ]
        read_only_fields = ["participants", "recordings", "notes"]
        extra_kwargs = {
            "team": {"lookup_field": "hashed_id"},
            "participants": {"lookup_field": "hashed_id"},
            "recordings": {"lookup_field": "hashed_id"},
            "notes": {"lookup_field": "hashed_id"},
            "url": {"lookup_field": "hashed_id"},
            # "start_time": {"format": ..., "input_format": [...]},
            # "end_time": {"format": ..., "input_format": [...]},
        }

    def create(self, validated_data):
        team = None

        if "team" in validated_data:
            team = Team.objects.get(
                id=Team.decode_hashed_id(validated_data.pop("team"))
            )

        meeting = super().create(validated_data)

        if team:
            meeting.team = team
            meeting.save()

        return meeting

    def update(self, instance, validated_data):
        if "team" in validated_data:
            raise ValidationError({"team": "Team cannot be changed"})

        return super().update(instance, validated_data)

    def validate(self, data):
        """
        Check that start time is before end time and prevent updating time if in the
        past.
        """

        if "start_time" in data and data["start_time"] is None:
            raise ValidationError({"start_time": "Cannot be set to null"})

        if "start_time" in data and data["start_time"] < now():
            raise ValidationError({"start_time": "Cannot be set to the past"})

        if (
            "end_time" in data
            and data["end_time"] is not None
            and data["end_time"] < now()
        ):
            raise ValidationError({"end_time": "Cannot be set to the past"})

        if (
            "start_time" in data
            and data["start_time"] is not None
            and "end_time" in data
            and data["end_time"] is not None
        ):
            if data["start_time"] >= data["end_time"]:
                raise ValidationError({"time": "end_time must occur after start_time"})

        if self.instance:
            if (
                "end_time" in data
                and data["end_time"] is None
                and self.instance.end_time
            ):
                raise ValidationError({"end_time": "Cannot be reset to null"})

            if (
                "start_time" not in data
                and "end_time" in data
                and data["end_time"] is not None
                and self.instance.start_time >= data["end_time"]
            ):
                raise ValidationError({"time": "end_time must occur after start_time"})

            if (
                "start_time" in data
                and "end_time" not in data
                and data["start_time"] is not None
                and data["start_time"] >= self.instance.end_time
            ):
                raise ValidationError({"time": "end_time must occur after start_time"})

        return data

    def to_internal_value(self, data):
        if "team" in data and data["team"] is not None:
            team = data.pop("team")

            # Validation
            if not isinstance(team, str):
                raise ValidationError({"team": "Must be a valid hashed_id string"})

            if not re.match(f"^[{get_hashed_alphabet()}]+$", team):
                raise ValidationError(
                    {"teams": "Must be a valid array of hashed_id strings"}
                )

            if not Team.objects.filter(
                id=Team.decode_hashed_id(team),
            ).exists():
                raise ValidationError({"team": f"Team: {team} does not exist"})

            validated_data: dict = super().to_internal_value(data)
            validated_data["team"] = team
            return validated_data
        elif "team" in data:
            del data["team"]

        return super().to_internal_value(data)


class RecordingSerializer(serializers.HyperlinkedModelSerializer):
    recording = serializers.FileField(
        source="temp_upload", write_only=True, required=True
    )

    class Meta:
        model = Recording
        fields = ["url", "hashed_id", "title", "meeting", "upload", "recording"]
        read_only_fields = ["meeting", "upload"]
        extra_kwargs = {
            "url": {"lookup_field": "hashed_id"},
        }


class NotesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Notes
        fields = ["url", "hashed_id", "title", "meeting", "content"]
        read_only_fields = ["meeting"]
        extra_kwargs = {
            "url": {"lookup_field": "hashed_id"},
        }
