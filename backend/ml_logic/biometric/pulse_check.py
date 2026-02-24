import cv2
import numpy as np
from scipy.fft import fft

class BiometricForce:
    """
    Exposes 'The Biometric Force': Analyzes blood flow (rPPG) and heart rate 
    from skin pixel variations using FFT for frequency analysis.
    """
    def __init__(self, file_path):
        self.file_path = file_path
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def analyze(self):
        cap = cv2.VideoCapture(self.file_path)
        green_signals = [] 
        fps = float(cap.get(cv2.CAP_PROP_FPS) or 30)
        
        frame_count = 0
        while cap.isOpened() and frame_count < 300:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % 2 == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
                
                if len(faces) > 0:
                    x, y, w, h = faces[0]
                    roi = frame[y+h//10 : y+h//3, x+w//4 : x+3*w//4]
                    if roi.size > 0:
                        avg_green = float(np.mean(roi[:, :, 1]))
                        green_signals.append(avg_green)
            
            frame_count += 1
        cap.release()

        # Edge Case: Insufficient data
        if len(green_signals) < 30:
            return {
                "score": 0.0,
                "status": "Inconclusive",
                "pulse_detected": False,
                "heart_rate": None,
                "details": {"reason": "Insufficient face data for pulse detection."}
            }

        # FFT Analysis
        signal = np.array(green_signals)
        signal = signal - np.mean(signal)
        
        n = len(signal)
        yf = fft(signal)
        xf = np.linspace(0.0, fps / 2.0, n // 2)
        amplitudes = 2.0/n * np.abs(yf[0:n//2])
        
        # Heart rate range: 45-180 BPM = 0.75-3.0 Hz
        mask = (xf >= 0.75) & (xf <= 3.0)
        hr_amplitudes = amplitudes[mask]
        hr_freqs = xf[mask]
        
        bpm = 0.0
        snr = 0.0
        peak_freq = 0.0
        
        if len(hr_amplitudes) > 0:
            peak_idx = int(np.argmax(hr_amplitudes))
            peak_freq = float(hr_freqs[peak_idx])
            peak_amp = float(hr_amplitudes[peak_idx])
            bpm = float(peak_freq * 60)
            mean_amp = float(np.mean(amplitudes))
            snr = float(peak_amp / mean_amp) if mean_amp > 0 else 0.0

        # Scoring
        score = 80.0
        if snr > 5.0 and 45 <= bpm <= 160:
            score = 10.0
        elif snr > 2.5:
            score = 35.0
        
        return {
            "score": float(score),
            "status": "Analyzed",
            "pulse_detected": bool(snr > 2.5),
            "heart_rate": float(bpm) if snr > 2.5 else None,
            "details": {
                "snr": snr,
                "peak_frequency": peak_freq,
                "data_points": len(green_signals)
            }
        }
