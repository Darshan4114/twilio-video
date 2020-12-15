import random

def create_room_name():

    adj_list =[
        'amiable',
        'bright',
        'funny',
        'polite',
        'likable',
        'sincere',
        'helpful',
        'giving',
        'kind',
        'patient',
        'dynamic',
        'loyal',
        'brave',
        'sincere',
        'willing',
        'loving',
        'nice',
        'plucky',
        'frank',
        'capable',
        'adept',
        'expert',
        'amazing',
        'awesome',
        'unique',
        'perfect',
        'rousing',
        'stellar',
        'super',
        'upbeat',
        'ample',
        'vivid',
        'vibrant',
        'glowing',
        'elegant',
        'sleek',
        'lovely',
        'devoted',
        'relaxed',
        'focused',
        'honest'
        ]

    fl_list = [
    'Aster',
    'Bloom',
    'Bugle',
    'Clary',
    'Daisy',
    'Erica',
    'Lilac',
    'Lotus',
    'Lupin',
    'Orpin',
    'Oxeye',
    'Oxlip',
    'Pagle',
    'Pansy',
    'Peony',
    'Phlox',
    'Poppy',
    'Stock',
    'Tansy',
    'Tulip',
    'Vinca',
    'Viola'
    ]
    # with open('twilio_video\video_app\helper_functions\adjective_list.txt', 'r') as f:
        # content = f.read().lower().split(",")
    adj_list = list(map(str.strip,adj_list))
    adj_list = list(filter(lambda x:len(x)<8, adj_list))
    adjective = random.choice(adj_list)

    # with open('twilio_video\video_app\helper_functions\flower_list.txt', 'r') as f:
        # content = f.read().lower().split(",")
    fl_list = list(map(str.strip,fl_list))
    fl_list = list(filter(lambda x:len(x)<8, fl_list))
    flower = random.choice(fl_list)

    room_name = adjective+'-'+flower+str(random.randint(1,10))
    return(room_name)
