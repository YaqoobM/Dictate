import re

from django.contrib.auth import authenticate
from django.contrib.auth import login as login_user
from django.contrib.auth import logout as logout_user
from django.core.exceptions import ValidationError as DefaultValidationError
from django.core.validators import validate_email
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse as rest_reverse
from rest_framework.viewsets import ModelViewSet

from .helpers import get_hashed_alphabet
from .models import HashedIdModel, Meeting, Notes, Recording, Team, User
from .permissions import AllowPOST, IsNotAuthenticated, IsUserOrReadOnly, ReadOnly
from .serializers import (
    MeetingSerializer,
    NotesSerializer,
    RecordingSerializer,
    TeamSerializer,
    UserSerializer,
)


class HashedIdModelViewSet(ModelViewSet):
    lookup_field = "hashed_id"

    def get_object(self):
        """Transform hashed_id lookup field -> id"""

        if len(self.kwargs["hashed_id"]) < 6:
            raise ValidationError({"hashed_id": "Invalid id."})

        if not re.match(f"^[{get_hashed_alphabet()}]+$", self.kwargs["hashed_id"]):
            raise ValidationError({"hashed_id": "Invalid id."})

        obj = get_object_or_404(
            self.get_queryset(),
            id=HashedIdModel.decode_hashed_id(self.kwargs["hashed_id"]),
        )

        self.check_object_permissions(self.request, obj)

        return obj


class UserViewSet(HashedIdModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsUserOrReadOnly]
    http_method_names = ["get", "patch", "delete", "head", "options"]


class TeamViewSet(HashedIdModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """Get all all teams if attempting to join, otherwise filter associated teams"""
        if self.action == "join":
            return Team.objects.all()

        return self.request.user.teams.all()

    def perform_create(self, serializer):
        return serializer.save(members=[self.request.user])

    @action(detail=True, methods=["post"])
    def join(self, request, hashed_id=None):
        team = self.get_object()

        if team in self.request.user.teams.all():
            return Response({"message": "already part of team"}, 400)

        self.request.user.teams.add(team)
        self.request.user.save()

        serializer = TeamSerializer(team, context={"request": request})
        return Response({"team": serializer.data, "status": "success"})

    @action(detail=True, methods=["post"])
    def leave(self, request, hashed_id=None):
        team = self.get_object()
        self.request.user.teams.remove(team)
        self.request.user.save()
        return Response({"status": "success"})


class MeetingViewSet(HashedIdModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated | ReadOnly | AllowPOST]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """
        Get all team meetings and private meetings if signed in, sorted by most recent.
        If searching for a specific meeting include all public meetings that haven't
        ended regardless of request authentication.
        """

        if self.action != "retrieve" and not self.request.user.is_authenticated:
            # prevent listing all public meetings w/o searching by id
            return Meeting.objects.none()

        query = Q()

        if self.action == "retrieve":
            # append "OR"
            query |= Q(team__isnull=True) & Q(end_time__isnull=True)

        if self.request.user.is_authenticated:
            # append "OR"
            query |= Q(participants__email=self.request.user.email) | Q(
                team__in=self.request.user.teams.all()
            )

        return Meeting.objects.filter(query).order_by("-start_time")

    def perform_create(self, serializer):
        # Validate user has access to team
        if "team" in self.request.data and self.request.data["team"]:
            team = self.request.data["team"]

            if not self.request.user.is_authenticated:
                raise ValidationError(
                    {"teams": f"You do not have access to team: {team}."}
                )

            if not self.request.user.teams.filter(
                id=User.decode_hashed_id(team)
            ).exists():
                raise ValidationError(
                    {"teams": f"You do not have access to team: {team}."}
                )
        elif self.request.user.is_authenticated:
            # Attach as private meeting
            return serializer.save(participants=[self.request.user])

        return serializer.save()

    def perform_update(self, serializer):
        if "team" in self.request.data:
            raise ValidationError({"team": "'team' is read-only after creation."})
        return super().perform_update(serializer)


class RecordingViewSet(HashedIdModelViewSet):
    serializer_class = RecordingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """Get all recordings, sorted by most recent"""

        return Recording.objects.filter(
            Q(meeting__participants__email=self.request.user.email)
            | Q(meeting__team__in=self.request.user.teams.all())
        ).order_by("-meeting__start_time")


class NotesViewSet(HashedIdModelViewSet):
    serializer_class = NotesSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """Get all notes, sorted by most recent"""

        return Notes.objects.filter(
            Q(meeting__participants__email=self.request.user.email)
            | Q(meeting__team__in=self.request.user.teams.all())
        ).order_by("-meeting__start_time")


@api_view(["POST"])
@permission_classes([IsNotAuthenticated])
@csrf_protect
def login(request):
    if "email" not in request.data:
        raise ValidationError({"email": "Missing required field."})
    elif not isinstance(request.data["email"], str):
        raise ValidationError({"email": "Must be string data type."})

    try:
        validate_email(request.data["email"])
    except DefaultValidationError as e:
        raise ValidationError({"email": e.message})

    if "password" not in request.data:
        raise ValidationError({"password": "Missing required field."})
    elif not isinstance(request.data["password"], str):
        raise ValidationError({"password": "Must be string data type."})

    user = authenticate(
        request,
        email=request.data["email"],
        password=request.data["password"],
    )

    if user is None:
        raise ValidationError({"credentials": "Invalid username or password."})

    login_user(request, user)

    return Response(
        {"user": rest_reverse("user-detail", args=[user.hashed_id], request=request)}
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        logout_user(request)
    except:
        return Response({"status": "error", "message": "something went wrong."}, 400)
    return Response({"status": "success"})


@api_view(["POST"])
@permission_classes([IsNotAuthenticated])
def signup(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = User.objects.create_user(**serializer.validated_data)
    else:
        raise ValidationError(serializer.errors)

    login_user(request, user)

    return Response(
        {
            "user": rest_reverse("user-detail", args=[user.hashed_id], request=request),
            "message": "successfully created account and logged in.",
        },
        status=201,
    )


@api_view(["GET"])
def profile(request):
    if not request.user.is_authenticated:
        return Response(
            {"credentials": "sign in or create an account to access your profile."}, 401
        )

    serializer = UserSerializer(request.user, context={"request": request})

    return Response({"user": serializer.data})
