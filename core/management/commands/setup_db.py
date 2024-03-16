import os
import time

from django.contrib.auth import get_user_model
from django.core.management import CommandError, call_command
from django.core.management.base import BaseCommand, CommandParser
from django.db import OperationalError, connections
from dotenv import load_dotenv


class Command(BaseCommand):
    help = "CMD script to setup database"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--ensure-connection-only",
            action="store_true",
            help="Returns after testing connection without touching the database",
        )

    def handle(self, *args, **options) -> str | None:
        load_dotenv()

        max_retries = 10

        while True:
            max_retries -= 1
            if max_retries == 0:
                raise CommandError("failed to connect to database")

            try:
                self.stdout.write("testing db connection...")
                connections["default"].ensure_connection()
                self.stdout.write(self.style.SUCCESS("database available!"))
                break
            except OperationalError:
                self.stdout.write(
                    self.style.ERROR("database unavailable, waiting 1 sec...")
                )
                time.sleep(1)

        if "ensure-connection-only" in options and options["ensure-connection-only"]:
            return

        self.stdout.write("running migrations...")
        call_command("makemigrations")
        call_command("migrate")

        self.stdout.write("seeding tables...")
        if os.getenv("ENVIRONMENT") == "development":
            call_command("seed")
            self.stdout.write(self.style.SUCCESS("Seeded test data"))

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
