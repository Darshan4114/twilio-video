from django.forms import ModelForm
from .models import Person, Room

class RoomForm(ModelForm):
    class Meta:
        model = Room
        fields = ['room_name']

class PersonForm(ModelForm):
    class Meta:
        model = Person
        fields=['person_name']

