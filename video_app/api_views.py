from django.conf import settings
from django.http import JsonResponse
from twilio.rest import Client
from video_app.helper_functions.create_room_name import create_room_name

from .models import Room

twilio_api_key_sid = settings.TWILIO_API_KEY_SID
twilio_api_key_secret = settings.TWILIO_API_KEY_SECRET
client = Client(twilio_api_key_sid, twilio_api_key_secret)


def create_room(request):
    room_name = create_room_name()
    # Creating twilio room
    twilio_room = client.video.rooms.create(unique_name=room_name, type="go")

    # Setting variables(name & sid) for newly created room
    # NEW_ROOM_SID
    room_sid = str(twilio_room.sid)

    # Creating Django room
    room = Room.objects.create(room_name=room_name, room_sid=room_sid)
    room.save()

    room_data = {
        "room_name": room_name,
        "room_sid": room_sid
    }
    print('room_data', room_data)
    return JsonResponse(room_data)


def end_room(request, room_sid):
    room = client.video.rooms(room_sid).update(status='completed')
    return JsonResponse({"room_status": 'gud'})
