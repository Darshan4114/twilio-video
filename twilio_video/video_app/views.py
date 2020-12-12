from django.shortcuts import render
from django.http import HttpResponse
import os
import json
from twilio.rest import Client
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant
from .models import Person, Room
from .forms import PersonForm, RoomForm

account_sid = 'AC6e12a4b5aa86433ede29a13170c275cb'

api_key_sid = "SK62ced009b53d4a9f29633a7aa68f36f6"
api_key_secret = "AB4G86EbZu0q61YeeIQzuz0XBrtRDA1P"
client = Client(api_key_sid, api_key_secret)
# Create your views here.

#Create Room

#Creating Token helper function
def token(person_name, room_name):
    person_name = str(person_name)
    room_name = str(room_name)

    # required for Video grant
    identity = person_name

    # Create Access Token with credentials
    token = AccessToken(account_sid, api_key_sid, api_key_secret, identity=identity)

    # Create a Video grant and add to token
    video_grant = VideoGrant(room= room_name)
    token.add_grant(video_grant)

    # Return token info as JSON and striping 'b' and quotes.
    a_token = str(token.to_jwt())
    jwt_token = a_token[2:-1]
    
    return jwt_token

# def getRoomTracks(room):
#     participants = client.video.rooms(room).participants
#     track_list=[]

#     for participant in participants.list(status='connected'):
#         publishedtrack = client.video.rooms(room)\
#             .participants.get(participant.fetch().sid)\
#             .published_tracks.get('Cyamera')\
#             .fetch()
        
#         my_track = publishedtrack.sid
#         my_track = '[RemoteVideoTrack #2: '+my_track+']'
#         track_list.append(my_track)
#     return(track_list)

def get_participants(room_name):
    participants = client.video.rooms(room_name).participants
    participants_list=[]
    for participant in participants.list(status='connected'):
        participant = participant.fetch().sid
        participants_list.append(participant)
    return(participants_list)

def create(request):
    # Download the helper library from https://www.twilio.com/docs/python/install
    # Your Account Sid and Auth Token from twilio.com/console
    # DANGER! This is insecure. See http://twil.io/secure
    api_key_sid = "SK62ced009b53d4a9f29633a7aa68f36f6"
    api_key_secret = "AB4G86EbZu0q61YeeIQzuz0XBrtRDA1P"
    client = Client(api_key_sid, api_key_secret)


    if request.method == "POST":
        print('req.post : ', request.POST)
        room_form = RoomForm(request.POST)
        person_form = PersonForm(request.POST)

        if room_form.is_valid():
            print("Room form is valid")
            
            if person_form.is_valid():
                print("Person form is valid")
                
                # Taking input from Forms
                room_name = room_form.cleaned_data['room_name']
                person_name = person_form.cleaned_data['person_name']
                person_gender = person_form.cleaned_data['gender']
                person_role = person_form.cleaned_data['role']

                participants = client.video.rooms(room_name).participants

                for participant in participants.list(status='connected'):
                    print("participant:", participant.fetch().identity)
                
                        # ....................................ROOM_LOGIC................................

                #Checking if Room already exists
                if Room.objects.filter(room_name = room_name).exists():
                    room = Room.objects.get(room_name = room_name)
                    #Room exists
                    # Variables(name & token) from Django's DB
                    room_name = room.room_name
                    room_token = room.room_token

                    #If room does not exist
                else:

                    # Creating twilio room
                    twilio_room = client.video.rooms.create(unique_name=room_name)

                    
                    #Setting variables(name & token) as per newly created room
                    #Room name is defined from Form

                    # NEW_ROOM_TOKEN
                    room_token = str(twilio_room.sid)

                    

                    # Creating Django room                    
                    room = Room.objects.create(room_name = room_name, room_token = room_token)
                    room.save()

                                    
                        # ....................................PERSON_LOGIC................................


                #Creating new person token everytime as we don't check if it's same room and person
                person_token = str(token(person_name, room_name))

                #Creating Person if not exists
                if Person.objects.filter(person_name = person_name).exists():
                    person = Person.objects.get(person_name = person_name)

                    #Person exists

                    # Variables(name & token) from Django's DB
                    person_name = person.person_name
                    person_token = person.person_token
                    

                else:
                    #Person does not exist
                    person = Person.objects.create(
                        person_name = person_name,
                        person_token = person_token,
                        gender = person_gender,
                        role = person_role,
                    )
                    person.save()
                    
                    #Setting variables(name & token) as per newly created room
                    #Person name is defined from Form
                    #person_token is generated new everytime

                
                # ...................................GETTING_PARTICIPANTS_LIST..........................
                
                
                # trackList = getRoomTracks(room_name)

                participantsList = get_participants(room_name)
                

                print("PERSON_TOKEN : ", person_token, ":end:")

                print("ROOM_TOKEN : ", room_token, ":end:")

                context = {
                    "context":{
                        'person_name': person_name,
                        'person_token': person_token,
                        'room_name': room_name,
                        'room_token': room_token,
                        'participantsList' : participantsList,
                    }                
                }
                #Get in the room             

                return render(request, "in_room.html", context)

        
    #If not request.POST, render forms
    else:
        room_form = RoomForm()
        person_form = PersonForm()
        context = {
                        'room_form': RoomForm(),
                        'person_form' : PersonForm(),
                    }

    return render(request, "create_room.html", context)

def room(request):
    return render(request, "in_room.html")