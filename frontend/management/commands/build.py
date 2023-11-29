import os
import subprocess
from typing import Any

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Script to build react project from command line from project root"

    def handle(self, *args: Any, **options: Any) -> str | None:
        subprocess.run(
            ["npm", "run", "build"],
            cwd=f"{settings.BASE_DIR}/frontend/react",
        )

        os.replace(
            f"{settings.BASE_DIR}/frontend/static/frontend/react/index.html",
            f"{settings.BASE_DIR}/frontend/templates/frontend/react/index.html",
        )

        call_command("collectstatic", no_input=True)
