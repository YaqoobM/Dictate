from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet, "user")
router.register(r"teams", views.TeamViewSet, "team")
router.register(r"meetings", views.MeetingViewSet, "meeting")

urlpatterns = [path("test", views.test), path("", include(router.urls))]
