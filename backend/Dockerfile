FROM python:3.10-slim

# System dependencies for OpenCV, Librosa and ML
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libpq-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Static files collection
RUN python manage.py collectstatic --noinput

# Gunicorn start
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
