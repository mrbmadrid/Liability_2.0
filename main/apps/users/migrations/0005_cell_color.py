# Generated by Django 2.0.4 on 2018-04-26 04:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20180425_2008'),
    ]

    operations = [
        migrations.AddField(
            model_name='cell',
            name='color',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
