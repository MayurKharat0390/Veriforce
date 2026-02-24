from django.urls import path
from .views import JournalistView, CourtView, PlatformView

urlpatterns = [
    path('journalist/<int:video_id>/', JournalistView.as_view()),
    path('court/<int:video_id>/', CourtView.as_view()),
    path('platform/<int:video_id>/', PlatformView.as_view()),
]
