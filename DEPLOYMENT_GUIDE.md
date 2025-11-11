# 🚀 Deployment Guide - EduCareer AI

## Overview

This guide covers deploying the EduCareer AI platform to production environments. The application consists of three main components that need to be deployed:

1. **Frontend** (React + Vite)
2. **Node.js Backend** (Express + MongoDB)
3. **AI Backend** (Python + FastAPI)

## Deployment Options

### Option 1: Cloud Platform (Recommended)

#### AWS Deployment

**Frontend (S3 + CloudFront)**
```bash
# Build frontend
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Backend (EC2 or ECS)**
```bash
# Node.js Backend
# Use PM2 for process management
npm install -g pm2
pm2 start server/src/index.ts --name educareer-api

# AI Backend
# Use Gunicorn with Uvicorn workers
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

**Database (MongoDB Atlas)**
- Create MongoDB Atlas cluster
- Update connection string in .env
- Configure IP whitelist
- Enable backup and monitoring

#### Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd edu-career-ai
vercel --prod
```

#### Railway/Render (Backend Services)

**Node.js Backend**
```yaml
# railway.json or render.yaml
services:
  - type: web
    name: educareer-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
```

**AI Backend**
```yaml
services:
  - type: web
    name: educareer-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python main.py
    envVars:
      - key: MONGODB_URI
        sync: false
```

### Option 2: Docker Deployment

#### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/educareer?authSource=admin
      - JWT_SECRET=${JWT_SECRET}
      - PORT=5000
    depends_on:
      - mongodb

  ai-backend:
    build: ./ai-backend
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/educareer?authSource=admin
    depends_on:
      - mongodb
    volumes:
      - ./ai-backend/models:/app/models

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
      - ai-backend

volumes:
  mongodb_data:
```

#### Dockerfile for Frontend

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile for Node.js Backend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["node", "src/index.js"]
```

#### Dockerfile for AI Backend

```dockerfile
FROM python:3.9-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

COPY ai-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ai-backend/ .

EXPOSE 8000
CMD ["python", "main.py"]
```

#### Deploy with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Kubernetes Deployment

#### Kubernetes Manifests

**Frontend Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: educareer-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/educareer-frontend:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: frontend
```

**Backend Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: educareer-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/educareer-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
```

## Environment Configuration

### Production Environment Variables

**Frontend (.env.production)**
```env
VITE_API_URL=https://api.educareer.com
VITE_AI_API_URL=https://ai.educareer.com
```

**Node.js Backend (.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/educareer
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=https://educareer.com
```

**AI Backend (.env)**
```env
ENVIRONMENT=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/educareer
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp (optional)
WHATSAPP_API_KEY=your-api-key
```

## Security Checklist

### Pre-Deployment Security

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Implement API key authentication
- [ ] Set up firewall rules
- [ ] Enable security headers

### SSL/TLS Configuration

**Using Let's Encrypt (Certbot)**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d educareer.com -d www.educareer.com

# Auto-renewal
sudo certbot renew --dry-run
```

**Nginx Configuration**
```nginx
server {
    listen 80;
    server_name educareer.com www.educareer.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name educareer.com www.educareer.com;

    ssl_certificate /etc/letsencrypt/live/educareer.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/educareer.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ai {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## Performance Optimization

### Frontend Optimization

```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze

# Enable compression
# Add to vite.config.ts
import compression from 'vite-plugin-compression'

export default {
  plugins: [
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress' })
  ]
}
```

### Backend Optimization

**Node.js**
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching
const redis = require('redis');
const client = redis.createClient();

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

**AI Backend**
```python
# Enable caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")

# Use caching decorator
@cache(expire=3600)
async def get_recommendations():
    # Expensive operation
    pass
```

## Monitoring & Logging

### Application Monitoring

**PM2 Monitoring**
```bash
# Install PM2
npm install -g pm2

# Start with monitoring
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs
```

**Sentry Integration**
```javascript
// Frontend
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});

// Backend
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your-sentry-dsn" });
```

### Database Monitoring

```bash
# MongoDB monitoring
mongotop
mongostat

# Enable profiling
db.setProfilingLevel(1, { slowms: 100 })
```

## Backup Strategy

### Database Backups

```bash
# Automated MongoDB backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://user:pass@host/educareer" --out="/backups/$DATE"

# Compress backup
tar -czf "/backups/backup_$DATE.tar.gz" "/backups/$DATE"

# Upload to S3
aws s3 cp "/backups/backup_$DATE.tar.gz" s3://your-backup-bucket/
```

### Automated Backup Script

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## Rollback Strategy

### Quick Rollback

```bash
# Docker
docker-compose down
docker-compose up -d --build

# Kubernetes
kubectl rollout undo deployment/educareer-backend

# PM2
pm2 reload ecosystem.config.js
```

## Post-Deployment Checklist

- [ ] Verify all services are running
- [ ] Test all API endpoints
- [ ] Check database connections
- [ ] Verify SSL certificates
- [ ] Test user authentication
- [ ] Check file uploads work
- [ ] Verify email notifications
- [ ] Test AI recommendations
- [ ] Monitor error logs
- [ ] Set up alerts
- [ ] Configure backups
- [ ] Update DNS records
- [ ] Test from different locations
- [ ] Mobile responsiveness check
- [ ] Performance testing

## Maintenance

### Regular Tasks

**Daily**
- Monitor error logs
- Check system resources
- Review user feedback

**Weekly**
- Database optimization
- Security updates
- Backup verification

**Monthly**
- Dependency updates
- Performance review
- Cost optimization

---

**Need Help?** Check the troubleshooting section or contact support.
