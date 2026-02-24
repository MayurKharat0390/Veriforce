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
            return {
                "score": 0.0, "status": "Inconclusive",
                "face_swap_score": 0.0, "lighting_score": 0.0,
                "details": {"reason": "Empty video file"}
            }

        sample_rate = max(1, total_frames // 20)
        frame_count = 0
        frames_with_faces = 0

        # --- Signal 1: Face-region analysis (if faces exist) ---
        face_variances = []
        multi_face_counts = []

        # --- Signal 2: Full-frame texture smoothness (works on anything) ---
        full_frame_variances = []

        # --- Signal 3: Temporal inter-frame difference ---
        # AI videos often have unnaturally smooth transitions OR sudden artifacts
        prev_gray = None
        inter_frame_diffs = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or frame_count > 400:
                break

            if frame_count % sample_rate == 0:
                # Resize for speed
                frame_small = cv2.resize(frame, (320, 180))
                gray = cv2.cvtColor(frame_small, cv2.COLOR_BGR2GRAY)

                # Signal 2: Overall frame sharpness (Laplacian variance over whole frame)
                full_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
                full_frame_variances.append(full_var)

                # Signal 3: Inter-frame difference
                if prev_gray is not None:
                    diff = float(np.mean(np.abs(gray.astype(float) - prev_gray.astype(float))))
                    inter_frame_diffs.append(diff)
                prev_gray = gray.copy()

                # Signal 1: Face-specific analysis (original logic)
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
                num_faces = len(faces)
                if num_faces > 0:
                    frames_with_faces += 1
                    multi_face_counts.append(int(num_faces))
                    for (x, y, w, h) in faces:
                        face_roi = gray[y:y+h, x:x+w]
                        var = float(cv2.Laplacian(face_roi, cv2.CV_64F).var())
                        face_variances.append(var)

            frame_count += 1

        cap.release()

        score = 25.0  # Base
        details = {}
        is_multi_target = False

        # --- Evaluate Signal 1: Face texture ---
        face_score = 0.0
        if frames_with_faces > 0:
            avg_face_var = float(np.mean(face_variances))
            avg_faces = float(np.mean(multi_face_counts))
            is_multi_target = bool(avg_faces > 1.5)

            if avg_face_var < 80:
                face_score = 60.0   # Suspiciously smooth AI skin
            elif avg_face_var > 800:
                face_score = 45.0   # Heavy compression / blending artifacts
            elif 150 < avg_face_var < 500:
                face_score = -15.0  # Natural skin texture

            score += face_score
            details["avg_face_laplacian_var"] = avg_face_var
            details["frames_with_faces"] = frames_with_faces
            details["multi_face_detected"] = is_multi_target

        # --- Evaluate Signal 2: Full-frame texture ---
        if full_frame_variances:
            avg_full_var = float(np.mean(full_frame_variances))
            details["avg_full_frame_var"] = avg_full_var

            # AI-generated video: tends to be very smooth (< 100 for whole frame)
            # or has a very narrow variance range (too consistent)
            var_of_vars = float(np.var(full_frame_variances))
            details["texture_consistency"] = var_of_vars

            if avg_full_var < 100:
                score += 25.0   # Unnaturally smooth frames

            # Extremely consistent texture (AI frames don't differ much from each other)
            if var_of_vars < 500 and avg_full_var < 300:
                score += 20.0

        # --- Evaluate Signal 3: Temporal consistency ---
        if inter_frame_diffs:
            avg_diff = float(np.mean(inter_frame_diffs))
            std_diff = float(np.std(inter_frame_diffs))
            details["avg_inter_frame_diff"] = avg_diff
            details["inter_frame_diff_std"] = std_diff

            # AI videos: either unnaturally smooth (low diff) or jerky (high std)
            if avg_diff < 3.0:
                score += 15.0   # Too smooth between frames
            if std_diff > 15.0:
                score += 10.0   # Irregular temporal artifacts

        score = float(max(0.0, min(score, 100.0)))

        return {
            "score": score,
            "status": "Analyzed",
            "face_swap_score": float(score),
            "lighting_score": 40.0 if is_multi_target else 10.0,
            "details": details
        }
