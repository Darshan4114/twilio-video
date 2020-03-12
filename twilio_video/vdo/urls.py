from django.urls import path
from .views import *
app_name = 'vdo'

urlpatterns=[
    # path('', vdo_call, name = "video_calls"),
    path('', create, name = "create"),
    # path('room_list/', room_list, name = "room_list"),

]