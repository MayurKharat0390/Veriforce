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
                gray = cv2.equalizeHist(gray) # Boost contrast
                faces = self.face_cascade.detectMultiScale(gray, 1.05, 3, minSize=(60, 60))
                
                if len(faces) > 0:
                    # Take biggest face
                    x, y, w, h = max(faces, key=lambda f: f[2]*f[3])
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
        # Default to neutral if results are unclear
        score = 30.0 
        
        if snr > 5.0 and 45 <= bpm <= 160:
            # Strong pulse found -> Likely REAL
            score = 10.0
        elif snr > 3.0:
            # Moderate pulse found -> Lean REAL
            score = 25.0
        elif snr < 1.0 and len(green_signals) > 100:
            # Clear data but ZERO signal -> Suspicious FAKE
            score = 75.0
        
        # Return sampling for UI visualization
        # We take at most 100 points to keep the payload small
        step = max(1, len(green_signals) // 100)
        ui_signals = [float(s) for s in green_signals[::step]]

        return {
            "score": float(score),
            "status": "Analyzed" if snr > 2.0 else "Weak Signal",
            "pulse_detected": bool(snr > 2.5),
            "heart_rate": float(bpm) if snr > 2.5 else None,
            "details": {
                "snr": snr,
                "peak_frequency": peak_freq,
                "data_points": len(green_signals),
                "ui_signals": ui_signals
            }
        }
