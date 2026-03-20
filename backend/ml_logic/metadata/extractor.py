import os
import struct

# Known AI video generation tool signatures found in file bytes
AI_ENCODER_SIGNATURES = [
    b'Runway', b'runway', b'Sora', b'sora',
    b'Pika', b'pika', b'Kling', b'kling',
    b'AnimateDiff', b'animatediff', b'Stable Video',
    b'stable-video', b'stablediffusion',
    b'DALL-E', b'Midjourney',
    b'Synthesia', b'synthesia',
    b'libaom-av1',   # Common in AI-generated exports
    b'lavf58', b'lavf59', b'lavf60',  # FFmpeg re-encode flags
]

# Real camera software tags
REAL_CAMERA_TAGS = [
    b'Apple', b'Samsung', b'SAMSUNG', b'OnePlus', b'Xiaomi',
    b'Google', b'Canon', b'Nikon', b'Sony', b'GoPro',
    b'iPhone', b'Android', b'MediaTek'
]


class MetadataForce:
    """
    Exposes 'The Metadata Force': Scans raw file bytes for AI tool fingerprints,
    encoder tags, and missing camera metadata. Works without ffprobe.
    """
    def __init__(self, file_path):
        self.file_path = file_path

    def analyze(self):
        try:
            score = 20.0  # Neutral base
            findings = []
            ai_tool_found = None
            camera_found = None
            file_size = os.path.getsize(self.file_path)

            # --- Strategy 1: Raw byte scan for AI/camera signatures ---
            # Read first 500KB + last 100KB (metadata is usually at file edges)
            with open(self.file_path, 'rb') as f:
                header = f.read(512 * 1024)
                f.seek(max(0, file_size - 102400))
                footer = f.read()
            
            scan_data = header + footer

            for sig in AI_ENCODER_SIGNATURES:
                if sig in scan_data:
                    ai_tool_found = sig.decode('utf-8', errors='ignore')
                    score += 55.0
                    findings.append(f"AI tool signature detected: '{ai_tool_found}'")
                    break

            for sig in REAL_CAMERA_TAGS:
                if sig in scan_data:
                    camera_found = sig.decode('utf-8', errors='ignore')
                    score -= 35.0  # Stronger evidence for REAL
                    findings.append(f"Real camera tag found: '{camera_found}'")
                    break

            # --- Strategy 2: Check for generic 'encoder' box without device info ---
            # Messaging apps (WhatsApp/Telegram) STRIP these, so we shouldn't punish too hard
            has_make = any(b'make' in scan_data.lower() or b'Make' in scan_data 
                          for _ in [1])
            has_model = b'model' in scan_data or b'Model' in scan_data

            if not camera_found and not has_make and not has_model:
                score += 10.0  # Lowered from 20
                findings.append("No camera make/model tag found (stripped or synthetic)")

            # --- Strategy 3: File size / bitrate plausibility ---
            # AI video generators often produce unnaturally clean low-bitrate files
            # Real phone videos at 30fps are usually > 1MB/s
            # A 10-second AI video might be 2MB where a real one would be 15MB+
            # We use file size as a rough heuristic
            # (Only meaningful if we can estimate duration - skip for robustness)

            # --- Strategy 4: MP4 atom check ---
            # Check for 'ftyp' box (all real MP4s have it at byte 0-7)
            has_ftyp = b'ftyp' in header[:20]
            if not has_ftyp:
                score += 10.0
                findings.append("Missing standard MP4 ftyp atom")

            # Check for 'udta' user data atom (cameras put device info here)
            has_udta = b'udta' in scan_data
            if not has_udta and not camera_found:
                score += 10.0
                findings.append("No user data atom (udta) — common in AI-generated files")

            score = float(max(0.0, min(score, 100.0)))

            return {
                "score": score,
                "reencode_count": 2 if ai_tool_found else 1,
                "source_device": camera_found if camera_found else (f"AI Tool: {ai_tool_found}" if ai_tool_found else "Unknown/Synthetic"),
                "details": {
                    "ai_signature_found": ai_tool_found,
                    "camera_tag_found": camera_found,
                    "findings": findings,
                    "file_size_bytes": file_size
                }
            }
        except Exception as e:
            return {
                "score": 20.0,
                "reencode_count": 0,
                "source_device": "Unknown",
                "details": {"error": str(e)}
            }
