from django.conf import settings
from twilio.rest import Client

twilio_api_key_sid = settings.TWILIO_API_KEY_SID
twilio_api_key_secret = settings.TWILIO_API_KEY_SECRET
client = Client(twilio_api_key_sid, twilio_api_key_secret)

def create_room(request):
    room_name = create_room_name()
     # Creating twilio room
    twilio_room = client.video.rooms.create(unique_name=room_name)

    #Setting variables(name & sid) for newly created room
    # NEW_ROOM_SID
    room_sid = str(twilio_room.sid)

    # Creating Django room                    
    room = Room.objects.create(room_name = room_name, room_sid = room_sid)
    room.save()

    return (room_name, room_sid)