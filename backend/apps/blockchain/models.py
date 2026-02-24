from django.db import models
from videos.models import Video

class BlockchainRecord(models.Model):
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='blockchain_record')
    hash = models.CharField(max_length=256, unique=True)
    transaction_id = models.CharField(max_length=256)
    timestamp = models.DateTimeField()
    block_number = models.IntegerField()
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Record for {self.video.title} - {self.hash[:10]}"
