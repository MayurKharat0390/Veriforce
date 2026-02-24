"""
AIForce — The 5th Force
Uses a pretrained HuggingFace ViT model specifically fine-tuned on deepfake 
vs real image classification (FaceForensics++ dataset).

Model: dima806/deepfake_vs_real_image_detection
- Architecture: Vision Transformer (ViT)
- Trained on: ~190k real + deepfake face images
- Labels: "Fake" / "Real"
"""
import cv2
import numpy as np
from PIL import Image

# Lazy-load model on first use to avoid slow startup
_pipeline = None

def _get_pipeline():
    global _pipeline
    if _pipeline is None:
        from transformers import pipeline
        print("[AIForce] Loading HuggingFace deepfake detection model...")
        _pipeline = pipeline(
            "image-classification",
            model="dima806/deepfake_vs_real_image_detection",
            device=-1,  # CPU inference
        )
        print("[AIForce] Model loaded successfully.")
    return _pipeline


class AIForce:
    """
    The 5th Force: AI-powered deepfake detection using a Vision Transformer.
    Extracts face frames and classifies each with a pretrained model.
    Aggregates per-frame predictions into a final suspicion score.
    """
    def __init__(self, file_path):
        self.file_path = file_path
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )

    def analyze(self):
        try:
            pipe = _get_pipeline()

            cap = cv2.VideoCapture(self.file_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

            if total_frames == 0:
                return self._fallback("Empty video file")

            # Sample up to 10 frames for AI inference (CPU speed constraint)
            sample_rate = max(1, total_frames // 10)
            frame_count = 0
            predictions = []  # list of (fake_prob, real_prob)

            while cap.isOpened() and frame_count < total_frames:
                ret, frame = cap.read()
                if not ret:
                    break

                if frame_count % sample_rate == 0 and len(predictions) < 10:
                    # Try to find a face first (best classification quality)
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)

                    if len(faces) > 0:
                        x, y, w, h = faces[0]
                        # Add padding around face
                        pad = int(w * 0.2)
                        x1 = max(0, x - pad)
                        y1 = max(0, y - pad)
                        x2 = min(frame.shape[1], x + w + pad)
                        y2 = min(frame.shape[0], y + h + pad)
                        crop = frame[y1:y2, x1:x2]
                    else:
                        # No face — use full frame (works for AI-generated objects too)
                        crop = frame

                    # Convert BGR → RGB PIL Image for HuggingFace
                    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
                    pil_img = Image.fromarray(rgb)

                    result = pipe(pil_img)

                    # Parse result labels (model output: "Fake" or "Real")
                    fake_score = 0.0
                    real_score = 0.0
                    for item in result:
                        lbl = item['label'].lower()
                        if 'fake' in lbl:
                            fake_score = float(item['score'])
                        elif 'real' in lbl:
                            real_score = float(item['score'])

                    predictions.append({
                        "frame": frame_count,
                        "fake_prob": fake_score,
                        "real_prob": real_score,
                        "had_face": len(faces) > 0
                    })

                frame_count += 1

            cap.release()

            if not predictions:
                return self._fallback("No frames could be classified")

            # Aggregate: weighted average (weight higher-confidence predictions more)
            fake_probs = [p['fake_prob'] for p in predictions]
            avg_fake_prob = float(np.mean(fake_probs))
            max_fake_prob = float(np.max(fake_probs))
            frames_flagged = sum(1 for p in fake_probs if p > 0.6)

            # Convert probability to 0-100 score
            # If avg fake probability > 0.5, we lean FAKE
            score = float(avg_fake_prob * 100)

            return {
                "score": score,
                "status": "Analyzed (AI Model)",
                "model": "dima806/deepfake_vs_real_image_detection",
                "avg_fake_probability": avg_fake_prob,
                "max_fake_probability": max_fake_prob,
                "frames_analyzed": len(predictions),
                "frames_flagged_as_fake": frames_flagged,
                "per_frame_results": predictions[:3],  # Show first 3 only
                "details": {
                    "model_verdict": "FAKE" if avg_fake_prob > 0.5 else "REAL",
                    "confidence": float(max(avg_fake_prob, 1 - avg_fake_prob))
                }
            }

        except Exception as e:
            print(f"[AIForce] Error: {e}")
            import traceback
            traceback.print_exc()
            return self._fallback(str(e))

    def _fallback(self, reason):
        return {
            "score": 0.0,
            "status": "AI Model Unavailable",
            "details": {"reason": reason}
        }
