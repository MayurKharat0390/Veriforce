from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Video
from .serializers import VideoSerializer
import threading

class VideoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = VideoSerializer
    queryset = Video.objects.all()

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(user=self.request.user)
        return self.queryset.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        video = self.get_object()
        video.status = 'PROCESSING'
        video.save()

        # Run analysis in a background thread so the HTTP request returns instantly
        def run_analysis_in_background(video_id):
            # Import inside thread to avoid Django app registry issues
            import django
            from analysis.tasks import _run_forensic_analysis_sync
            _run_forensic_analysis_sync(video_id)

        thread = threading.Thread(
            target=run_analysis_in_background,
            args=(video.id,),
            daemon=True
        )
        thread.start()

        return Response({'status': 'Analysis started. Force is awakening...'})

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        video = self.get_object()
        data = {
            'id': video.id,
            'status': video.status,
            'progress': 100 if video.status == 'COMPLETED' else 50 if video.status == 'PROCESSING' else 0
        }

        if video.status == 'COMPLETED':
            try:
                result = video.ensemble_result
                data['verdict'] = result.verdict
                data['confidence'] = result.confidence
                data['final_score'] = result.final_score
            except Exception:
                pass

        return Response(data)
