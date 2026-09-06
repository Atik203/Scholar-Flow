# Scholar-Flow Deployment Guide

## Architecture

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│   Frontend (Vercel)  │     │  REST API (Vercel)   │     │  WebSocket (Render)  │
│   scholar-flow-ai    │────▶│  scholar-flow-api   │     │  scholar-ws          │
│   .vercel.app        │     │  .vercel.app         │     │  .onrender.com       │
│                      │     │                      │     │                      │
│   Next.js 16         │     │  Express + Prisma    │     │  Express + socket.io │
│   React 19.2         │     │  Auth, Papers, AI    │     │  Rooms, Presence,    │
│   RTK Query          │     │  Stripe, S3          │     │  Y.js Sync, Live Chat│
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
        │                            │                            │
        │  HTTP/REST                 │  HTTP/REST                 │  WebSocket
        │  NEXT_PUBLIC_API_BASE_URL  │  (all mutations)           │  NEXT_PUBLIC_WS_URL
        └────────────────────────────┴────────────────────────────┘
```

**3 services, 2 platforms, $0/month total.**

---

## Free Deployment Options

### Option A: Vercel (Frontend) + Vercel (REST API) + Render Free (WebSocket) — Recommended Free Setup

This is the setup documented below. Frontend + REST API on Vercel (free), WebSocket on Render (free).

| Service | Platform | URL | Cost |
|---------|----------|-----|------|
| Frontend | Vercel (Hobby) | `scholar-flow-ai.vercel.app` | $0 |
| REST API | Vercel (Hobby) | `scholar-flow-api.vercel.app` | $0 |
| WebSocket | Render Free | `scholar-flow-socket.onrender.com` | $0 |
| Database | Prisma Cloud | — | $0 (included) |

**Limitations:**
- Render Free auto-sleeps after 15min of inactivity — wakes on next request (~30s cold start)
- 500 build pipeline minutes/month (Render)
- 100GB bandwidth/month (Render)
- 512MB RAM, 0.1 CPU (Render) — fine for socket.io only

---

### Option B: Oracle Cloud Always Free (Full Backend, Zero Sleep)

For when you need the backend always-on with zero cold starts.

| Service | Platform | URL | Cost |
|---------|----------|-----|------|
| Frontend | Vercel (Hobby) | `scholar-flow-ai.vercel.app` | $0 |
| Backend (REST + WS) | Oracle Cloud ARM VM | Your IP or domain | $0 forever |
| Database | Prisma Cloud | — | $0 (included) |

**Oracle VM specs (Always Free):**
- 4 ARM cores (Ampere)
- 24 GB RAM
- 200 GB block storage
- 10 TB outbound data transfer/month
- Ubuntu 22.04 or 24.04

**Limitations:**
- Requires credit card for signup (never charged, $1 verification hold refunded)
- Manual setup (SSH, install Node, clone repo, configure nginx + SSL)
- Regional availability (check oracle.com/cloud/free)

---

## Option A: Step-by-Step — Vercel + Render Free

### Prerequisites

- **GitHub account** with Scholar-Flow repo (you have push access)
- **Vercel account** (sign up at [vercel.com](https://vercel.com) with GitHub)
- **Render account** (sign up at [render.com](https://render.com) with GitHub)
- **Node.js >= 24** installed locally (for generating secrets with `openssl`)

### 1. Deploy Frontend to Vercel

```bash
# In Vercel dashboard, create new project → Import GitHub repo
# Configure:
#   Framework: Next.js
#   Root Directory: apps/frontend
#   Build Command: cd ../.. && corepack yarn workspace @scholar-flow/frontend build
#   Install Command: cd ../.. && corepack enable && corepack yarn install --immutable
#   Output Directory: .next

# Environment Variables (add in Vercel dashboard):
NEXTAUTH_URL=https://scholar-flow-ai.vercel.app
BETTER_AUTH_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_SECRET=<same as BETTER_AUTH_SECRET>
NEXT_PUBLIC_API_BASE_URL=https://scholar-flow-api.vercel.app/api
NEXT_PUBLIC_WS_URL=https://scholar-flow-socket.onrender.com
NEXT_PUBLIC_SITE_URL=https://scholar-flow-ai.vercel.app

