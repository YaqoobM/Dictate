# Generated by Django 4.2.7 on 2024-01-13 01:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_alter_meeting_start_time"),
    ]

    operations = [
        migrations.RenameField(
            model_name="meeting",
            old_name="users",
            new_name="participants",
        ),
    ]
