# Generated by Django 4.2.7 on 2024-01-12 20:11

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_meeting_alter_user_email_team_recording_notes_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meeting',
            name='start_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
