from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import VisualAnalysis, AudioAnalysis, MetadataAnalysis, BiometricAnalysis, EnsembleResult
from .serializers import (
    VisualAnalysisSerializer, AudioAnalysisSerializer,
    MetadataAnalysisSerializer, BiometricAnalysisSerializer,
    EnsembleResultSerializer
)

class VisualAnalysisDetail(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = VisualAnalysis.objects.all()
    serializer_class = VisualAnalysisSerializer
    lookup_field = 'video_id'

class AudioAnalysisDetail(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = AudioAnalysis.objects.all()
    serializer_class = AudioAnalysisSerializer
    lookup_field = 'video_id'

class MetadataAnalysisDetail(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = MetadataAnalysis.objects.all()
    serializer_class = MetadataAnalysisSerializer
    lookup_field = 'video_id'

class BiometricAnalysisDetail(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = BiometricAnalysis.objects.all()
    serializer_class = BiometricAnalysisSerializer
    lookup_field = 'video_id'

class EnsembleResultDetail(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = EnsembleResult.objects.all()
    serializer_class = EnsembleResultSerializer
    lookup_field = 'video_id'

class ForensicReportView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    """
    Combines all Four Forces and Ensemble Fusion into a master forensic Dossier.
    """
    def get(self, request, video_id):
        from videos.models import Video
        try:
            video = Video.objects.get(id=video_id)
            ensemble = video.ensemble_result
            
            return Response({
                "video_id": video_id,
                "title": video.title,
                "verdict": ensemble.verdict,
                "final_score": ensemble.final_score,
                "confidence": ensemble.confidence,
                "forces": {
                    "visual": VisualAnalysisSerializer(video.visual_analysis).data,
                    "audio": AudioAnalysisSerializer(video.audio_analysis).data,
                    "metadata": MetadataAnalysisSerializer(video.metadata_analysis).data,
                    "biometric": BiometricAnalysisSerializer(video.biometric_analysis).data,
                },
                "xai_summary": " ".join(ensemble.details.get('reasons', ["Forensic alignment complete."]))
            })
        except Exception as e:
            return Response({"error": str(e)}, status=404)


class CombinedResultsView(APIView):
    """
    Returns all Four Force results + Ensemble in a single response.
    This is what the frontend Detector.tsx calls via videoApi.results(id).
    Shape: { ensemble_result, visual_analysis, audio_analysis, metadata_analysis, biometric_analysis }
    """
    permission_classes = [AllowAny]

    def get(self, request, video_id):
        from videos.models import Video
        try:
            video = Video.objects.get(id=video_id)
            ensemble = video.ensemble_result
            return Response({
                "ensemble_result": EnsembleResultSerializer(ensemble).data,
                "visual_analysis": VisualAnalysisSerializer(video.visual_analysis).data,
                "audio_analysis": AudioAnalysisSerializer(video.audio_analysis).data,
                "metadata_analysis": MetadataAnalysisSerializer(video.metadata_analysis).data,
                "biometric_analysis": BiometricAnalysisSerializer(video.biometric_analysis).data,
            })
        except Exception as e:
            return Response({"error": str(e)}, status=404)
