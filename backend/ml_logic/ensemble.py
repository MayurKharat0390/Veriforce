class ForceEnsemble:
    """
    The Ensemble Fusion engine. Aggregates all forces dynamically.
    
    Weighting strategy:
    - LipSync is the strongest signal for talking-head deepfakes (survives re-encoding)
    - AI model (ViT) is strong for raw/uncompressed deepfakes
    - Visual/Metadata/Audio/Biometric supplement both
    """
    def __init__(self):
        self.base_weights = {
            "lipsync": 0.30,  # Lip-audio sync consistency
            "ai":      0.30,  # ViT deepfake classifier
            "visual":  0.18,  # Texture + temporal analysis
            "bio":     0.12,  # rPPG pulse — strong signal when face present
            "audio":   0.06,  # Spectral + pitch
            "meta":    0.04,  # Byte scan for AI tool signatures
        }

    def fuse(self, visual_res, audio_res, meta_res, bio_res, ai_res=None, lipsync_res=None):
        reasons = []
        current_weights = self.base_weights.copy()
        force_scores = {
            "visual": float(visual_res.get("score", 0)),
            "audio":  float(audio_res.get("score", 0)),
            "meta":   float(meta_res.get("score", 0)),
            "bio":    float(bio_res.get("score", 0)),
        }

        # --- Handle LipSync Force ---
        if lipsync_res is None or lipsync_res.get("status") == "No Face/Mouth Detected":
            lipsync_wt = current_weights.pop("lipsync", 0)
            current_weights["ai"]     = current_weights.get("ai", 0)     + lipsync_wt * 0.5
            current_weights["visual"] = current_weights.get("visual", 0) + lipsync_wt * 0.5
            reasons.append("LipSync skipped — no face/mouth detected.")
        else:
            force_scores["lipsync"] = float(lipsync_res.get("score", 0))
            corr = lipsync_res.get("lip_sync_correlation", 1.0)
            frozen = lipsync_res.get("low_mouth_movement", False)
            if force_scores["lipsync"] > 60:
                reasons.append(
                    f"Lip-audio sync mismatch detected (correlation: {corr:.2f}) — "
                    f"{'mouth barely moved' if frozen else 'desynchronized with speech'}."
                )

        # --- Handle AI Force ---
        if ai_res is None or ai_res.get("status") == "AI Model Unavailable":
            ai_wt = current_weights.pop("ai", 0)
            current_weights["visual"] = current_weights.get("visual", 0) + ai_wt * 0.6
            current_weights["meta"]   = current_weights.get("meta", 0)   + ai_wt * 0.4
        else:
            force_scores["ai"] = float(ai_res.get("score", 0))
            prob = ai_res.get("avg_fake_probability", 0)
            if force_scores["ai"] > 50:
                reasons.append(f"AI model flagged synthetic content (fake prob: {prob:.1%}).")

        # --- Edge case: No Face ---
        if visual_res.get("status") == "No Face Detected":
            bio_wt = current_weights.pop("bio", 0)
            current_weights["meta"] = current_weights.get("meta", 0) + bio_wt
            reasons.append("No face — biometric skipped.")

        # --- Edge case: No Audio ---
        if audio_res.get("status") == "No Audio":
            audio_wt = current_weights.pop("audio", 0)
            current_weights["visual"] = current_weights.get("visual", 0) + audio_wt
            reasons.append("No audio track.")

        # --- Weighted Score ---
        total_weight = sum(current_weights.values())
        final_score = 0.0
        if total_weight > 0:
            for force, weight in current_weights.items():
                s = force_scores.get(force, 0.0)
                final_score += s * (weight / total_weight)
                if s > 60 and force not in ("lipsync", "ai"):
                    label = {
                        "visual": f"Visual: unnatural textures/temporal artifacts (score: {s:.0f})",
                        "audio":  f"Audio: spectral gap/robotic pitch (score: {s:.0f})",
                        "meta":   f"Metadata: AI tool signature or missing camera tags (score: {s:.0f})",
                        "bio":    f"Biometric: no detectable pulse (score: {s:.0f})",
                    }.get(force)
                    if label:
                        reasons.append(label)

        final_score = float(final_score)

        # --- AI High-Confidence Override ---
        # Only override if:
        # 1. Raw fake probability > 65% (not just the 0-100 score which peaks at 50 for ambiguous)
        # 2. At least one OTHER force also scores suspicious (>40) for corroboration
        #    This prevents WhatsApp compression artifacts from alone triggering a false FAKE
        ai_raw_prob = 0.0
        if ai_res and "avg_fake_probability" in ai_res:
            ai_raw_prob = float(ai_res["avg_fake_probability"])

        other_suspicious = any(
            force_scores.get(f, 0) > 40
            for f in ("visual", "bio", "lipsync", "audio", "meta")
        )

        if ai_raw_prob > 0.65 and other_suspicious:
            ai_score = force_scores.get("ai", 0.0)
            boosted = (final_score * 0.35) + (ai_score * 0.65)
            if boosted > final_score:
                final_score = float(boosted)
                reasons.append(
                    f"AI model high-confidence FAKE ({ai_raw_prob:.1%}) confirmed by corroborating signals."
                )

        # Verdict threshold: >50 = FAKE (balanced — not too sensitive)
        verdict = "FAKE" if final_score > 50 else "REAL"
        confidence = 0.94 if "lipsync" in force_scores else 0.78

        if not reasons:
            reasons.append("All active forces indicate consistent human-origin content.")

        return {
            "final_score": final_score,
            "verdict": verdict,
            "confidence": float(confidence),
            "reasons": reasons,
            "force_scores": {k: float(v) for k, v in force_scores.items()},
            "timeline_data": [{"time": 0, "score": final_score}],
            "weights_used": {k: float(v) for k, v in current_weights.items()}
        }
