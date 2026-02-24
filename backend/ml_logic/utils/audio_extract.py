"""
Shared audio extraction utility.
Uses imageio-ffmpeg (bundled binary) to extract audio from video files
into a temporary WAV file that librosa can reliably read.
No system ffmpeg install required.
"""
import subprocess
import tempfile
import os
import imageio_ffmpeg


def extract_audio_to_wav(video_path: str, duration: int = 30) -> str | None:
    """
    Extract audio from a video file into a temporary WAV file.
    Returns the path to the temp WAV file, or None if extraction fails.
    The caller is responsible for deleting the temp file.
    """
    try:
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

        # Create a temp WAV file
        tmp = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
        tmp_path = tmp.name
        tmp.close()

        cmd = [
            ffmpeg_exe,
            '-y',                    # Overwrite output
            '-i', video_path,        # Input video
            '-t', str(duration),     # Max duration in seconds
            '-ac', '1',              # Mono
            '-ar', '22050',          # 22kHz sample rate (librosa default)
            '-vn',                   # Skip video stream
            '-f', 'wav',             # Output format
            tmp_path
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            timeout=60
        )

        # Check if output file has meaningful content
        if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 1000:
            return tmp_path
        else:
            os.unlink(tmp_path)
            return None

    except Exception as e:
        print(f"[AudioExtract] Failed to extract audio: {e}")
        return None
