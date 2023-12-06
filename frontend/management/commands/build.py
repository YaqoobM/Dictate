import os
import shutil
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
            cwd=f"{settings.BASE_DIR}/react",
        )

        shutil.copytree(
            os.path.join(settings.BASE_DIR, "react/dist"),
            os.path.join(settings.BASE_DIR, "frontend/static/frontend/react"),
            dirs_exist_ok=True,
        )

        os.replace(
            os.path.join(
                settings.BASE_DIR, "frontend/static/frontend/react/index.html"
            ),
            os.path.join(
                settings.BASE_DIR, "frontend/templates/frontend/react/index.html"
            ),
        )

        call_command("collectstatic", no_input=True)
