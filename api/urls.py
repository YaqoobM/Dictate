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
    path("who_am_i/", views.who_am_i, name="user-profile"),
    path("login/", views.login, name="user-login"),
    path("logout/", views.logout, name="user-logout"),
    path("signup/", views.signup, name="user-signup"),
]
