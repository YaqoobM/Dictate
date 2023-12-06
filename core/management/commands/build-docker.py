import os
import subprocess
from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "CMD script to build project in docker container after creation (used in Dockerfile)"

    def handle(self, *args: Any, **options: Any) -> str | None:
        os.replace(
            os.path.join(
                settings.BASE_DIR, "frontend/static/frontend/react/index.html"
            ),
            os.path.join(
                settings.BASE_DIR, "frontend/templates/frontend/react/index.html"
            ),
        )

        call_command("collectstatic", no_input=True)
        call_command("makemigrations")
        call_command("migrate")

        subprocess.run(
            ["python", "manage.py", "createsuperuser", "--no-input"],
        )
