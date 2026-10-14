# Pixel Patakha – ACM Backend

Backend service for PIXEL PATAKHA competition built with Node.js, Express, MongoDB, and Redis.

## Getting Started

### 1. Start MongoDB and Redis
Ensure Docker is installed and running, then run from project root:
```bash
docker compose up -d
```

### 2. Environment Variables
The `.env` file at the root contains the required configuration:
- `PORT`
- `MONGO_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

### 3. Setup and Run Backend
```bash
cd Backend
npm install
npm run seed:admin
npm run dev
```

The API will be available at: `http://localhost:5000/api`

## API Overview
- `GET /api/health` - Server health check
- `GET /api/competition` - Competition info (cached)
- `POST /api/auth/team/register` - Team registration
- `POST /api/auth/team/login` - Team login
- `POST /api/auth/staff/login` - Staff (Admin/Judge) login
- `GET /api/team/me` - Team profile & submission status
- `POST /api/submissions` - Design submission upload
- `GET /api/judge/*` - Judge endpoints
- `GET /api/admin/*` - Admin management endpoints
