"""
LipSyncForce - Detects audio-visual mismatches in talking head deepfakes.

Real humans: mouth movements are highly correlated with audio energy.
AI deepfakes: the face was generated separately — lip sync is imperfect.

This analysis survives YouTube re-encoding because it measures TIMING RELATIONSHIP
between mouth movement and sound, not pixel-level artifacts.
"""
import cv2
import numpy as np

class LipSyncForce:
    def __init__(self, file_path):
        self.file_path = file_path
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )

    def analyze(self):
        # --- 1. Extract mouth movement signal from video ---
        mouth_signal = self._extract_mouth_signal()

        if mouth_signal is None or len(mouth_signal) < 20:
            return {
                "score": 0.0,
                "status": "No Face/Mouth Detected",
                "details": {"reason": "Could not track mouth region"}
            }

        # --- 2. Extract audio energy signal ---
        audio_signal = self._extract_audio_energy(len(mouth_signal))

        if audio_signal is None:
            return {
                "score": 30.0,  # Slightly suspicious: video with face but no detectable audio
                "status": "No Audio",
                "details": {"reason": "Face found but no audio channel", "mouth_variance": float(np.var(mouth_signal))}
            }

        # --- 3. Cross-correlation analysis ---
        # Both signals need to be same length
        min_len = min(len(mouth_signal), len(audio_signal))
        mouth_s = np.array(mouth_signal[:min_len])
        audio_s = np.array(audio_signal[:min_len])

        # Normalize both signals
        def normalize(x):
            std = np.std(x)
            return (x - np.mean(x)) / (std if std > 0 else 1)

        m_norm = normalize(mouth_s)
        a_norm = normalize(audio_s)

        # Pearson correlation at zero lag
        corr_zero = float(np.corrcoef(m_norm, a_norm)[0, 1])

        # Cross-correlation across small time offsets (±5 frames)
        max_corr = corr_zero
        for lag in range(-5, 6):
            if lag == 0:
                continue
            if lag > 0:
                c = float(np.corrcoef(m_norm[lag:], a_norm[:-lag])[0, 1])
            else:
                c = float(np.corrcoef(m_norm[:lag], a_norm[-lag:])[0, 1])
            if not np.isnan(c):
                max_corr = max(max_corr, c)

        # --- 4. Mouth variance: frozen mouth with audio = red flag ---
        mouth_var = float(np.var(mouth_s))
        low_mouth_movement = bool(mouth_var < 5.0)

        # --- 5. Scoring ---
        # max_corr close to 1.0 = perfectly in sync = REAL
        # max_corr close to 0 or negative = desynchronized = FAKE
        score = 50.0

        if max_corr < 0.15:
            score = 80.0   # Very weak sync = strong fake signal
        elif max_corr < 0.30:
            score = 65.0   # Poor sync
        elif max_corr < 0.50:
            score = 45.0   # Moderate — inconclusive
        else:
            score = 15.0   # Good sync = likely real

        # Bonus: frozen lips with audio? Definitely suspect
        if low_mouth_movement:
            score = max(score, 70.0)

        score = float(max(0.0, min(score, 100.0)))

        return {
            "score": score,
            "status": "Analyzed",
            "lip_sync_correlation": max_corr,
            "zero_lag_corr": corr_zero,
            "mouth_variance": mouth_var,
            "low_mouth_movement": low_mouth_movement,
            "details": {
                "verdict": "DESYNCHRONIZED" if score > 50 else "SYNCHRONIZED",
                "max_correlation": max_corr,
                "frames_analyzed": min_len
            }
        }

    def _extract_mouth_signal(self):
        """Extract pixel difference in the lower-face (mouth) region per frame."""
        cap = cv2.VideoCapture(self.file_path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = float(cap.get(cv2.CAP_PROP_FPS) or 25)

        if total == 0:
            return None

        mouth_values = []
        prev_mouth_roi = None
        frame_count = 0

        # Sample every frame up to 300 frames for good temporal resolution
        sample_rate = max(1, total // 300)

        while cap.isOpened() and frame_count < total:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_count % sample_rate == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                gray = cv2.equalizeHist(gray)

                # More sensitive detection
                faces = self.face_cascade.detectMultiScale(gray, 1.05, 3, minSize=(80, 80))

                if len(faces) > 0:
                    # Take biggest face
                    x, y, w, h = max(faces, key=lambda r: r[2] * r[3])
                    # Mouth region = bottom 1/3 of face
                    mouth_top = y + int(h * 0.60)
                    mouth_bot = y + h
                    mouth_roi = gray[mouth_top:mouth_bot, x:x+w]

                    if mouth_roi.size > 0:
                        if prev_mouth_roi is not None and prev_mouth_roi.shape == mouth_roi.shape:
                            diff = float(np.mean(np.abs(mouth_roi.astype(float) - prev_mouth_roi.astype(float))))
                            mouth_values.append(diff)
                        prev_mouth_roi = mouth_roi.copy()

            frame_count += 1

        cap.release()
        return mouth_values if len(mouth_values) > 10 else None

    def _extract_audio_energy(self, target_length):
        """Extract RMS energy envelope from audio using bundled ffmpeg."""
        import os
        from ml_logic.utils.audio_extract import extract_audio_to_wav
        wav_path = None
        try:
            import librosa
            from scipy.signal import resample

            wav_path = extract_audio_to_wav(self.file_path, duration=30)
            if wav_path is None:
                return None

            y, sr = librosa.load(wav_path, mono=True)
            if len(y) < sr:
                return None

            hop = max(1, len(y) // target_length)
            rms = librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0]

            if len(rms) != target_length:
                rms = resample(rms, target_length)

            return rms.tolist()
        except Exception:
            return None
        finally:
            if wav_path and os.path.exists(wav_path):
                try:
                    os.unlink(wav_path)
                except Exception:
                    pass
