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

            # --- Segmented Sampling ---
            # Divide video into 10 segments and pick 1 best frame from each
            # This ensures we don't just look at the beginning/end
            segment_size = max(1, total_frames // 10)
            predictions = []

            for i in range(10):
                start_frame = i * segment_size
                cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
                
                # Try up to 5 consecutive frames in this segment to find a face
                for _ in range(5):
                    ret, frame = cap.read()
                    if not ret:
                        break
                    
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    gray = cv2.equalizeHist(gray)
                    faces = self.face_cascade.detectMultiScale(gray, 1.05, 3, minSize=(30, 30))

                    if len(faces) > 0:
                        x, y, w, h = faces[0]
                        pad = int(w * 0.2) # Larger padding for ViT
                        x1 = max(0, x - pad)
                        y1 = max(0, y - pad)
                        x2 = min(frame.shape[1], x + w + pad)
                        y2 = min(frame.shape[0], y + h + pad)
                        crop = frame[y1:y2, x1:x2]
                        
                        rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
                        pil_img = Image.fromarray(rgb)

                        # --- Test Time Augmentation (TTA) ---
                        # Analyze original + horizontal flip for robustness
                        flipped_pil = pil_img.transpose(Image.FLIP_LEFT_RIGHT)
                        
                        results = pipe([pil_img, flipped_pil])
                        
                        # Average the probabilities across TTA steps
                        avg_fake = 0.0
                        avg_real = 0.0
                        for res in results:
                            for item in res:
                                lbl = item['label'].lower()
                                if 'fake' in lbl: avg_fake += item['score']
                                elif 'real' in lbl: avg_real += item['score']
                        
                        avg_fake /= 2.0
                        avg_real /= 2.0

                        predictions.append({
                            "frame": start_frame,
                            "fake_prob": avg_fake,
                            "real_prob": avg_real,
                            "had_face": True
                        })
                        break # Found a face in this segment, move to next segment
            
            cap.release()

            if not predictions:
                return self._fallback("No faces could be classified in the sampled segments.")

            # --- Advanced Scoring Logic ---
            eval_set = predictions
            fake_probs = [p['fake_prob'] for p in eval_set]
            
            avg_fake_prob = float(np.mean(fake_probs))
            max_fake_prob = float(np.max(fake_probs))
            std_fake_prob = float(np.std(fake_probs)) # High variance = suspicious
            
            # Instability: Massive swings in confidence across segments
            is_unstable = bool(std_fake_prob > 0.35)
            
            # Count high-certainty fake frames
            high_confidence_fakes = sum(1 for p in fake_probs if p > 0.85)

            # --- Robust Non-linear Logic (Boosted Sensitivity) ---
            # Even a 30% prob from the neural model is highly suspicious in deepfake datasets.
            if avg_fake_prob < 0.15:
                base_score = avg_fake_prob * 33.3  # 0 to 5
            elif avg_fake_prob < 0.4:
                base_score = 5 + (avg_fake_prob - 0.15) * 180 # 5 to 50
            else:
                base_score = 50 + (avg_fake_prob - 0.4) * 83.3 # 50 to 100

            # "Smoking Gun" Boost: If even ONE frame is 98% fake, it's highly suspicious
            if max_fake_prob > 0.98:
                base_score = max(base_score, 85.0)
            
            # Instability Boost: AI models often "trip" on specific frames
            if is_unstable:
                base_score = max(base_score, 70.0)

            final_score = float(min(100.0, base_score))

            return {
                "score": final_score,
                "status": "Analyzed (AI Model v2)",
                "model": "dima806/deepfake_vs_real_image_detection",
                "avg_fake_probability": avg_fake_prob,
                "max_fake_probability": max_fake_prob,
                "is_temporally_unstable": is_unstable,
                "frames_analyzed": len(eval_set),
                "high_confidence_hits": high_confidence_fakes,
                "details": {
                    "model_verdict": "FAKE" if final_score > 50 else "REAL",
                    "confidence": float(avg_fake_prob if final_score > 50 else (1 - avg_fake_prob)),
                    "tta_enabled": True,
                    "segmented_sampling": True
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
