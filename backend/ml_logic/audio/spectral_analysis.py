import os
import numpy as np
from ml_logic.utils.audio_extract import extract_audio_to_wav


class AudioForce:
    """
    Exposes 'The Audio Force': Analyzes spectral signatures and pitch
    consistency to detect voice clones and synthetic audio.
    Uses imageio-ffmpeg to reliably extract audio from any video format.
    """
    def __init__(self, file_path):
        self.file_path = file_path

    def analyze(self):
        wav_path = None
        try:
            import librosa

            # Step 1: Extract audio to WAV using bundled ffmpeg
            wav_path = extract_audio_to_wav(self.file_path, duration=20)

            if wav_path is None:
                return self._no_audio("No audio track found or extraction failed")

            # Step 2: Load WAV with librosa (guaranteed to work on WAV)
            y, sr = librosa.load(wav_path, duration=20)

            if len(y) < sr * 0.5:
                return self._no_audio("Audio too short to analyze")

            # --- Signal 1: Mel Spectrogram for Spectral Gaps ---
            S = librosa.feature.melspectrogram(y=y, sr=sr)
            S_db = librosa.power_to_db(S, ref=np.max)
            high_freq_pwr = float(np.mean(S_db[80:]))

            # --- Signal 2: Zero Crossing Rate (synthetic speech = unnatural ZCR) ---
            zcr = librosa.feature.zero_crossing_rate(y)[0]
            avg_zcr = float(np.mean(zcr))

            # --- Signal 3: Pitch (F0) consistency via PYIN ---
            try:
                f0, voiced_flag, _ = librosa.pyin(
                    y,
                    fmin=float(librosa.note_to_hz('C2')),
                    fmax=float(librosa.note_to_hz('C7')),
                    sr=sr
                )
                f0_clean = f0[~np.isnan(f0)]
                pitch_var = float(np.var(f0_clean)) if len(f0_clean) > 10 else 0.0
                voiced_ratio = float(np.sum(voiced_flag) / len(voiced_flag)) if len(voiced_flag) > 0 else 0.0
            except Exception:
                pitch_var = 0.0
                voiced_ratio = 0.5

            # --- Scoring ---
            score = 10.0

            # Spectral gap: AI voices often lack natural high-freq breath/sibilants
            if high_freq_pwr < -72:
                score += 45.0

            # Pitch: Robotic monotone TTS/voice clone = very low variance
            if 0 < pitch_var < 300:
                score += 35.0
            elif pitch_var > 20000:
                score += 20.0  # Impossible jumps = artifact

            # ZCR: AI speech tends to have abnormally high ZCR
            if avg_zcr > 0.15:
                score += 15.0

            score = float(min(score, 100.0))

            return {
                "score": score,
                "status": "Analyzed",
                "voice_clone_score": score,
                "breath_score": 10.0 if high_freq_pwr > -60 else 85.0,
                "details": {
                    "high_freq_pwr": high_freq_pwr,
                    "pitch_variance": pitch_var,
                    "voiced_ratio": voiced_ratio,
                    "avg_zcr": avg_zcr,
                    "is_robotic_pitch": bool(0 < pitch_var < 300),
                    "spectral_gap": bool(high_freq_pwr < -72)
                }
            }

        except Exception as e:
            return self._no_audio(str(e))
        finally:
            # Always clean up the temp WAV file
            if wav_path and os.path.exists(wav_path):
                try:
                    os.unlink(wav_path)
                except Exception:
                    pass

    def _no_audio(self, reason):
        return {
            "score": 0.0,
            "status": "No Audio",
            "voice_clone_score": 0.0,
            "breath_score": 0.0,
            "details": {"error": reason}
        }
