from django.db import models

# Create your models here.


class Room(models.Model):
    room_name = models.CharField(max_length = 30)
    room_sid = models.TextField(blank = True, null = True)

class Person(models.Model):
    person_name = models.CharField(max_length = 100)
    person_token = models.TextField(blank = True, null = True)

