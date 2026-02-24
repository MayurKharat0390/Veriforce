from django.db import models
from videos.models import Video

class DeepfakeAlert(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='election_alerts')
    state = models.CharField(max_length=50)
    politician = models.CharField(max_length=100)
    detected_at = models.DateTimeField()
    severity = models.CharField(max_length=20)
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"Alert: {self.politician} in {self.state}"
