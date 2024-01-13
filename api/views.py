from django.contrib.auth import authenticate, login
from django.core.cache import cache
from django.db.models import Q
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from .models import HashedIdModel, Meeting, Notes, Recording, Team, User
from .permissions import IsUserOrReadOnly
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


class HashedIdModelViewSet(viewsets.ModelViewSet):
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
