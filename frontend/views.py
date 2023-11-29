from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def get_react(request: HttpRequest) -> HttpResponse:
    return render(request, "frontend/react/index.html")
