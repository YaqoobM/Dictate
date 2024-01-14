from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def get_react(request: HttpRequest) -> HttpResponse:
    return render(request, "frontend/react/index.html")
