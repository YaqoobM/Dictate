import re
from collections import OrderedDict

from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.timezone import now
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import get_error_detail, set_value

from .helpers import get_hashed_alphabet
from .models import Meeting, Notes, Recording, Team, User


class HashedIdModelSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField(source="hashed_id")


class UserSerializer(HashedIdModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "url",
            "email",
            "username",
            "password",
            "teams",
        ]
        read_only_fields = ["meetings"]
        extra_kwargs = {
            "password": {"write_only": True},
            "teams": {"lookup_field": "hashed_id"},
            "url": {"lookup_field": "hashed_id"},
        }

    def create(self, validated_data):
        ids = map(
            lambda hash: Team.decode_hashed_id(hash),
            validated_data.pop("teams"),
        )

        user = super().create(validated_data)
        user.set_password(validated_data["password"])

        user.teams.set(ids)
        user.save()

        return user

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
                    {"teams": "Must be a valid array of hashed_id strings."}
                )

            for i, team in enumerate(teams):
                if not isinstance(team, str):
                    raise ValidationError(
                        {"teams": "Must be a valid array of hashed_id strings."}
                    )

                if re.match(f".*\/api\/teams\/[{get_hashed_alphabet()}]+\/?$", team):
                    temp = team.rstrip("/")
                    team = temp[temp.rfind("/") + 1 :]
                    teams[i] = temp[temp.rfind("/") + 1 :]

                if not re.match(f"^[{get_hashed_alphabet()}]+$", team):
                    raise ValidationError(
                        {"teams": "Must be a valid array of hashed_id strings."}
                    )

                try:
                    Team.decode_hashed_id(team)
                except ValueError:
                    raise ValidationError({"teams": "Invalid hashed_id string."})

                if not Team.objects.filter(
                    id=Team.decode_hashed_id(team),
                ).exists():
                    raise ValidationError({"teams": f"Team: {team} does not exist."})

            # temporarily assign teams so validation check for POST doesn't find missing key-value
            data["teams"] = []
            validated_data: dict = super().to_internal_value(data)

            validated_data["teams"] = teams
            return validated_data

        return super().to_internal_value(data)


class TeamSerializer(HashedIdModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "url", "name", "members", "meetings"]
        read_only_fields = ["members", "meetings"]
        extra_kwargs = {
            "members": {"lookup_field": "hashed_id"},
            "meetings": {"lookup_field": "hashed_id"},
            "url": {"lookup_field": "hashed_id"},
        }


class MeetingSerializer(HashedIdModelSerializer):
    class Meta:
        model = Meeting
        fields = [
            "id",
            "url",
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
            "start_time": {
                "format": "%d/%m/%y %H:%M:%S",
                "input_formats": ["%d/%m/%y %H:%M:%S"],
            },
            "end_time": {
                "format": "%d/%m/%y %H:%M:%S",
                "input_formats": ["%d/%m/%y %H:%M:%S"],
            },
        }

    def create(self, validated_data):
        team = None

        if "team" in validated_data and validated_data["team"] is not None:
            team = Team.objects.get(
                id=Team.decode_hashed_id(validated_data.pop("team"))
            )

        meeting = super().create(validated_data)

        if team:
            meeting.team = team
            meeting.save()

        return meeting

    def update(self, instance, validated_data):
        if "team" in validated_data and validated_data["team"]:
            team = Team.objects.get(
                id=Team.decode_hashed_id(validated_data.pop("team"))
            )
            instance.team = team
        elif "team" in validated_data:
            del validated_data["team"]
            instance.team = None

        return super().update(instance, validated_data)

    def validate(self, data):
        """
        Check that start time is before end time and prevent updating time if in the
        past.
        """

        if "start_time" in data and data["start_time"] is None:
            raise ValidationError({"start_time": "Cannot be set to null."})

        if "start_time" in data and data["start_time"] < now():
            raise ValidationError({"start_time": "Cannot be set to the past."})

        if (
            "end_time" in data
            and data["end_time"] is not None
            and data["end_time"] < now()
        ):
            raise ValidationError({"end_time": "Cannot be set to the past."})

        if (
            "start_time" in data
            and data["start_time"] is not None
            and "end_time" in data
            and data["end_time"] is not None
        ):
            if data["start_time"] >= data["end_time"]:
                raise ValidationError({"time": "end_time must occur after start_time."})

        if self.instance:
            if (
                "end_time" in data
                and data["end_time"] is None
                and self.instance.end_time
            ):
                raise ValidationError({"end_time": "Cannot be reset to null."})

            if (
                "start_time" not in data
                and "end_time" in data
                and data["end_time"] is not None
                and self.instance.start_time >= data["end_time"]
            ):
                raise ValidationError({"time": "end_time must occur after start_time."})

            if (
                "start_time" in data
                and "end_time" not in data
                and data["start_time"] is not None
                and data["start_time"] >= self.instance.end_time
            ):
                raise ValidationError({"time": "end_time must occur after start_time."})

        return data

    def to_internal_value(self, data):
        if "team" in data and data["team"] is not None:
            team = data.pop("team")

            # Validation
            if not isinstance(team, str):
                raise ValidationError(
                    {"team": "Must be a valid hashed_id string or null."}
                )

            if re.match(f"\/api\/teams\/[{get_hashed_alphabet()}]+\/?$", team):
                temp = team.rstrip("/")
                team = temp[temp.rfind("/") + 1 :]

            if not re.match(f"^[{get_hashed_alphabet()}]+$", team):
                raise ValidationError(
                    {"team": "Must be a valid hashed_id string or null."}
                )

            try:
                Team.decode_hashed_id(team)
            except ValueError:
                raise ValidationError({"team": "Invalid hashed_id string."})

            if not Team.objects.filter(
                id=Team.decode_hashed_id(team),
            ).exists():
                raise ValidationError({"team": f"Team: {team} does not exist."})

            validated_data: dict = super().to_internal_value(data)
            validated_data["team"] = team
            return validated_data

        return super().to_internal_value(data)


