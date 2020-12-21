from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

account_sid = 'AC9e157590d76a6ce9aff6350ba3b4bfd3'

api_key_sid = "SK324fef26fbac3947eb905edbd31e50fa"
api_key_secret = "AEsTZcKySZFnPuCgijsey7yb3zBNPzMp"


def create_token(person_name, room_name):
    person_name = str(person_name)
    room_name = str(room_name)

    # required for Video grant
    identity = person_name

    # Create Access Token with credentials
    token = AccessToken(account_sid, api_key_sid,
                        api_key_secret, identity=identity)

    # Create a Video grant and add to token
    video_grant = VideoGrant(room=room_name)
    token.add_grant(video_grant)

    # Return token info as JSON and striping 'b' and quotes.
    a_token = str(token.to_jwt())
    jwt_token = a_token[2:-1]
    print(jwt_token, 'token')
    return jwt_token
