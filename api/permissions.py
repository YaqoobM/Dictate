from django.contrib.auth import get_user_model
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
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

        # /api/comments/<id>
        # elif isinstance(obj, Comment):
        #     return obj in request.user.comments.all()

        return False
