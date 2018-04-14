# Generated by Django 2.0.3 on 2018-03-30 02:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game', models.TextField()),
                ('label', models.SlugField(unique=True)),
                ('teacher', models.TextField()),
                ('isActive', models.BooleanField()),
                ('nTeam', models.IntegerField(default=5)),
                ('timestamp', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
            ],
        ),
    ]
