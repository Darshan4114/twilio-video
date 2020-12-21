import random
from django.conf import settings


def create_room_name():
    with open(settings.BASE_DIR + '/video_app/helper_functions/adjective_list.txt', 'r') as f:
        adj_list = f.read().lower().split(",")
        adj_list = list(map(str.strip, adj_list))
        adj_list = list(filter(lambda x: len(x) < 8, adj_list))
        adjective = random.choice(adj_list)

    with open(settings.BASE_DIR + '/video_app/helper_functions/flower_list.txt', 'r') as f:
        fl_list = f.read().lower().split(",")
        fl_list = list(map(str.strip, fl_list))
        fl_list = list(filter(lambda x: len(x) < 7, fl_list))
        flower = random.choice(fl_list)

    room_name = adjective+'-'+flower+str(random.randint(1, 10))

    return room_name
