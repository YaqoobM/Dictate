from django.contrib.auth import get_user_model
from rest_framework import permissions


class IsUserOrReadOnly(permissions.BasePermission):
    """
    Check the request is accessing their own profile.
    Permission only validated on 'object views'.
    """

    def has_object_permission(self, request, view, obj) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True

        # /api/users/<id>
        if isinstance(obj, get_user_model()):
            return obj == request.user

        return False


class IsNotAuthenticated(permissions.BasePermission):
    """
    Allows access only to non-authenticated users.
    """

    def has_permission(self, request, view):
        return bool(
            not request.user or (request.user and not request.user.is_authenticated)
        )
