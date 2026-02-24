from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ElectionViewSet

router = DefaultRouter()
router.register(r'guardian', ElectionViewSet, basename='election-guardian')

urlpatterns = [
    path('', include(router.urls)),
]
