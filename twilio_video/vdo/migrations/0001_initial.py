# Generated by Django 3.0.4 on 2020-03-09 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('token', models.TextField(blank=True, null=True)),
                ('gender', models.CharField(choices=[('M', 'MALE'), ('F', 'FEMALE'), ('O', 'OTHER')], default='M', max_length=1)),
                ('role', models.CharField(choices=[('D', 'DOCTOR'), ('P', 'PATIENT')], default='D', max_length=1)),
            ],
        ),
    ]
