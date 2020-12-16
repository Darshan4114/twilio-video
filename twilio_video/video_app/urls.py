from django.urls import path
from .views import HomeView, RoomView
from .api_views import create_room
app_name = 'video_app'

urlpatterns=[
    # path('', CreateRoomView, name = "CreateRoomView"),
    path('', HomeView, name = "HomeView"),
    path('create_room/', create_room, name = "create_room"),
    path('<room_name>/', RoomView.as_view(), name = "RoomView"),


]