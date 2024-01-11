from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("frontend.urls")),
    path("api/", include("api.urls")),  # api end points
    path("admin/", admin.site.urls),  # admin panel
    path("__debug__/", include("debug_toolbar.urls")),  # browser debug toolbar
    path("api-auth/", include("rest_framework.urls")),  # for rest browsable api
]
