# ASCENDRA Enterprise v1.0 — Production Deployment Guide

This guide provides step-by-step instructions for deploying ASCENDRA Enterprise to production environments using Docker, Kubernetes, or cloud providers (GCP/AWS).

---

## 1. Environment Configuration

Copy `.env.example` to `.env` and set production secrets:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/ascendra_prod
REDIS_URI=redis://:<password>@redis-cluster.internal:6379
JWT_SECRET=super_secret_enterprise_jwt_key_2026
ENCRYPTION_SECRET=32_byte_hex_encryption_key_for_biometrics
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

---

## 2. Docker & Docker-Compose Deployment

### Single Server / Staging:
```bash
# Build and start services in detached mode
docker-compose up -d --build

# Verify container health
docker-compose ps
```

---

## 3. Kubernetes Deployment (Production Cluster)

```bash
# Apply Kubernetes Manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verify pod status and readiness probes
kubectl get pods -l app=ascendra-api
kubectl get svc ascendra-api-service
```

---

## 4. Health Checks & Verification

- **Liveness Probe**: `GET /health/liveness` (Returns HTTP 200)
- **Readiness Probe**: `GET /health/readiness` (Checks MongoDB & Redis connectivity)
- **Full Health Diagnostics**: `GET /health`

---

## 5. Backup & Disaster Recovery

Run database backup script daily:
```bash
mongodump --uri="$MONGO_URI" --out=/backups/$(date +%F)
```
