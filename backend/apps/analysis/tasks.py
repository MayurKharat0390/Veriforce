from celery import shared_task

def _run_forensic_analysis_sync(video_id):
    """
    The actual synchronous analysis logic.
    Called directly from background threads (no Celery worker needed).
    """
    try:
        import django
        # Ensure Django ORM is available in this thread context
        from videos.models import Video
        from analysis.models import (
            VisualAnalysis, AudioAnalysis, MetadataAnalysis,
            BiometricAnalysis, EnsembleResult
        )
        from ml_logic.visual.face_analysis import VisualForce
        from ml_logic.audio.spectral_analysis import AudioForce
        from ml_logic.metadata.extractor import MetadataForce
        from ml_logic.biometric.pulse_check import BiometricForce
        from ml_logic.ensemble import ForceEnsemble

        # AI Force
        try:
            from ml_logic.ai_model.deepfake_classifier import AIForce
            _ai_available = True
        except Exception as e:
            print(f"[VeriForce] AIForce import failed: {e}")
            _ai_available = False

        # LipSync Force
        try:
            from ml_logic.lip_sync.sync_analysis import LipSyncForce
            _lipsync_available = True
        except Exception as e:
            print(f"[VeriForce] LipSyncForce import failed: {e}")
            _lipsync_available = False

        video = Video.objects.get(id=video_id)
        file_path = video.file.path

        print(f"[VeriForce] Starting analysis for video {video_id}: {file_path}")

        # 1. Run the Four Forces
        print("[VeriForce] Running Visual Force...")
        v_res = VisualForce(file_path).analyze()
        print(f"[VeriForce] Visual: score={v_res.get('score')}")

        print("[VeriForce] Running Audio Force...")
        a_res = AudioForce(file_path).analyze()
        print(f"[VeriForce] Audio: score={a_res.get('score')}")

        print("[VeriForce] Running Metadata Force...")
        m_res = MetadataForce(file_path).analyze()
        print(f"[VeriForce] Metadata: score={m_res.get('score')}")

        print("[VeriForce] Running Biometric Force...")
        b_res = BiometricForce(file_path).analyze()
        print(f"[VeriForce] Biometric: score={b_res.get('score')}")

        # 5th Force: AI Model (HuggingFace ViT)
        ai_res = None
        if _ai_available:
            print("[VeriForce] Running AI Force (ViT deepfake classifier)...")
            try:
                ai_res = AIForce(file_path).analyze()
                print(f"[VeriForce] AI Force: score={ai_res.get('score')} | {ai_res.get('details',{}).get('model_verdict','?')}")
            except Exception as e:
                print(f"[VeriForce] AI Force failed: {e}")
                ai_res = None

        # 6th Force: LipSync
        lipsync_res = None
        if _lipsync_available:
            print("[VeriForce] Running LipSync Force...")
            try:
                lipsync_res = LipSyncForce(file_path).analyze()
                print(f"[VeriForce] LipSync: score={lipsync_res.get('score'):.1f} | corr={lipsync_res.get('lip_sync_correlation')}")
            except Exception as e:
                print(f"[VeriForce] LipSync failed: {e}")

        # Ensemble Fusion (6 forces)
        print("[VeriForce] Running Ensemble Fusion...")
        ensemble = ForceEnsemble()
        fusion = ensemble.fuse(v_res, a_res, m_res, b_res, ai_res=ai_res, lipsync_res=lipsync_res)
        print(f"[VeriForce] Verdict: {fusion['verdict']} | Score: {fusion['final_score']:.1f}")

        # 3. Save results (update_or_create prevents duplicate errors)
        VisualAnalysis.objects.update_or_create(
            video=video,
            defaults={
                'score': v_res.get('score', 0),
                'face_swap_score': v_res.get('face_swap_score', 0),
                'lighting_score': v_res.get('lighting_score', 0),
                'blink_score': 0,
                'lip_sync_score': 0,
                'details': v_res.get('details', {})
            }
        )

        AudioAnalysis.objects.update_or_create(
            video=video,
            defaults={
                'score': a_res.get('score', 0),
                'voice_clone_score': a_res.get('voice_clone_score', 0),
                'breath_score': a_res.get('breath_score', 0),
                'background_score': 0,
                'details': a_res.get('details', {})
            }
        )

        MetadataAnalysis.objects.update_or_create(
            video=video,
            defaults={
                'score': m_res.get('score', 0),
                'reencode_count': m_res.get('reencode_count', 0),
                'source_device': m_res.get('source_device', 'Unknown'),
                'details': m_res.get('details', {})
            }
        )

        BiometricAnalysis.objects.update_or_create(
            video=video,
            defaults={
                'score': b_res.get('score', 0),
                'pulse_detected': b_res.get('pulse_detected', False),
                'heart_rate': b_res.get('heart_rate'),
                'blood_flow_data': b_res.get('details', {})
            }
        )

        EnsembleResult.objects.update_or_create(
            video=video,
            defaults={
                'final_score': fusion['final_score'],
                'verdict': fusion['verdict'],
                'confidence': fusion['confidence'],
                'weights_used': fusion['weights_used'],
                'timeline_data': fusion['timeline_data'],
                'details': {'reasons': fusion.get('reasons', [])}
            }
        )

        # 4. Mark video as complete
        video.status = 'COMPLETED'
        video.save()
        print(f"[VeriForce] Analysis COMPLETE for video {video_id}")

    except Exception as e:
        print(f"[VeriForce] Analysis FAILED for video {video_id}: {e}")
        import traceback
        traceback.print_exc()
        try:
            from videos.models import Video
            video = Video.objects.get(id=video_id)
            video.status = 'FAILED'
            video.save()
        except Exception:
            pass


@shared_task
def run_forensic_analysis(video_id):
    """Celery task wrapper — calls the sync function."""
    _run_forensic_analysis_sync(video_id)
