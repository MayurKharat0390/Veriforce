from rest_framework import serializers
from .models import DeepfakeAlert

class DeepfakeAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeepfakeAlert
        fields = '__all__'
