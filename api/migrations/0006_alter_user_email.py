# Generated by Django 4.2.7 on 2024-01-14 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_notes_meeting_alter_recording_meeting'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(default='abc@dictate.com', max_length=254, unique=True, verbose_name='email address'),
            preserve_default=False,
        ),
    ]