from django.urls import path
from .views import (
    VisualAnalysisDetail, AudioAnalysisDetail,
    MetadataAnalysisDetail, BiometricAnalysisDetail,
    EnsembleResultDetail, ForensicReportView, CombinedResultsView
)

urlpatterns = [
    path('<int:video_id>/', CombinedResultsView.as_view()),        # Used by frontend results call
    path('<int:video_id>/visual/', VisualAnalysisDetail.as_view()),
    path('<int:video_id>/audio/', AudioAnalysisDetail.as_view()),
    path('<int:video_id>/metadata/', MetadataAnalysisDetail.as_view()),
    path('<int:video_id>/biometric/', BiometricAnalysisDetail.as_view()),
    path('<int:video_id>/ensemble/', EnsembleResultDetail.as_view()),
    path('<int:video_id>/report/', ForensicReportView.as_view()),
]
