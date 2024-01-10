from django.contrib import admin
from django.urls import include, re_path

urlpatterns = [
    re_path(r"", include("frontend.urls")),
    re_path(r"^api/?$", include("api.urls")),  # api end points
    re_path(r"^admin/?$", admin.site.urls),  # admin panel
    re_path(r"^__debug__/?$", include("debug_toolbar.urls")),  # browser debug toolbar
    re_path(r"^api-auth/?$", include("rest_framework.urls")),  # for rest browsable api
]
