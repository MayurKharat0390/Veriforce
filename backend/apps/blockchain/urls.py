from django.urls import path
from .views import BlockchainRecordList, BlockchainVerify, BlockchainRegister

urlpatterns = [
    path('records/', BlockchainRecordList.as_view()),
    path('verify/<str:hash>/', BlockchainVerify.as_view()),
    path('register/', BlockchainRegister.as_view()),
]
