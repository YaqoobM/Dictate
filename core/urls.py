from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

urlpatterns = [
    path("api/", include("api.urls")),  # api end points
    path("api/auth/", include("rest_framework.urls")),  # for rest browsable api
    path("admin/", admin.site.urls),  # admin panel
    path("__debug__/", include("debug_toolbar.urls")),  # browser debug toolbar
    path("", include("frontend.urls")), # catch-all react app
]

if settings.ENVIRONMENT == "development":
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
