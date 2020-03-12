from django.db import models

# Create your models here.


class Room(models.Model):
    room_name = models.CharField(max_length = 30)
    room_token = models.TextField(blank = True, null = True)

class Person(models.Model):
    GENDER_CHOICES = (
        ("M", "MALE"),
        ("F", "FEMALE"),
        ("O", "OTHER"),
    )

    ROLE_CHOICES = (
        ("D", "DOCTOR"),
        ("P", "PATIENT"),
    )

    person_name = models.CharField(max_length = 100)
    person_token = models.TextField(blank = True, null = True)
    gender = models.CharField(max_length = 1, choices = GENDER_CHOICES, default = "M")
    role = models.CharField(max_length = 1, choices = ROLE_CHOICES, default = "D")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, default="1")

