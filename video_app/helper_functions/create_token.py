from django.conf import settings
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

twilio_account_sid = settings.TWILIO_ACCOUNT_SID

twilio_api_key_sid = settings.TWILIO_API_KEY_SID
twilio_api_key_secret = settings.TWILIO_API_KEY_SECRET


def create_token(person_name, room_name):
    person_name = str(person_name)
    room_name = str(room_name)

    # required for Video grant
    identity = person_name

    # Create Access Token with credentials
    token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                        twilio_api_key_secret, identity=identity)

    # Create a Video grant and add to token
    video_grant = VideoGrant(room=room_name)
    token.add_grant(video_grant)

    # Return token info as JSON and striping 'b' and quotes.
    a_token = str(token.to_jwt())
    jwt_token = a_token[2:-1]
    print(jwt_token, 'token')
    return jwt_token
