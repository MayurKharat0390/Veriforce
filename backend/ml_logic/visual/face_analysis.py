import cv2
import numpy as np

class VisualForce:
    """
    Exposes 'The Visual Force': Analyzes textures, temporal consistency,
    and compression artifacts. Works on ANY video — not just faces.
    """
    def __init__(self, file_path):
        self.file_path = file_path
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def analyze(self):
        cap = cv2.VideoCapture(self.file_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        if total_frames == 0:
            return {"score": 0.0, "status": "Inconclusive", "details": {"reason": "Empty video"}}

        sample_rate = max(1, total_frames // 15)
        
        # --- Data-Driven Features (Statistical Distributions) ---
        entropy_values = []
        texture_variances = []
        temporal_deltas = []
        prev_gray = None

        frame_count = 0
        while cap.isOpened() and frame_count < total_frames:
            ret, frame = cap.read()
            if not ret or len(entropy_values) >= 15:
                break

            if frame_count % sample_rate == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                gray_small = cv2.resize(gray, (256, 256))

                # --- 1. Shannon Entropy (Information Density) ---
                # Real videos have high information entropy due to natural sensor noise.
                # AI generation (especially smoothing) results in lower entropy.
                hist = cv2.calcHist([gray_small], [0], None, [256], [0, 256])
                hist /= hist.sum() # Normalize
                entropy = -np.sum(hist * np.log2(hist + 1e-9))
                entropy_values.append(float(entropy))

                # --- 2. Laplacian Variance (High-Freq Distribution) ---
                lap_var = cv2.Laplacian(gray_small, cv2.CV_64F).var()
                texture_variances.append(float(lap_var))

                # --- 3. Temporal Consistency (Signal Stability) ---
                if prev_gray is not None:
                    delta = np.mean(np.abs(gray_small.astype(float) - prev_gray.astype(float)))
                    temporal_deltas.append(float(delta))
                prev_gray = gray_small.copy()

            frame_count += 1
        cap.release()

        # --- Probability Density based Scoring ---
        avg_entropy = np.mean(entropy_values) if entropy_values else 7.0
        avg_tex = np.mean(texture_variances) if texture_variances else 400.0
        
        # Entropy anomaly (Real is usually 7.3 - 7.9)
        # Shifted curve: threshold moved from 6.5 to 7.1 to increase FAKE sensitivity.
        # Increased multiplier from 2.0 to 3.5 for a steeper response to subtle smoothing.
        entropy_score = 1.0 / (1.0 + np.exp(3.5 * (avg_entropy - 7.1))) * 100.0
        
        # Texture anomaly: Increased threshold to 250 to allow natural sharp videos
        tex_score = 1.0 / (1.0 + np.exp(0.005 * (avg_tex - 250))) * 80.0
        
        final_score = (entropy_score * 0.75) + (tex_score * 0.25)
        final_score = min(100.0, final_score)

        return {
            "score": float(final_score),
            "status": "Analyzed (Statistical Forensic)",
            "details": {
                "information_entropy": float(avg_entropy),
                "texture_variance": float(avg_tex),
                "temporal_std": float(np.std(temporal_deltas)) if temporal_deltas else 0,
                "method": "Shannon Entropy Distribution"
            }
        }
