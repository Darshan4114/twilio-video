from django.urls import path
from .views import *
app_name = 'vdo'

urlpatterns=[
    # path('', vdo_call, name = "video_calls"),
    path('', create, name = "create"),
    path('room/', room, name = "room"),

]