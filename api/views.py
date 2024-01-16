from django.contrib.auth import authenticate
from django.contrib.auth import login as login_user
from django.contrib.auth import logout as logout_user
from django.core.cache import cache
from django.core.exceptions import ValidationError as DefaultValidationError
from django.core.validators import validate_email
from django.db.models import Q
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import HashedIdModel, Meeting, Notes, Recording, User
from .permissions import IsNotAuthenticated, IsUserOrReadOnly
from .serializers import (
    MeetingSerializer,
    NotesSerializer,
    RecordingSerializer,
    TeamSerializer,
    UserSerializer,
)


def test(request: HttpRequest) -> HttpResponse:
    cache.set("bananas", "monkey", 100)
    print(cache.get("bananas"))

    user = authenticate(request, username="admin", password="1234")
    print(user)
    login(request, user)
    request.session["food"] = "pasta"

    return JsonResponse({"test": 123})


class HashedIdModelViewSet(ModelViewSet):
    lookup_field = "hashed_id"

    def get_object(self):
        """Transform hashed_id lookup field -> id"""

        obj = get_object_or_404(
            self.get_queryset(),
            id=HashedIdModel.decode_hashed_id(self.kwargs["hashed_id"]),
        )

        self.check_object_permissions(self.request, obj)

        return obj


class UserViewSet(HashedIdModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsUserOrReadOnly]
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """Get self and all team members"""

        return User.objects.filter(
            Q(email=self.request.user.email)
            | Q(teams__in=self.request.user.teams.all())
        ).distinct()


class TeamViewSet(HashedIdModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """Get all associated teams"""
        return self.request.user.teams.all()

    def perform_create(self, serializer):
        serializer.save(members=[self.request.user])


class MeetingViewSet(HashedIdModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """Get all team meetings and private meetings, sorted by most recent"""

        return Meeting.objects.filter(
            Q(participants__email=self.request.user.email)
            | Q(team__in=self.request.user.teams.all())
        ).order_by("-start_time")

    def perform_create(self, serializer):
        # Validate user has access to team
        if "team" in self.request.data and self.request.data["team"]:
            team = self.request.data["team"]

            if not self.request.user.teams.filter(
                id=User.decode_hashed_id(team)
            ).exists():
                raise ValidationError(
                    {"teams": f"You do not have access to team: {team}"}
                )
        else:
            # Attach as private meeting
            serializer.save(participants=[self.request.user])
        return super().perform_create(serializer)


class RecordingViewSet(HashedIdModelViewSet):
    serializer_class = RecordingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "delete", "head", "options"]

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
        raise ValidationError({"email": "Missing required field"})
    elif not isinstance(request.data["email"], str):
        raise ValidationError({"email": "Must be string data type"})

    try:
        validate_email(request.data["email"])
    except DefaultValidationError as e:
        raise ValidationError({"email": e.message})

    if "password" not in request.data:
        raise ValidationError({"password": "Missing required field"})
    elif not isinstance(request.data["password"], str):
        raise ValidationError({"password": "Must be string data type"})

    user = authenticate(
        request,
        email=request.data["email"],
        password=request.data["password"],
    )

    if user is None:
        raise ValidationError({"credentials": "Invalid username or password"})

    login_user(request, user)

    return Response(
        {
            "user": request.build_absolute_uri(
                reverse("user-detail", args=[user.hashed_id])
            )
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        logout_user(request)
    except:
        return Response({"status": "error", "message": "something went wrong"})
    return Response({"status": "success"})


@api_view(["POST"])
@permission_classes([IsNotAuthenticated])
def signup(request):
    request.data["teams"] = []

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        del serializer.validated_data["teams"]

        user = User.objects.create_user(**serializer.validated_data)
    else:
        raise ValidationError(serializer.errors)

    login_user(request, user)

    return Response(
        {
            "user": request.build_absolute_uri(
                reverse("user-detail", args=[user.hashed_id])
            ),
            "message": "successfully created account and logged in",
        }
    )