# OAuth
GOOGLE_CLIENT_ID=<your google client id>
GOOGLE_CLIENT_SECRET=<your google client secret>
GITHUB_CLIENT_ID=<your github client id>
GITHUB_CLIENT_SECRET=<your github client secret>

# Optional
NEXT_PUBLIC_GOOGLE_ANALYTICS=<ga-id>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<pk_test_...>

# Feature Flags
NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=true
NEXT_PUBLIC_FEATURE_ANNOTATIONS=true
NEXT_PUBLIC_FEATURE_BILLING=true
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_AI_ASSISTANT_ENABLED=true
NEXT_PUBLIC_USE_PGVECTOR=true
```

### 2. Deploy REST API to Vercel

```bash
# In Vercel dashboard, create new project → Import same GitHub repo
# Configure:
#   Framework: Other
#   Root Directory: apps/backend
#   Build Command: cd ../.. && corepack yarn workspace @scholar-flow/backend db:generate && corepack yarn workspace @scholar-flow/backend build
#   Install Command: cd ../.. && corepack enable && corepack yarn install --immutable
#   Output Directory: dist

# Environment Variables (add in Vercel dashboard):
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://scholar-flow-ai.vercel.app
WS_URL=https://scholar-flow-socket.onrender.com

# Database (Prisma Cloud)
USE_PGVECTOR=true
DATABASE_URL=<your prisma accelerate url>
DIRECT_DATABASE_URL=<your direct postgres url>

# JWT
JWT_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_SECRET=<same as JWT_SECRET>

# OAuth
GOOGLE_CLIENT_ID=<same as frontend>
GOOGLE_CLIENT_SECRET=<same as frontend>
GITHUB_CLIENT_ID=<same as frontend>
GITHUB_CLIENT_SECRET=<same as frontend>

# AI (add keys to enable providers)
OPENAI_API_KEY=<sk-...>
GEMINI_API_KEY=<AIza...>
ANTHROPIC_API_KEY=<sk-ant-...>
DEEPSEEK_API_KEY=<sk-...>
AI_PROVIDER_FALLBACK_ORDER=openai,gemini,claude,deepseek
AI_FEATURES_ENABLED=true

# AWS S3
AWS_ACCESS_KEY_ID=<your access key>
AWS_SECRET_ACCESS_KEY=<your secret key>
AWS_BUCKET_NAME=<your bucket>
AWS_REGION=us-east-1

# Stripe (optional)
STRIPE_SECRET_KEY=<sk_test_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>

# Email
RESEND_API_KEY=<re_...>
EMAIL=<your email>
APP_PASS=<gmail app password>

# Redis (optional)
REDIS_URL=<redis url>
```

### 3. Deploy WebSocket Server to Render Free

```bash
# In Render dashboard:
#   New → Web Service → Connect GitHub repo
# Configure:
#   Name: scholar-flow-socket
#   Root Directory: apps/socket-server
#   Environment: Node
#   Build Command: yarn install && yarn build
#   Start Command: yarn start
#   Instance Type: Free

# Environment Variables (add in Render dashboard):
NODE_ENV=production
PORT=5001
JWT_SECRET=<same JWT_SECRET as backend>
FRONTEND_URL=https://scholar-flow-ai.vercel.app
```

### 4. Verify Deployment

```bash
# Frontend
curl https://scholar-flow-ai.vercel.app
# Should return: 200 OK (HTML)

# REST API
curl https://scholar-flow-api.vercel.app/api/health
# Should return: { "status": "ok", ... }

# WebSocket
curl https://scholar-flow-socket.onrender.com/health
# Should return: { "status": "ok", "uptime": ..., "timestamp": "..." }
```

### 5. Production Checklist

- [ ] All 3 services returning 200 on health endpoints
- [ ] OAuth login working (Google + GitHub)
- [ ] Paper upload working (S3)
- [ ] AI features working (summary, insights, chat)
- [ ] WebSocket connection established (check browser devtools → Network → WS)
- [ ] Live discussion messages appear in real-time
- [ ] Stripe webhooks configured in Stripe Dashboard → `https://scholar-flow-api.vercel.app/webhooks/stripe`
- [ ] Domain (optional): Add custom domain in Vercel + Render dashboards

