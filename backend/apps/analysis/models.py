from django.db import models
from videos.models import Video

class VisualAnalysis(models.Model):
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='visual_analysis')
    score = models.FloatField()
    face_swap_score = models.FloatField()
    lighting_score = models.FloatField()
    blink_score = models.FloatField()
    lip_sync_score = models.FloatField()
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

class AudioAnalysis(models.Model):
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='audio_analysis')
    score = models.FloatField()
    voice_clone_score = models.FloatField()
    breath_score = models.FloatField()
    background_score = models.FloatField()
    spectral_data = models.JSONField(default=dict)
    details = models.JSONField(default=dict)

class MetadataAnalysis(models.Model):
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='metadata_analysis')
    score = models.FloatField()
    reencode_count = models.IntegerField(default=0)
    source_device = models.CharField(max_length=255, null=True, blank=True)
    edit_history = models.JSONField(default=list)
    compression_artifacts = models.JSONField(default=dict)
    details = models.JSONField(default=dict)  # Added

class BiometricAnalysis(models.Model):
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='biometric_analysis')
    score = models.FloatField()
    pulse_detected = models.BooleanField(default=False)
    heart_rate = models.FloatField(null=True, blank=True)
    micro_expressions = models.JSONField(default=dict)
    blood_flow_data = models.JSONField(default=dict)

class EnsembleResult(models.Model):
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='ensemble_result')
    final_score = models.FloatField()
    verdict = models.CharField(max_length=10)  # REAL/FAKE
    confidence = models.FloatField()
    weights_used = models.JSONField(default=dict)
    timeline_data = models.JSONField(default=list)
    details = models.JSONField(default=dict)
