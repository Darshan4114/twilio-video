from django.urls import path
from .views import CreateRoomView, RoomView
app_name = 'video_app'

urlpatterns=[
    path('', CreateRoomView, name = "CreateRoomView"),
    path('<room_name>/', RoomView, name = "RoomView"),
]