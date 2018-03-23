# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2018-03-22 07:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_room_teacher'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='username',
            field=models.TextField(default='unknown'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='room',
            name='isActive',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='room',
            name='timestamp',
            field=models.DateTimeField(db_index=True, default=django.utils.timezone.now),
        ),
    ]
