from django.contrib.auth import authenticate, login
from django.core.cache import cache
from django.db.models import Q
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Meeting, Notes, Recording, Team, User
from .permissions import IsOwnerOrReadOnly
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


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    lookup_field = "hashed_id"
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        """Get self and all team members"""

        return User.objects.filter(
            Q(email__exact=self.request.user.email)
            | Q(teams__in=self.request.user.teams.all())
        ).distinct()

    def get_object(self):
        """Transform hashed_id lookup field -> pk"""

        obj = get_object_or_404(
            self.get_queryset(),
            id__exact=User.decode_hashed_id(self.kwargs["hashed_id"]),
        )

        self.check_object_permissions(self.request, obj)

        return obj