class RecordingSerializer(HashedIdModelSerializer):
    recording = serializers.FileField(
        source="temp_upload", write_only=True, required=True
    )

    class Meta:
        model = Recording
        fields = ["id", "url", "title", "meeting", "upload", "recording"]
        read_only_fields = ["upload"]
        extra_kwargs = {
            "url": {"lookup_field": "hashed_id"},
            "meeting": {"lookup_field": "hashed_id"},
        }

    def create(self, validated_data):
        meeting = Meeting.objects.get(
            id=Meeting.decode_hashed_id(validated_data.pop("meeting"))
        )

        try:
            recording = Recording.objects.create(meeting=meeting, **validated_data)
        except:
            raise ValidationError({"error": "Error in add recording to db."})

        return recording

    def update(self, instance, validated_data):
        if "meeting" in validated_data:
            raise ValidationError(
                {"meeting": "Meeting cannot be edited in PATCH requests."}
            )

        if "recording" in validated_data:
            raise ValidationError(
                {"recording": "Recording cannot be edited in PATCH requests."}
            )

        return super().update(instance, validated_data)

    def to_internal_value(self, data):
        if "meeting" in data:
            meeting = data.pop("meeting")

            # Validation
            try:
                # form type = form-data not json
                meeting = meeting[0]
            except:
                raise ValidationError({"meeting": "Invalid input."})

            if not isinstance(meeting, str):
                raise ValidationError({"meeting": "Must be a valid hashed_id string."})

            if re.match(f".*\/api\/meetings\/[{get_hashed_alphabet()}]+\/?$", meeting):
                temp = meeting.rstrip("/")
                meeting = temp[temp.rfind("/") + 1 :]

            if not re.match(f"^[{get_hashed_alphabet()}]+$", meeting):
                raise ValidationError({"meeting": "Must be a valid hashed_id string."})

            try:
                Meeting.decode_hashed_id(meeting)
            except ValueError:
                raise ValidationError({"meeting": "Invalid hashed_id string."})

            if not Meeting.objects.filter(
                id=Meeting.decode_hashed_id(meeting),
            ).exists():
                raise ValidationError(
                    {"meeting": f"Meeting: {meeting} does not exist."}
                )

            # copied from super(), manually removing "meeting" from validation
            validated_data = OrderedDict()
            errors = OrderedDict()
            fields = self._writable_fields
            fields = (
                instance
                for name, instance in self.fields.items()
                if not instance.read_only and name != "meeting"
            )

            for field in fields:
                validate_method = getattr(self, "validate_" + field.field_name, None)
                primitive_value = field.get_value(data)
                try:
                    validated_value = field.run_validation(primitive_value)
                    if validate_method is not None:
                        validated_value = validate_method(validated_value)
                except ValidationError as exc:
                    errors[field.field_name] = exc.detail
                except DjangoValidationError as exc:
                    errors[field.field_name] = get_error_detail(exc)
                except serializers.SkipField:
                    pass
                else:
                    set_value(validated_data, field.source_attrs, validated_value)

            if errors:
                raise ValidationError(errors)

            validated_data["meeting"] = meeting

            return validated_data

        return super().to_internal_value(data)


class NotesSerializer(HashedIdModelSerializer):
    class Meta:
        model = Notes
        fields = ["id", "url", "title", "meeting", "content"]
        read_only_fields = ["meeting"]
        extra_kwargs = {
            "url": {"lookup_field": "hashed_id"},
            "meeting": {"lookup_field": "hashed_id"},
        }
