# Multi-stage Enterprise Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build frontend bundle
COPY . .
RUN npm run build

# Backend production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5000

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

EXPOSE 5000
CMD ["node", "server.js"]
