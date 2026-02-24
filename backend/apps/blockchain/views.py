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

class BlockchainRegister(APIView):
    def post(self, request):
        # Mock registration
        video_id = request.data.get('video_id')
        hash_val = request.data.get('hash')
        
        record = BlockchainRecord.objects.create(
            video_id=video_id,
            hash=hash_val,
            transaction_id="0x" + "f"*64, # Mock tx
            timestamp=timezone.now(),
            block_number=12345678,
            verified=True
        )
        return Response(BlockchainRecordSerializer(record).data, status=status.HTTP_201_CREATED)
