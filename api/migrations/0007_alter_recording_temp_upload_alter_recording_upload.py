# Generated by Django 4.2.7 on 2024-01-23 13:36

import api.helpers
import django.core.files.storage
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_alter_user_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="recording",
            name="temp_upload",
            field=models.FileField(
                null=True,
                storage=django.core.files.storage.FileSystemStorage(),
                upload_to="temp_recordings/",
                validators=[django.core.validators.FileExtensionValidator(["webm"])],
                verbose_name="pre-processed recording",
            ),
        ),
        migrations.AlterField(
            model_name="recording",
            name="upload",
            field=models.FileField(
                blank=True,
                null=True,
                storage=api.helpers.get_remote_storage,
                upload_to="recordings/",
                validators=[django.core.validators.FileExtensionValidator(["mp4"])],
                verbose_name="post-processed recording",
            ),
        ),
    ]
