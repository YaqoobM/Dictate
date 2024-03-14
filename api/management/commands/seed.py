from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "CMD script to seed tables with pre-defined data"

    def handle(self, *args, **options):
        call_command("loaddata", "api/seeder")

        # hash passwords correctly
        users = get_user_model().objects.all()
        for user in [user for user in users if user.password == "123"]:
            user.set_password(user.password)
            user.save()
