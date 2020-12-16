from django.forms import ModelForm
from .models import Person, Room

class PersonForm(ModelForm):
    class Meta:
        model = Person
        fields=['person_name']

