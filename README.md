# Pixel Patakha '26 – ACM Platform

PIXEL PATAKHA is a college-level UI/UX design competition at Bharati Vidyapeeths College Of Engineering, in is Tech Fest named BVEST organised by the collaboration of ACM x DAS where participants can register their teams, submit their designs, and have them evaluated by the judges.

Full-stack competition management platform for **Pixel Patakha '26**, featuring a retro 8-bit / voxel cyber-arcade design, live team registrations, multi-file artifact submission, judge scoring workflows, real-time announcements, and administrative controls.

---

## Tech Stack

- **Frontend**: React 19, Vite 8, React Router v7, Axios, Vanilla CSS design tokens (Zero Tailwind, mobile-first responsive 360px–1440px), 8-bit typography & custom pixel-art engine.
- **Backend**: Node.js (ES Modules), Express 5, MongoDB (Mongoose 9), Redis 6 (ioredis caching & session store), JWT authentication, Multer multi-file upload.
- **Infrastructure**: Docker & Docker Compose (MongoDB + Redis).

---

## Directory Structure

```
Pixel Patakha - ACM/
├── Backend/                 # Express REST API (ES Modules)
│   ├── config/              # Database & Redis connectors
│   ├── controllers/         # Auth, Admin, Judge, Team, Competition controllers
│   ├── middleware/          # JWT auth, role validation, error handler
│   ├── models/              # User, Team, Submission, Review, Announcement, Competition
│   ├── routes/              # Modular Express route handlers
│   ├── utils/               # Admin seed script, file helpers
│   └── server.js            # Server entrypoint
├── Frontend/                # Vite + React SPA
│   ├── public/              # Static assets, favicon, poster
│   ├── src/
│   │   ├── components/      # UI library (Buttons, Modals, Forms, Tables), Pixel sprites, Layouts
│   │   ├── config/          # API routes, axiosClient, event configuration
│   │   ├── features/        # Auth, Team, Judge, Admin, Common modules (Contexts, APIs, Pages)
│   │   ├── pages/           # LandingPage, 404NotFound
│   │   ├── styles/          # Design system tokens (globals.css), animations, resets
│   │   ├── App.jsx          # Route tree, RoleRoute, PublicOnlyRoute, lazy loading
│   │   └── main.jsx         # App mounting
│   ├── netlify.toml         # Netlify SPA redirect config
│   └── vite.config.js       # Vite build & reverse-proxy config
├── docker-compose.yml       # Local MongoDB + Redis services
├── design.md                # UI/UX design specifications & palette
└── .env                     # Shared environment configuration (ignored by git)
```

---

## Environment Setup

Create or verify the `.env` file in the **project root**:

```env
# Server
PORT=3000
NODE_ENV=development

# Database & Cache
MONGO_URI=mongodb://localhost:27017/pixel_patakha
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=super_secret_jwt_key_pixel_patakha_2026

# Seed Admin Credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@pixelpatakha.acm
ADMIN_PASSWORD=AdminSecurePassword123!

# Frontend Configuration
VITE_API_URL=/api
VITE_MIN_TEAM_SIZE=1
VITE_MAX_TEAM_SIZE=3
VITE_MAX_FILE_SIZE_MB=10
VITE_MAX_FILES=5
```

---

## Getting Started

### 1. Start Infrastructure (MongoDB & Redis)

Ensure Docker Desktop is running, then run from the root directory:

```bash
docker compose up -d
```

To verify containers are running:
```bash
docker compose ps
```

---

### 2. Start the Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the default Administrator account (creates the competition record and admin login):
   ```bash
   npm run seed:admin
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend runs at `http://localhost:3000` (`http://localhost:3000/api`)*.

---

### 3. Start the Frontend

1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend runs at `http://localhost:5173`. Requests to `/api` and `/uploads` are automatically proxied to the backend on port 3000.*

---

## Production Build

To verify and produce a production build of the frontend:

```bash
cd Frontend
npm run build
```

Built assets will be output to `Frontend/dist/`. For Netlify deployment, `netlify.toml` handles routing rewrites.

---

## Key Features & Updates

### 1. Modern Architecture
- **ES Modules**: Fully migrated backend and frontend to native Node ES Modules (`import`/`export`).
- **Clean Monorepo Git Config**: Unified root `.gitignore` properly shielding `.env`, `node_modules`, and local build artifacts.

### 2. Frontend UI / UX Pro Max (Retro Arcade & Cyberpunk)
- **Design Tokens**: CSS variables defined in `globals.css` driving colors (`--neon-cyan`, `--electric-purple`, `--patakha-amber`, `--arcade-pink`), scanline overlays, neon glow shadows, and CRT screen effects.
- **Pixel Art Engine**: Hand-drawn SVG sprites (fireworks, stars, gems, pixel diamonds) and dynamic voxel islands.
- **Responsive Layout**: Mobile-first design optimized for mobile (360px), tablet (768px), desktop (1024px), and ultra-wide displays (1440px).

