import numpy as np

class ForceEnsemble:
    """
    The Ensemble Fusion engine. Aggregates all forces dynamically.
    
    Weighting strategy:
    - LipSync is the strongest signal for talking-head deepfakes (survives re-encoding)
    - AI model (ViT) is strong for raw/uncompressed deepfakes
    - Visual/Metadata/Audio/Biometric supplement both
    """
    def __init__(self):
        # Re-calibrated coefficients for higher sensitivity (Recall-focused)
        # Intercept is shifted from -3.85 to -1.2 to reduce 'Real' bias.
        self.params = {
            "intercept": -1.25,  
            "w_lipsync": 2.80,
            "w_ai":      3.85, # Heavily weighted for neural detection
            "w_visual":  2.20,
            "w_bio":     1.05,
            "w_audio":   0.90,
            "w_meta":    0.45,
            # Boosted Interaction terms: If AI Model + Visual Forensic both trigger, it's a massive flag
            "w_ai_visual_inter": 2.10,
            "w_ai_lipsync_inter": 1.80
        }

    def fuse(self, visual_res, audio_res, meta_res, bio_res, ai_res=None, lipsync_res=None):
        """
        Meta-Learning Fusion Head:
        Calibrated for higher 'Fake' sensitivity to catch high-quality synthetic media.
        """
        # 1. Normalize scores to [0, 1] range
        x = {
            "vis": float(visual_res.get("score", 0)) / 100.0,
            "aud": float(audio_res.get("score", 0)) / 100.0,
            "met": float(meta_res.get("score", 0)) / 100.0,
            "bio": float(bio_res.get("score", 0)) / 100.0,
            "ai":  float(ai_res.get("score", 0)) / 100.0 if ai_res else 0.0,
            "lip": float(lipsync_res.get("score", 0)) / 100.0 if lipsync_res else 0.0
        }

        # 2. Compute Linear Combination (Logit)
        z = self.params["intercept"]
        z += x["vis"] * self.params["w_visual"]
        z += x["aud"] * self.params["w_audio"]
        z += x["met"] * self.params["w_meta"]
        z += x["bio"] * self.params["w_bio"]
        z += x["ai"]  * self.params["w_ai"]
        z += x["lip"] * self.params["w_lipsync"]

        # 3. Enhanced Interaction Terms
        z += (x["ai"] * x["vis"]) * self.params["w_ai_visual_inter"]
        z += (x["ai"] * x["lip"]) * self.params["w_ai_lipsync_inter"]

        # 4. Softmax/Sigmoid Activation
        final_prob = 1.0 / (1.0 + np.exp(-z))
        final_score = final_prob * 100.0

        # 5. Dynamic Confidence Calibration
        # We penalize confidence if there is high variance in input signals
        signal_variance = np.var(list(x.values()))
        confidence = max(0.01, min(1.0, 1.0 - (signal_variance * 1.2))) # High variance lowers confidence
        
        # Compute binary entropy as a proxy for uncertainty
        p = max(0.0001, min(0.9999, final_prob))
        entropy = -(p * np.log2(p) + (1 - p) * np.log2(1 - p))

        # Mapping to verdict
        if final_prob > 0.62:
            verdict = "FAKE"
        elif final_prob > 0.38:
            verdict = "SUSPICIOUS"
        else:
            verdict = "REAL"

        reasons = []
        if x["ai"] > 0.6: reasons.append("Neural classifier identified high-confidence synthetic patterns.")
        if x["lip"] > 0.6: reasons.append("Audio-visual desynchronization detected in speech.")
        if x["vis"] > 0.6: reasons.append("Forensic analysis detected frequency-domain reconstruction artifacts.")
        if not reasons: reasons.append("No significant synthetic signatures identified.")

        return {
            "final_score": float(final_score),
            "verdict": verdict,
            "confidence": float(confidence),
            "reasons": reasons,
            "force_scores": {k: float(v*100) for k, v in x.items()},
            "meta_metrics": {
                "logit_z": float(z),
                "entropy": float(entropy),
                "probability": float(final_prob)
            },
            "timeline_data": [{"time": 0, "score": final_score}],
            "weights_used": self.params
        }
