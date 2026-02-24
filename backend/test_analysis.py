import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django; django.setup()

from videos.models import Video

# Get latest video
videos = list(Video.objects.order_by('-id')[:3])
for v in videos:
    print(f"Video {v.id}: {v.title} | status={v.status}")

latest = videos[0]
file_path = latest.file.path
print(f"\nTesting: {file_path}\n")

from ml_logic.visual.face_analysis import VisualForce
from ml_logic.metadata.extractor import MetadataForce
from ml_logic.audio.spectral_analysis import AudioForce
from ml_logic.biometric.pulse_check import BiometricForce
from ml_logic.ensemble import ForceEnsemble

print("--- Visual Force ---")
v_res = VisualForce(file_path).analyze()
print(f"  score={v_res['score']:.1f}  status={v_res.get('status')}")
print(f"  details={v_res.get('details')}")

print("\n--- Metadata Force ---")
m_res = MetadataForce(file_path).analyze()
print(f"  score={m_res['score']:.1f}  device={m_res.get('source_device')}")
print(f"  findings={m_res.get('details',{}).get('findings')}")

print("\n--- Audio Force ---")
a_res = AudioForce(file_path).analyze()
print(f"  score={a_res['score']:.1f}  status={a_res.get('status')}")

print("\n--- AI Force ---")
try:
    from ml_logic.ai_model.deepfake_classifier import AIForce
    ai_res = AIForce(file_path).analyze()
    print(f"  score={ai_res['score']:.1f}  status={ai_res.get('status')}")
    print(f"  avg_fake_prob={ai_res.get('avg_fake_probability')}")
    print(f"  verdict={ai_res.get('details',{}).get('model_verdict')}")
    print(f"  per_frame={ai_res.get('per_frame_results')}")
except Exception as e:
    print(f"  FAILED: {e}")
    import traceback; traceback.print_exc()
    ai_res = None

print("\n--- Ensemble ---")
fusion = ForceEnsemble().fuse(v_res, a_res, m_res, BiometricForce(file_path).analyze(), ai_res=ai_res)
print(f"  VERDICT: {fusion['verdict']}")
print(f"  Score: {fusion['final_score']:.2f}")
print(f"  Weights: {fusion['weights_used']}")
print(f"  Reasons:")
for r in fusion.get('reasons', []):
    print(f"    - {r}")
