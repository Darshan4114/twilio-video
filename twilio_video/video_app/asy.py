import json
from twilio.rest import Client

account_sid = 'AC21a3828b958d55216cd592cd9222e2a2'
auth_token = '3f2f917fcc308d2a1b4b66fe154e3177'
client = Client(account_sid, auth_token)

def getRoomTracks(room):
    participants = client.video.rooms(room).participants
    track_list=[]

    for participant in participants.list(status='connected'):
        publishedtrack = client.video.rooms(room)\
            .participants.get(participant.fetch().sid)\
            .published_tracks.get('Cyamera')\
            .fetch()
        
        my_track = publishedtrack.sid
        track_list.append(my_track)
    
    print("TrackList : ",track_list)

        
 
getRoomTracks('Su')