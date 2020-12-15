import random

def create_room_name():
    with open('./adjective_list.txt', 'r') as f:
        content = f.read().lower().split(",")
        adj_list = list(map(str.strip,content))
        adj_list = list(filter(lambda x:len(x)<8, adj_list))
        adjective = random.choice(adj_list)

    with open('./flower_list.txt', 'r') as f:
        content = f.read().lower().split(",")
        fl_list = list(map(str.strip,content))
        fl_list = list(filter(lambda x:len(x)<8, fl_list))
        flower = random.choice(fl_list)

    room_name = adjective+'-'+flower+str(random.randint(1,10))
    print(room_name)

create_room_name()
