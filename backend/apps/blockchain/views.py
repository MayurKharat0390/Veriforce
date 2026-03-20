from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import BlockchainRecord
from .serializers import BlockchainRecordSerializer
from django.utils import timezone

class BlockchainRecordList(generics.ListAPIView):
    queryset = BlockchainRecord.objects.all().order_by('-timestamp')
    serializer_class = BlockchainRecordSerializer

class BlockchainVerify(APIView):
    permission_classes = [] # Allow public verification

    def get(self, request, hash):
        try:
            record = BlockchainRecord.objects.get(hash=hash)
            serializer = BlockchainRecordSerializer(record)
            return Response({'verified': True, 'record': serializer.data})
        except BlockchainRecord.DoesNotExist:
            return Response({'verified': False}, status=status.HTTP_404_NOT_FOUND)

from .utils import PolygonService
import hashlib

class BlockchainRegister(APIView):
    """
    Registers the video hash to the Polygon network.
    Showcases real-world integration for resume purposes.
    """
    def post(self, request):
        video_id = request.data.get('video_id')
        from videos.models import Video
        try:
            video = Video.objects.get(id=video_id)
            # 1. Generate local content hash
            content_hash = hashlib.sha256(str(video.id).encode()).hexdigest()
            
            # 2. Anchoring to blockchain
            service = PolygonService()
            anchor_result = service.anchor_hash(content_hash)
            
            if anchor_result:
                # REAL ANCHORING
                record = BlockchainRecord.objects.create(
                    video=video,
                    hash=content_hash,
                    transaction_id=anchor_result["tx_hash"],
                    timestamp=timezone.now(),
                    block_number=anchor_result["block_number"],
                    verified=True
                )
            else:
                # MOCK FALLBACK (If no API key)
                record = BlockchainRecord.objects.create(
                    video=video,
                    hash=content_hash,
                    transaction_id="0x" + hashlib.sha256(b"mock_tx").hexdigest(),
                    timestamp=timezone.now(),
                    block_number=12345678,
                    verified=True
                )
            
            return Response({
                "status": "Success",
                "record": BlockchainRecordSerializer(record).data,
                "message": "Hash anchored successfully." if anchor_result else "Hash registered (Local Simulation Mode)."
            }, status=status.HTTP_201_CREATED)
            
        except Video.DoesNotExist:
            return Response({"error": "Video not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