### 3. Authentication & Role-Based Access Control
- **Team Authentication**: Self-registration with 1–3 members, validation, auto-login, and credential persistence in `localStorage`.
- **Staff Authentication**: Dedicated secure login for Judges and Administrators (`/staff/login`).
- **Route Guards**: `RoleRoute` protecting team, judge, and admin workspaces; `PublicOnlyRoute` redirecting authenticated users to their corresponding dashboard.

### 4. Team Workspace
- **Dashboard**: Live registration status, countdowns, announcement feeds, and competition deadline banners.
- **Submission Portal**: Multi-file dropzone (PNG, JPG, WEBP, PDF up to 10MB per file, max 5 files), preview grid, title, and project description with instant validation.

### 5. Judge Workspace
- **Submissions Grid**: Filter submissions, inspect participant files, and view team metadata.
- **Review System**: Numerical rubric scoring, constructive feedback notes, and review history tracking.

### 6. Admin Control Center
- **Overview & Statistics**: Total registrations, submissions count, active judges, and review completion rates.
- **Judge Management**: Authorize new judges, inspect activity, and delete judge accounts (with automated cascade removal of associated reviews).
- **Management Tools**: Manage registered teams (disqualification/reactivation), inspect submissions, publish real-time announcements, and update competition deadlines & rules.

### 7. UI / UX Polish & Enhancements
- **Password Visibility**: Built-in interactive Show/Hide password toggle across all authentication and judge creation forms.
- **Responsive Filter Chips**: Cyberpunk segmented status and sorting filter pills replacing oversized buttons for compact viewing.
- **Illuminated AI Gauge**: Clean diagnostics meter with risk threshold indicators (30% Review, 70% High Risk) and striped indicator for skipped scans.

---

## Deployment Guide

### 1. Backend on Render
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), create a new **Web Service**.
3. Link your repository with the following settings:
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Health Check Path**: `/health`
4. Set required **Environment Variables** in Render:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Cloud connection string (e.g. MongoDB Atlas `mongodb+srv://...`)
   - `JWT_SECRET`: Random secure string
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: Your Netlify URL (e.g. `https://your-site.netlify.app`)
   - `ADMIN_NAME`: `Admin`
   - `ADMIN_EMAIL`: `admin@pixelpatakha.acm`
   - `ADMIN_PASSWORD`: Your chosen admin password
   - `AI_DETECTION_ENABLED`: `true` (or `false` if not using Sightengine)
   - `SIGHTENGINE_API_USER` & `SIGHTENGINE_API_SECRET`
5. Run the seed script via the Render Web Shell to create the initial admin user and competition entry:
   ```bash
   node utils/seedAdmin.js
   ```

### 2. Frontend on Netlify
1. In [Netlify Dashboard](https://app.netlify.com/), click **Add new site** → **Import an existing project**.
2. Select your repository with these settings:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add the build environment variable:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://your-backend.onrender.com/api`)
4. Single-Page Application (SPA) routing is handled by `Frontend/public/_redirects` (`/* /index.html 200`), preventing 404 errors on browser page reloads.

---

## API Summary

| Route | Method | Access | Description |
|---|---|---|---|
| `/health` | `GET` | Public | Root-level health check (returns uptime & MongoDB state) |
| `/api/health` | `GET` | Public | API-level health check (returns uptime & MongoDB state) |
| `/api/competition` | `GET` | Public | Cached competition details & deadlines |
| `/api/announcements` | `GET` | Public | Global competition announcements |
| `/api/auth/team/register` | `POST` | Public | Team registration |
| `/api/auth/team/login` | `POST` | Public | Team login |
| `/api/auth/staff/login` | `POST` | Public | Staff (Admin/Judge) login |
| `/api/auth/me` | `GET` | Authenticated | Validate token and fetch current account |
| `/api/team/me` | `GET` | Team | Get current team profile & submission status |
| `/api/submissions/me` | `GET` | Team | Get team submission data |
| `/api/submissions` | `POST` | Team | Submit project with file uploads |
| `/api/judge/submissions` | `GET` | Judge | List submissions to review |
| `/api/judge/reviews` | `POST` | Judge | Submit rubric review & score |
| `/api/judge/reviews/me` | `GET` | Judge | List reviews authored by current judge |
| `/api/admin/overview` | `GET` | Admin | High-level statistics |
| `/api/admin/teams` | `GET` | Admin | List & search teams |
| `/api/admin/teams/:id` | `GET` | Admin | Detailed view of a team |
| `/api/admin/teams/:id` | `DELETE` | Admin | Delete team and associated files |
| `/api/admin/judges` | `GET` | Admin | List registered judges |
| `/api/admin/judges` | `POST` | Admin | Register new judge account |
| `/api/admin/judges/:id` | `DELETE` | Admin | Delete judge account and cascade-remove reviews |
| `/api/admin/competition` | `PUT` | Admin | Update dates, windows, and rules |
| `/api/admin/ai-detection/status` | `GET` | Admin | View AI API budget and usage status |
| `/api/admin/submissions/:id/ai-check`| `POST` | Admin | Rerun AI detection scan on a submission |
