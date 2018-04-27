from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_cell_neighbors'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='spawn_locations',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
