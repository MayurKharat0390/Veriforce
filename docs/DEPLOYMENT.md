# Deployment Guide

## 🐳 Docker Deployment (Recommended)
The easiest way to deploy the full stack is using Docker Compose.

```bash
docker-compose up --build
```

## ☁️ Cloud Deployment

### Backend (Railway / Render)
1. Link your GitHub repository.
2. Set root directory to `backend`.
3. Add Environment Variables:
   - `SECRET_KEY`: Your secret key
   - `DEBUG`: `False`
   - `DATABASE_URL`: Your PostgreSQL URL
   - `REDIS_URL`: Your Redis URL
4. Build Command: `pip install -r requirements.txt && python manage.py migrate`
5. Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:8000`

### Frontend (Vercel)
1. Link your GitHub repository.
2. Set root directory to `frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://api.veriforce.ai/api/`)

### Database & Redis
- **PostgreSQL**: Use Supabase or Neon.
- **Redis**: Use Upstash.
- **Media Storage**: Configure `django-storages` with AWS S3 for production video uploads.