---

## Option B: Step-by-Step — Vercel (Frontend) + Oracle Cloud (Full Backend)

### Prerequisites

- Oracle Cloud account (requires credit card, never charged)
- SSH key pair
- Domain name (optional, for HTTPS)

### 1. Create Oracle Cloud VM

```bash
# 1. Sign in at cloud.oracle.com
# 2. Navigate to Compute → Instances → Create Instance
# 3. Configure:
#    Name: scholar-flow-backend
#    Image: Ubuntu 24.04 (LTS)
#    Shape: VM.Standard.A1.Flex (4 OCPU, 24 GB RAM)
#    Boot Volume: 100 GB
#    Add SSH key
# 4. Create

# Note: If "Out of capacity" error, try a different region or
# upgrade to PAYG account ($0 with free resources, no charges)
```

### 2. Configure VM

```bash
# SSH into the VM
ssh ubuntu@<VM_PUBLIC_IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node version
node --version
# Should show: v24.x.x

# Enable Corepack for Yarn
corepack enable
corepack prepare yarn@4.9.2 --activate

# Verify Yarn version
yarn --version
# Should show: 4.9.2

# Install git
sudo apt install -y git

# Clone repo
git clone https://github.com/Atik203/Scholar-Flow.git
cd Scholar-Flow

# Install dependencies and generate Prisma client
yarn setup

# Build backend
cd apps/backend
yarn build

# Create .env.production
cp .env.example .env.production
# Edit with nano/vim: set all production values
# Key env vars:
#   NODE_ENV=production
#   PORT=5000
#   FRONTEND_URL=https://scholar-flow-ai.vercel.app
#   JWT_SECRET=<strong secret>
#   DATABASE_URL=<prisma cloud url>
#   DIRECT_DATABASE_URL=<direct postgres url>
#   AWS_* (S3 creds)
#   OPENAI_API_KEY, GEMINI_API_KEY, etc.
```

### 3. Configure Nginx Reverse Proxy + SSL

```bash
# Install nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/scholar-flow

# Paste:
server {
    listen 80;
    server_name api.yourdomain.com;  # or your VM IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;  # Long timeout for WebSocket
    }

    # WebSocket endpoint
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/scholar-flow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate (if you have a domain)
sudo certbot --nginx -d api.yourdomain.com

# Open firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3.5 Deploy WebSocket Server (Socket.io)

The socket-server can run on the same VM on port 5001:

```bash
# Build socket-server
cd /home/ubuntu/Scholar-Flow/apps/socket-server
yarn install
yarn build

# Create .env
cp .env.example .env
# Edit with:
#   PORT=5001
#   NEXTAUTH_SECRET=<same JWT_SECRET as backend>
#   FRONTEND_URL=https://scholar-flow-ai.vercel.app
```

Then add a second systemd service for the socket-server (see next step).

### 4. Run as Systemd Services

#### REST API Service

```bash
# Create service file
sudo nano /etc/systemd/system/scholar-flow.service

# Paste:
[Unit]
Description=Scholar-Flow Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Scholar-Flow/apps/backend
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/home/ubuntu/Scholar-Flow/apps/backend/.env.production

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable scholar-flow
sudo systemctl start scholar-flow
sudo systemctl status scholar-flow

# View logs
sudo journalctl -u scholar-flow -f
```

#### WebSocket Service

```bash
# Create service file
sudo nano /etc/systemd/system/scholar-flow-socket.service

# Paste:
[Unit]
Description=Scholar-Flow WebSocket Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Scholar-Flow/apps/socket-server
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/home/ubuntu/Scholar-Flow/apps/socket-server/.env

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable scholar-flow-socket
sudo systemctl start scholar-flow-socket
sudo systemctl status scholar-flow-socket

