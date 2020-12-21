from django.conf import settings
from twilio.rest import Client

twilio_api_key_sid = settings.TWILIO_API_KEY_SID
twilio_api_key_secret = settings.TWILIO_API_KEY_SECRET
client = Client(twilio_api_key_sid, twilio_api_key_secret)

def get_participants(room_name):
    participants = client.video.rooms(room_name).participants
    participants_list=[]
    for participant in participants.list(status='connected'):
        participant = participant.fetch().sid
        participants_list.append(participant)
    return(participants_list)
