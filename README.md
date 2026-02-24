# 🛡️ VeriForce: The Jedi Mind Trick Detector

**Winner's Choice for Bluebit Hackathon 4.0**

VeriForce is a production-ready multi-modal deepfake detection platform designed to protect democracy and human connection in the age of synthetic media.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 20+
- Redis (optional for local, required for async processing)

### 1. Backend Setup (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures/sample_data.json
python manage.py runserver
```

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

### 3. Celery (Environment with Redis)
```bash
cd backend
celery -A config worker --loglevel=info
```

## 🏗️ Architecture: The Four Forces

VeriForce utilizes an ensemble engine that combines:
1. **Visual Force (35%)**: Face-swap and lighting analysis.
2. **Audio Force (30%)**: Voice cloning and breath pattern detection.
3. **Metadata Force (15%)**: File origin and compression artifact tracing.
4. **Biometric Force (20%)**: Remote Pulse (rPPG) and blood flow mapping.

## ✨ Unique Features
- **Jedi Council Views**: Specialized dashboards for Journalists, Lawyers, Citizens, and Platforms.
- **Election Guardian**: Real-time deepfake monitoring for the Indian electorate.
- **Blockchain Guardian**: Tamper-proof content authentication via Polygon.
- **Gamified Training**: Educating the public on how to spot the 'Force' (the truth).

## 🛠️ Tech Stack
- **Backend**: Django, DRF, Celery, Redis, PostgreSQL.
- **Frontend**: React 18, TypeScript, TailwindCSS, Framer Motion, Recharts.
- **Infrastructure**: Docker, Docker Compose, WhiteNoise.

---
*May the Force be with our code.*
