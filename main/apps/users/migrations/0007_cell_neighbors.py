
# Generated by Django 2.0.3 on 2018-04-26 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_player_profile_move'),
    ]

    operations = [
        migrations.AddField(
            model_name='cell',
            name='neighbors',
            field=models.CharField(max_length=255, null=True),
        ),
    ]

# Generated by Django 2.0.4 on 2018-04-26 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_player_profile_move'),
    ]

    operations = [
        migrations.AddField(
            model_name='cell',
            name='neighbors',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