# View logs
sudo journalctl -u scholar-flow-socket -f
```

Also add the socket-server location to the Nginx config:

```nginx
# Add inside the server block from step 3:
location /socket.io/ {
    proxy_pass http://localhost:5001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Don't forget to reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Update Frontend Env Vars

```bash
# In Vercel dashboard → Frontend project → Environment Variables:
# Update to point to Oracle VM:
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_WS_URL=https://api.yourdomain.com

# Also update OAuth redirect URIs in Google/GitHub consoles
# to include your new domain
```

### 6. PostgreSQL (Optional — if not using Prisma Cloud)

```bash
# Install PostgreSQL 18
sudo apt install -y postgresql-18 postgresql-18-pgvector

# Create database
sudo -u postgres psql -c "CREATE DATABASE scholarflow_prod;"
sudo -u postgres psql -c "CREATE USER scholarflow WITH PASSWORD 'strong_password';"
sudo -u postgres psql -c "GRANT ALL ON DATABASE scholarflow_prod TO scholarflow;"
sudo -u postgres psql -d scholarflow_prod -c "CREATE EXTENSION IF NOT EXISTS vector;"
sudo -u postgres psql -d scholarflow_prod -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

# Run migrations
cd /home/ubuntu/Scholar-Flow/apps/backend
DATABASE_URL=postgres://scholarflow:strong_password@localhost:5432/scholarflow_prod yarn db:migrate
yarn db:generate
```

---

## Production Deployment (Full-Fledged)

For production with paid infrastructure:

| Service | Platform | Cost Estimate |
|---------|----------|---------------|
| Frontend | Vercel Pro | $20/mo |
| Backend | Fly.io (`shared-cpu-1x 2GB`) | ~$12/mo |
| Database | Prisma Cloud or Fly Postgres | $0-$20/mo |
| Redis | Upstash Free | $0 |
| CDN | Vercel (included) | $0 |
| **Total** | | **~$32-52/mo** |

### Production Checklist

- [ ] Custom domain with SSL (Let's Encrypt / Vercel auto)
- [ ] WebSocket on dedicated subdomain (ws.yourdomain.com)
- [ ] Database backups (point-in-time recovery)
- [ ] Monitoring (Sentry, Vercel Analytics, Fly Metrics)
- [ ] CI/CD pipeline (GitHub Actions for test → deploy)
- [ ] Rate limiting tuned for production (not TESTING values)
- [ ] CSP headers hardened (strict origin list)
- [ ] Stripe live mode keys
- [ ] AWS S3 bucket policy restricted
- [ ] Email delivery (Resend production tier)
- [ ] Uptime monitoring (UptimeRobot, BetterStack)

### Production Env Vars to Lock Down

```bash
# Change ALL secrets to new, strong values:
JWT_SECRET=<openssl rand -base64 64>
NEXTAUTH_SECRET=<openssl rand -base64 64>
BETTER_AUTH_SECRET=<openssl rand -base64 64>
REFRESH_TOKEN_SECRET=<openssl rand -base64 64>
RESET_PASS_TOKEN=<openssl rand -base64 64>

# Use production Stripe keys:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Enable all security features:
RATE_LIMIT_MAX=100          # (was 1000 TESTING)
AI_REQUEST_TIMEOUT_MS=30000  # Lower if AI is slow
```

---

## Troubleshooting

### WebSocket not connecting

```bash
# Check socket server is running
curl https://scholar-flow-socket.onrender.com/health

# Check env var in frontend
# Open browser console: console.log(process.env.NEXT_PUBLIC_WS_URL)

# Check Render logs
# Render dashboard → scholar-flow-socket → Logs
```

### Render auto-sleep / cold start

```bash
# Render Free sleeps after 15min no-traffic
# Workaround 1: UptimeRobot free monitor pings /health every 5 min
# Workaround 2: Frontend pings /health before opening WebSocket
# Workaround 3: Switch to Oracle Cloud (Option B) for zero-sleep
```

### CORS errors

```bash
# Verify FRONTEND_URL in backend/socket-server matches actual frontend URL
# Check for trailing slashes
FRONTEND_URL=https://scholar-flow-ai.vercel.app  # ✅ No trailing slash
FRONTEND_URL=https://scholar-flow-ai.vercel.app/  # ❌ Trailing slash
```
