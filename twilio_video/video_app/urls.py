from django.urls import path
from .views import RoomView
app_name = 'video_app'

urlpatterns=[
    # path('', CreateRoomView, name = "CreateRoomView"),
    path('', RoomView.as_view(), name = "RoomView"),
]