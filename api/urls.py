from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet, "user")
router.register(r"teams", views.TeamViewSet, "team")
router.register(r"meetings", views.MeetingViewSet, "meeting")
router.register(r"recordings", views.RecordingViewSet, "recording")
router.register(r"notes", views.NotesViewSet, "notes")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", views.login),
    path("logout/", views.logout),
    path("signup/", views.signup),
    path("profile/", views.profile),
]
