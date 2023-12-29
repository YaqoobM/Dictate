import os

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand
from dotenv import load_dotenv


class Command(BaseCommand):
    help = "CMD script to setup db tables"

    def handle(self, *args, **options) -> str | None:
        load_dotenv()
        call_command("makemigrations")
        call_command("migrate")

        User = get_user_model()

        try:
            User.objects.get(username=os.getenv("DJANGO_SUPERUSER_USERNAME"))
            self.stdout.write(self.style.NOTICE("Superuser already exists"))
        except User.DoesNotExist:
            User.objects.create_superuser(
                username=os.getenv("DJANGO_SUPERUSER_USERNAME"),
                email=os.getenv("DJANGO_SUPERUSER_EMAIL"),
                password=os.getenv("DJANGO_SUPERUSER_PASSWORD"),
            )
            self.stdout.write(self.style.SUCCESS("Created superuser"))
        except:
            self.stdout.write(
                self.style.ERROR("Something went wrong creating the superuser")
            )
