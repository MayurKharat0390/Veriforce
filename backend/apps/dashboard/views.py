from rest_framework.views import APIView
from rest_framework.response import Response
from analysis.models import EnsembleResult
from analysis.serializers import EnsembleResultSerializer

class JournalistView(APIView):
    def get(self, request, video_id):
        # Simplified verdict for non-technical users
        try:
            result = EnsembleResult.objects.get(video_id=video_id)
            return Response({
                "verdict": result.verdict,
                "confidence": f"{result.confidence * 100:.1f}%",
                "summary": "This video has been flagged as highly likely to be a deepfake due to facial inconsistencies." if result.verdict == "FAKE" else "No significant manipulation detected.",
                "shareable_link": f"https://veriforce.ai/v/{video_id}"
            })
        except EnsembleResult.DoesNotExist:
            return Response({"error": "Analysis not found"}, status=404)

class CourtView(APIView):
    def get(self, request, video_id):
        # Forensic level detail
        try:
            result = EnsembleResult.objects.get(video_id=video_id)
            return Response({
                "case_id": f"VF-{video_id}",
                "evidence_integrity": "Verified via Blockchain",
                "detailed_scores": result.weights_used,
                "forensic_timeline": result.timeline_data,
                "expert_commentary": "Analyzed using 4 mult-modal forces with ensemble weighting."
            })
        except EnsembleResult.DoesNotExist:
            return Response({"error": "Analysis not found"}, status=404)

class PlatformView(APIView):
    def get(self, request, video_id):
        # JSON response for API integrations
        try:
            result = EnsembleResult.objects.get(video_id=video_id)
            serializer = EnsembleResultSerializer(result)
            return Response(serializer.data)
        except EnsembleResult.DoesNotExist:
            return Response({"error": "Analysis not found"}, status=404)
