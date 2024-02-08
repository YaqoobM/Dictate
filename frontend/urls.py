from django.contrib import admin
from django.urls import include, path, re_path

from . import views

urlpatterns = [
    path("", views.get_react),
    re_path(r"^.*/$", views.get_react)
]
