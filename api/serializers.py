from rest_framework import serializers

from .helpers import idToUrl
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
            # "teams",
            # "meetings",
        ]
        read_only_fields = ["meetings"]
        extra_kwargs = {
            "password": {"write_only": True},
            # "teams": {"lookup_field": "hashed_id"},
            # "meetings": {"lookup_field": "hashed_id"},
            "url": {"lookup_field": "hashed_id"},
        }

    def create(self, validated_data):
        validated_data["teams"]: list[str] = list(
            map(lambda _id: idToUrl("teams", _id), validated_data["teams"])
        )

        user = super().create(validated_data)
        user.set_password(validated_data["password"])

        return user

    def update(self, instance, validated_data):
        if "teams" in validated_data:
            validated_data["teams"]: list[str] = list(
                map(lambda _id: idToUrl("teams", _id), validated_data["teams"])
            )

        if "password" in validated_data:
            password = validated_data.pop("password")
            instance.set_password(password)

        return super().update(instance, validated_data)


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
            "users",
            "recordings",
            "notes",
        ]
        read_only_fields = ["users", "recordings", "notes"]
        extra_kwargs = {
            "team": {"lookup_field": "hashed_id"},
            "users": {"lookup_field": "hashed_id"},
            "recordings": {"lookup_field": "hashed_id"},
            "notes": {"lookup_field": "hashed_id"},
            "url": {"lookup_field": "hashed_id"},
        }

    def create(self, validated_data):
        if "team" in validated_data:
            validated_data["team"] = idToUrl("teams", validated_data["team"])

        if "users" in validated_data:
            validated_data["users"]: list[str] = list(
                map(lambda _id: idToUrl("users", _id), validated_data["users"])
            )

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "team" in validated_data:
            validated_data["team"] = idToUrl("teams", validated_data["team"])

        if "users" in validated_data:
            validated_data["users"]: list[str] = list(
                map(lambda _id: idToUrl("users", _id), validated_data["users"])
            )

        return super().update(instance, validated_data)


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

    def create(self, validated_data):
        validated_data["meeting"] = idToUrl("meetings", validated_data["meeting"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "meeting" in validated_data:
            validated_data["meeting"] = idToUrl("meetings", validated_data["meeting"])
        return super().update(instance, validated_data)


class NotesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Notes
        fields = ["url", "hashed_id", "title", "meeting", "content"]
        read_only_fields = ["meeting"]
        extra_kwargs = {
            "url": {"lookup_field": "hashed_id"},
        }

    def create(self, validated_data):
        validated_data["meeting"] = idToUrl("meetings", validated_data["meeting"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "meeting" in validated_data:
            validated_data["meeting"] = idToUrl("meetings", validated_data["meeting"])
        return super().update(instance, validated_data)
