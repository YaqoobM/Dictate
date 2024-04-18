from django.urls import path, re_path

from . import views

urlpatterns = [path("", views.get_react), re_path(r"^.*/$", views.get_react)]
