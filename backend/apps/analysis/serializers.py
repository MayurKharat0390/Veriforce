from rest_framework import serializers
from .models import VisualAnalysis, AudioAnalysis, MetadataAnalysis, BiometricAnalysis, EnsembleResult

class VisualAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisualAnalysis
        fields = '__all__'

class AudioAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioAnalysis
        fields = '__all__'

class MetadataAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetadataAnalysis
        fields = '__all__'

class BiometricAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = BiometricAnalysis
        fields = '__all__'

class EnsembleResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnsembleResult
        fields = '__all__'
