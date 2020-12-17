from django.urls import path
from .views import HomeView, RoomView
from .api_views import create_room, end_room
app_name = 'video_app'

urlpatterns = [
    # path('', CreateRoomView, name = "CreateRoomView"),
    path('', HomeView, name="HomeView"),
    path('create_room/', create_room, name="create_room"),
    path('end_room/<room_sid>', end_room, name="end_room"),
    path('<room_name>/', RoomView.as_view(), name="RoomView"),
]
