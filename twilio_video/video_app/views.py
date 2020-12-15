from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
import os
import json
from twilio.rest import Client
from .models import Person, Room
from .forms import PersonForm, RoomForm

from video_app.helper_functions.create_token import token
from video_app.helper_functions.get_participants import get_participants
from video_app.helper_functions.create_room_name import create_room_name
from video_app.helper_functions.create_room import create_room

twilio_api_key_sid = settings.TWILIO_API_KEY_SID
twilio_api_key_secret = settings.TWILIO_API_KEY_SECRET
client = Client(twilio_api_key_sid, twilio_api_key_secret)

# def CreateRoomView(request):


#     if request.method == "POST":
#         print('req.post : ', request.POST)
#         room_form = RoomForm(request.POST)
#         person_form = PersonForm(request.POST)

#         if room_form.is_valid():
#             print("Room form is valid")
            
#             if person_form.is_valid():
#                 print("Person form is valid")
                
                # Taking input from Forms
                # room_name = room_form.cleaned_data['room_name']
                # person_name = person_form.cleaned_data['person_name']

                # participants = client.video.rooms(room_name).participants

                # for participant in participants.list(status='connected'):
                #     print("participant:", participant.fetch().identity)
                
                        # ....................................ROOM_LOGIC................................

                #Checking if Room already exists
                # if Room.objects.filter(room_name = room_name).exists():
                #     room = Room.objects.get(room_name = room_name)
                    #Room exists
                    # Variables(name & token) from Django's DB
                    # room_name = room.room_name
                    # room_token = room.room_token

                    #If room does not exist
                # else:

                    # Creating twilio room
                    # twilio_room = client.video.rooms.create(unique_name=room_name)

                    
                    #Setting variables(name & token) as per newly created room
                    #Room name is defined from Form

                    # NEW_ROOM_TOKEN
                    # room_token = str(twilio_room.sid)

                    

                    # Creating Django room                    
                    # room = Room.objects.create(room_name = room_name, room_token = room_token)
                    # room.save()

                                    
                        # ....................................PERSON_LOGIC................................


                #Creating new person token everytime as we don't check if it's same room and person
                # person_token = str(token(person_name, room_name))

                #Creating Person if not exists
                # if Person.objects.filter(person_name = person_name).exists():
                #     person = Person.objects.get(person_name = person_name)
                    #Person exists

                    # Variables(name & token) from Django's DB
                    # person_name = person.person_name
                    # person_token = person.person_token
                    

                # else:
                    #Person does not exist
                    # person = Person.objects.create(
                    #     person_name = person_name,
                    #     person_token = person_token,
                    #     )
                    # person.save()
                    
                    #Setting variables(name & token) as per newly created room
                    #Person name is defined from Form
                    #person_token is generated new everytime

                
                # ...................................GETTING_PARTICIPANTS_LIST..........................
                
                
                # trackList = getRoomTracks(room_name)

                # participantsList = get_participants(room_name)
                

                # print("PERSON_TOKEN : ", person_token, ":end:")

                # print("ROOM_TOKEN : ", room_token, ":end:")

                # context = {
                #     "context":{
                #         'person_name': person_name,
                #         'person_token': person_token,
                #         'room_name': room_name,
                #         'room_token': room_token,
                #         'participantsList' : participantsList,
                #     }                
                # }
                #Get in the room             

                # return render(request, "in_room.html", context)

        
    #If not request.POST, render forms
    # else:
    #     room_form = RoomForm()
    #     person_form = PersonForm()
    #     context = {
    #                     'room_form': RoomForm(),
    #                     'person_form' : PersonForm(),
    #                 }


    # return render(request, "create_room.html", context)


class RoomView(View):
    def get(self, request):
        room_name, room_sid = create_room()
        request.session['room_name'] = room_name
        request.session['room_sid'] = room_sid

        person_form = PersonForm()
        context={
            "room_name":room_name,
            "room_sid":room_sid,
            "person_form":person_form,
        }
        return render(request, 'create_room.html', context)

    def post(self, request):
        room_name = request.session.get('room_name')
        room_sid = request.session.get('room_sid')
        participantsList = get_participants(room_name)
        person_form = PersonForm(request.POST)
        if person_form.is_valid():
            person_name = person_form.cleaned_data['person_name']
            person_token = str(token(person_name, room_name))
            person = Person.objects.create(
                person_name = person_name,
                person_token = person_token,
                )
            person.save()
        
            context={
                "context":{
                        'person_name': person_name,
                        'person_token': person_token,
                        'room_name': room_name,
                        'room_sid': room_sid,
                        'participantsList' : participantsList,
                    }
            }

            return render(request, 'in_room.html', context)
        else:
            return HttpResponse('person form error')