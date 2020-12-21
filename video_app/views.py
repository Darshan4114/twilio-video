from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, JsonResponse, Http404
from django.conf import settings
import os
import json
from twilio.rest import Client
from .models import Person, Room
from .forms import PersonForm

from video_app.helper_functions.get_participants import get_participants
from video_app.helper_functions.create_token import create_token

twilio_api_key_sid = settings.TWILIO_API_KEY_SID
twilio_api_key_secret = settings.TWILIO_API_KEY_SECRET
client = Client(twilio_api_key_sid, twilio_api_key_secret)


def HomeView(request):
    return render(request, 'home.html')


class RoomView(View):
    def get(self, request, *args, **kwargs):
        room_name = self.kwargs['room_name']
        try:
            room = client.video.rooms(room_name).fetch()
            person_form = PersonForm()
            context = {
                "room_name": room_name,
                "room_sid": room.sid,
                "person_form": person_form
            }
            print("context = ", context)
            return render(request, 'join_room.html', context)
        except:
            raise Http404("Room not found")

    def post(self, request, *args, **kwargs):
        room_name = self.kwargs['room_name']
        person_form = PersonForm(request.POST)
        if person_form.is_valid():
            # try:
            room = client.video.rooms(room_name).fetch()
            person_name = person_form.cleaned_data['person_name']
            person_token = create_token(person_name, room_name)
            context = {
                "context": {
                    'person_name': person_name,
                    'person_token': person_token,
                    'room_name': room_name,
                    'room_sid': room.sid,
                    'participantsList': get_participants(room_name),
                }
            }
            return render(request, 'in_room.html', context)
