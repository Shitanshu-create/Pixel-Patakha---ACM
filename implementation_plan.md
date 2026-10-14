# PIXEL PATAKHA – Backend Implementation Plan (MERN)

Scope: **Backend only** (Node.js + Express + MongoDB + Redis). No frontend files are part of this plan.
Repo: `Shitanshu-create/Pixel-Patakha---ACM` (currently has `Backend/`, `Frontend/`, `.env`, `.gitignore` at root).

---

## 1. Backend Features → Deliverables Mapping

| Deliverable | Backend responsibility |
|---|---|
| Landing Page | Public API returning competition details (name, description, dates, status of registration/submission) |
| Team Registration | Register a team with team details + member info; team login |
| Team Dashboard | Team can fetch own registration details, own submission status, and competition announcements |
| Design Submission | Team uploads design file(s) while submissions are open |
| Admin Panel | Admin manages teams, judges, announcements, competition settings; views all submissions |
| Judging & Review | Judge views submissions, gives feedback + score |
| Submission Management | Every submission linked to its team, stores team name reference and submission time |
| Responsive Design | Frontend concern – backend only needs CORS configured for the frontend URL |

---

## 2. Tech Stack & Packages

| Purpose | Package |
|---|---|
| Server | `express` |
| Database | `mongoose` (MongoDB) |
| Cache | `ioredis` (Redis) |
| Env loading | `dotenv` |
| Password hashing | `bcryptjs` |
| Auth tokens | `jsonwebtoken` |
| File upload | `multer` |
| Validation | `express-validator` |
| CORS | `cors` |
| Dev | `nodemon` (devDependency) |

```bash
cd Backend
npm init -y
npm i express mongoose ioredis dotenv bcryptjs jsonwebtoken multer express-validator cors
npm i -D nodemon
```

`package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed:admin": "node utils/seedAdmin.js"
}
```

---

## 3. Folder Structure (based on your screenshot)

```
Pixel-Patakha---ACM/
├── .env                      # ONE env file for Frontend + Backend (already in project)
├── .gitignore
├── docker-compose.yml        # MongoDB + Redis containers
├── README.md
├── Frontend/                 # (not touched)
└── Backend/
    ├── config/
    │   ├── db.js             # MongoDB connection
    │   ├── env.js            # Loads root .env and exports validated config
    │   └── redis.js          # Redis connection
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── competition.controller.js
    │   ├── team.controller.js
    │   ├── submission.controller.js
    │   ├── review.controller.js
    │   ├── announcement.controller.js
    │   └── admin.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js        # verifies JWT
    │   ├── role.middleware.js        # allows only given roles
    │   ├── upload.middleware.js      # multer config
    │   ├── validate.middleware.js    # returns express-validator errors
    │   ├── competitionWindow.middleware.js  # registration / submission open checks
    │   └── error.middleware.js       # notFound + global error handler
    ├── models/
    │   ├── Team.model.js
    │   ├── User.model.js             # admin + judge accounts
    │   ├── Submission.model.js
    │   ├── Review.model.js
    │   ├── Announcement.model.js
    │   └── Competition.model.js      # single settings document
    ├── routes/
    │   ├── index.js                  # mounts all routers under /api
    │   ├── auth.routes.js
    │   ├── competition.routes.js
    │   ├── team.routes.js
    │   ├── submission.routes.js
    │   ├── judge.routes.js
    │   ├── announcement.routes.js
    │   └── admin.routes.js
    ├── services/
    │   ├── auth.service.js
    │   ├── team.service.js
    │   ├── submission.service.js
    │   ├── review.service.js
    │   └── cache.service.js          # Redis get/set/delete helpers
    ├── utils/
    │   ├── ApiError.js
    │   ├── asyncHandler.js
    │   ├── generateToken.js
    │   ├── apiResponse.js
    │   └── seedAdmin.js              # creates first admin from .env
    ├── uploads/                      # uploaded designs (git-ignored)
    ├── .gitignore
    ├── app.js                        # express app, middlewares, routes
    ├── package.json
    └── server.js                     # connects DB/Redis, starts server
```

Responsibility split (same as the screenshot's layering):
**routes** → **middlewares** → **controllers** (HTTP only) → **services** (business logic) → **models** (Mongo).

---

## 4. Environment Variables (root `.env`)

`config/env.js` must load the root file:
```js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
```

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/pixel-patakha
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d

# First admin (used by seed script)
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@pixelpatakha.com
ADMIN_PASSWORD=Admin@12345

# Uploads
MAX_FILE_SIZE_MB=10
MAX_FILES_PER_SUBMISSION=5

# Team size (member count incl. leader)
MIN_TEAM_SIZE=1
MAX_TEAM_SIZE=4
```
`env.js` should throw on startup if `MONGO_URI` or `JWT_SECRET` is missing.

---

## 5. Data Models

### 5.1 `Competition` (single document – landing page + windows)
| Field | Type |
|---|---|
| name, tagline, description | String |
| venue, rules | String / [String] |
| eventDate | Date |
| registrationOpen | Boolean (default `true`) |
| registrationDeadline | Date |
| submissionOpen | Boolean (default `false`) |
| submissionDeadline | Date |

Created automatically (with defaults) the first time it is requested if none exists.

### 5.2 `Team`
| Field | Type / Rules |
|---|---|
| teamName | String, required, **unique** |
| leaderEmail | String, required, unique, lowercase (login id) |
| password | String, required, hashed with bcrypt, `select: false` |
| college | String, required |
| members | `[{ name, email, phone }]` – length between `MIN_TEAM_SIZE` and `MAX_TEAM_SIZE`; first member = leader |
| role | `'team'` (fixed) |
| createdAt | auto (`timestamps: true`) |

### 5.3 `User` (admin & judge)
| Field | Type / Rules |
|---|---|
| name | String |
| email | unique, lowercase |
| password | hashed, `select: false` |
| role | `'admin'` \| `'judge'` |

### 5.4 `Submission`
| Field | Type / Rules |
|---|---|
| team | ObjectId → Team, required, **unique** (one submission per team) |
| teamName | String (copied at submit time for easy listing) |
| title | String, required |
| description | String |
| files | `[{ originalName, filename, url, mimeType, size }]` |
| submittedAt | Date, default `Date.now` |

### 5.5 `Review`
| Field | Type / Rules |
|---|---|
| submission | ObjectId → Submission |
| judge | ObjectId → User |
| score | Number, 0–100, required |
| feedback | String, required |
| timestamps | auto |

Compound unique index `{ submission, judge }` → one review per judge per submission (re-posting updates it).

### 5.6 `Announcement`
| Field | Type |
|---|---|
| title, message | String, required |
| createdBy | ObjectId → User |
| createdAt | auto |

---

## 6. Authentication & Roles

- **JWT (Bearer token)** sent in `Authorization: Bearer <token>`.
- Token payload: `{ id, role }` where role ∈ `team | judge | admin`.
- Passwords hashed with `bcryptjs` (10 salt rounds).
- `auth.middleware` → verifies token, loads `req.user` (`{ id, role }`).
- `role.middleware(...roles)` → 403 if role not allowed.
- Admin is created through `npm run seed:admin` (reads `.env`). Judges are created by the admin through the API.

---

## 7. API Endpoints

Base URL: `http://localhost:5000/api`
Standard response shape: `{ "success": true|false, "message": "...", "data": {...} }`

### 7.1 Public
| Method | Route | Description |
|---|---|---|
| GET | `/health` | Server check |
| GET | `/competition` | Competition details for landing page *(Redis cached)* |

### 7.2 Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/team/register` | Public (only if `registrationOpen`) | Register team + members, returns token |
| POST | `/auth/team/login` | Public | Team login |
| POST | `/auth/staff/login` | Public | Admin / Judge login |
| GET | `/auth/me` | Any logged-in | Current account |

### 7.3 Team (Dashboard)
| Method | Route | Description |
|---|---|---|
| GET | `/team/me` | Registration details + submission status |
| GET | `/announcements` | Competition updates *(any logged-in role; Redis cached)* |

### 7.4 Design Submission (Team)
| Method | Route | Description |
|---|---|---|
| POST | `/submissions` | Upload design (`multipart/form-data`). Allowed only if `submissionOpen` and before deadline. One per team (409 if already submitted) |
| GET | `/submissions/me` | Team's own submission |

### 7.5 Judge
| Method | Route | Description |
|---|---|---|
| GET | `/judge/submissions` | All submissions (team name, time, whether this judge already reviewed) |
| GET | `/judge/submissions/:id` | Submission details + files |
| POST | `/judge/submissions/:id/review` | Create/update review `{ score, feedback }` |
| GET | `/judge/reviews` | Reviews given by this judge |

### 7.6 Admin
| Method | Route | Description |
|---|---|---|
| PUT | `/admin/competition` | Update competition details / open-close registration & submission |
| GET | `/admin/teams` | List teams (`?page=&limit=&search=`) |
| GET | `/admin/teams/:id` | Team details + its submission |
| DELETE | `/admin/teams/:id` | Remove a team (and its submission + reviews) |
| POST | `/admin/judges` | Create judge account |
| GET | `/admin/judges` | List judges |
| GET | `/admin/submissions` | All submissions with team name, submission time, average score |
| GET | `/admin/submissions/:id` | Submission + all judge reviews |
| POST | `/admin/announcements` | Post announcement |
| DELETE | `/admin/announcements/:id` | Delete announcement |

### 7.7 Static files
`GET /uploads/<filename>` → serves uploaded designs (`express.static` in `app.js`).

---

## 8. Key Business Rules

1. **Registration**: blocked if `registrationOpen=false` or past deadline; duplicate `teamName`/`leaderEmail` → 409; members count must be within `MIN/MAX_TEAM_SIZE`.
2. **Submission**: blocked unless `submissionOpen=true` and before `submissionDeadline`; one submission per team; `team`, `teamName`, `submittedAt` are set by the server (never from request body).
3. **Upload limits**: only image/PDF types (png, jpg, jpeg, webp, pdf), size ≤ `MAX_FILE_SIZE_MB`, count ≤ `MAX_FILES_PER_SUBMISSION`.
4. **Review**: only judges; score must be 0–100; feedback required; a judge posting again on the same submission updates their review.
5. **Teams cannot see scores/feedback** (no team-facing review endpoint).
6. **Redis**: caches `GET /competition` and `GET /announcements`; cache is cleared when admin updates them. If Redis is down the API still works (falls back to MongoDB).

---

## 9. Implementation Phases (build in this order)

**Phase 1 – Setup**
1. `npm init`, install packages, add scripts.
2. `config/env.js`, `config/db.js`, `config/redis.js`.
3. `app.js` (json parser, cors, `/uploads` static, `/api` routes, error middlewares) and `server.js` (connect DB + Redis, listen).
4. `docker-compose.yml` with `mongo` and `redis` services.
5. Utilities: `ApiError`, `asyncHandler`, `apiResponse`, `generateToken`.
6. Test: `GET /api/health`.

**Phase 2 – Competition & Admin seed**
1. `Competition` + `User` models.
2. `utils/seedAdmin.js`.
3. `competition.controller` + route (`GET /competition`), `cache.service`.

**Phase 3 – Auth & Team Registration**
1. `Team` model, `auth.service`, `auth.controller`, `auth.middleware`, `role.middleware`, `validate.middleware`.
2. `competitionWindow.middleware` (registration check).
3. Routes: register, login, staff login, me.
4. `team.controller` → `GET /team/me`.

**Phase 4 – Announcements**
1. `Announcement` model, controller, routes (read for all roles, create/delete for admin).

**Phase 5 – Design Submission**
1. `Submission` model, `upload.middleware` (multer), `submission.service/controller`.
2. Routes: `POST /submissions`, `GET /submissions/me`.

**Phase 6 – Judging & Review**
1. `Review` model, `review.service/controller`, `judge.routes`.
2. Admin: create/list judges.

**Phase 7 – Admin Panel APIs**
1. Admin controller + routes: competition update, teams list/detail/delete, submissions list/detail (with average score), judges, announcements.

**Phase 8 – Hardening**
1. Global error handler (Mongoose duplicate key, validation, JWT, Multer errors → clean JSON).
2. Final Postman run (Section 10), update `README.md` with run instructions.

---

## 10. Testing Everything in Postman

### 10.1 Run the backend
```bash
# from project root
docker compose up -d          # starts MongoDB + Redis
cd Backend
npm run seed:admin            # creates admin from .env (run once)
npm run dev                   # server on http://localhost:5000
```

### 10.2 Postman setup
1. Create a **Collection**: `Pixel Patakha API`.
2. Create an **Environment**: `Pixel Patakha Local` with variables:

| Variable | Initial value |
|---|---|
| `baseUrl` | `http://localhost:5000/api` |
| `adminToken` | *(empty)* |
| `judgeToken` | *(empty)* |
| `teamToken` | *(empty)* |
| `teamId`, `submissionId` | *(empty)* |

3. For protected requests: **Authorization tab → Bearer Token →** `{{adminToken}}` / `{{judgeToken}}` / `{{teamToken}}`.
4. Auto-save tokens: in the **Tests** tab of each login request add (change variable name per request):
```js
const res = pm.response.json();
pm.environment.set("teamToken", res.data.token);
```

### 10.3 Test flow (run in this order)

**Step 1 – Health & public**
| # | Request | Expected |
|---|---|---|
| 1 | `GET {{baseUrl}}/health` | 200 |
| 2 | `GET {{baseUrl}}/competition` | 200, competition details (call twice – second should come from Redis) |

**Step 2 – Admin login & setup**
| # | Request | Body | Expected |
|---|---|---|---|
| 3 | `POST {{baseUrl}}/auth/staff/login` | `{"email":"admin@pixelpatakha.com","password":"Admin@12345"}` | 200 + token → save as `adminToken` |
| 4 | `PUT {{baseUrl}}/admin/competition` (Bearer admin) | `{"name":"PIXEL PATAKHA","registrationOpen":true,"submissionOpen":false}` | 200 |
| 5 | `POST {{baseUrl}}/admin/judges` (Bearer admin) | `{"name":"Judge One","email":"judge1@test.com","password":"Judge@123"}` | 201 |
| 6 | `POST {{baseUrl}}/admin/announcements` (Bearer admin) | `{"title":"Welcome","message":"Registrations are open!"}` | 201 |

**Step 3 – Team registration & dashboard**
| # | Request | Body | Expected |
|---|---|---|---|
| 7 | `POST {{baseUrl}}/auth/team/register` | see below | 201 + token → save as `teamToken` |
| 8 | Same request again | same body | **409** duplicate team |
| 9 | `POST {{baseUrl}}/auth/team/login` | `{"email":"leader@test.com","password":"Team@123"}` | 200 |
| 10 | `GET {{baseUrl}}/team/me` (Bearer team) | – | 200, team + members, `submission: null` |
| 11 | `GET {{baseUrl}}/announcements` (Bearer team) | – | 200, announcement list |

Register body (raw → JSON):
```json
{
  "teamName": "Pixel Pirates",
  "leaderEmail": "leader@test.com",
  "password": "Team@123",
  "college": "ABC College",
  "members": [
    { "name": "Leader One", "email": "leader@test.com", "phone": "9876543210" },
    { "name": "Member Two", "email": "m2@test.com", "phone": "9876543211" }
  ]
}
```

**Step 4 – Submission (negative then positive)**
| # | Request | Expected |
|---|---|---|
| 12 | `POST {{baseUrl}}/submissions` (Bearer team) while `submissionOpen=false` | **403** submissions closed |
| 13 | `PUT {{baseUrl}}/admin/competition` (Bearer admin) → `{"submissionOpen":true}` | 200 |
| 14 | `POST {{baseUrl}}/submissions` (Bearer team) – **Body → form-data**: `title` (Text), `description` (Text), `designs` (**File**, pick a png/jpg/pdf; can add multiple `designs` rows) | 201, save `data._id` as `submissionId` |
| 15 | Same request again | **409** already submitted |
| 16 | Upload a `.exe` / file larger than limit | **400** invalid file |
| 17 | `GET {{baseUrl}}/submissions/me` (Bearer team) | 200 |
| 18 | Open a returned file `url` in browser (`http://localhost:5000/uploads/<filename>`) | file loads |

**Step 5 – Judging**
| # | Request | Body | Expected |
|---|---|---|---|
| 19 | `POST {{baseUrl}}/auth/staff/login` | `{"email":"judge1@test.com","password":"Judge@123"}` | 200 → save as `judgeToken` |
| 20 | `GET {{baseUrl}}/judge/submissions` (Bearer judge) | – | 200, team name + submitted time |
| 21 | `GET {{baseUrl}}/judge/submissions/{{submissionId}}` | – | 200, files included |
| 22 | `POST {{baseUrl}}/judge/submissions/{{submissionId}}/review` | `{"score":85,"feedback":"Great UX flow"}` | 201 |
| 23 | Same request with `{"score":90,"feedback":"Updated"}` | – | 200 (updated, not duplicated) |
| 24 | Same request with `{"score":150,"feedback":"x"}` | – | **400** invalid score |
| 25 | `GET {{baseUrl}}/judge/reviews` | – | 200 |

**Step 6 – Admin panel**
| # | Request (Bearer admin) | Expected |
|---|---|---|
| 26 | `GET {{baseUrl}}/admin/teams?page=1&limit=10&search=pixel` | 200, paginated |
| 27 | `GET {{baseUrl}}/admin/teams/{{teamId}}` | 200, team + submission |
| 28 | `GET {{baseUrl}}/admin/submissions` | 200, team name, submission time, average score |
| 29 | `GET {{baseUrl}}/admin/submissions/{{submissionId}}` | 200, all judge reviews |
| 30 | `GET {{baseUrl}}/admin/judges` | 200 |
| 31 | `DELETE {{baseUrl}}/admin/announcements/:id` | 200 |
| 32 | `DELETE {{baseUrl}}/admin/teams/{{teamId}}` | 200 (run last) |

**Step 7 – Security checks (all must fail correctly)**
| Request | Expected |
|---|---|
| Any protected route with no token | **401** |
| `GET /admin/teams` with `teamToken` | **403** |
| `POST /judge/.../review` with `teamToken` | **403** |
| `POST /submissions` with `judgeToken` | **403** |
| Register with `MAX_TEAM_SIZE + 1` members | **400** |
| Register after setting `registrationOpen:false` | **403** |
| Login with wrong password | **401** |

### 10.4 Optional: Postman automated run
Add a `pm.test` in each request's Tests tab, e.g.
```js
pm.test("Status is 200", () => pm.response.to.have.status(200));
```
then use **Collection → Run** to execute the whole flow in order.

---

## 11. Assumptions to Confirm (not specified in the brief)

These are the minimum decisions needed to make the backend work; change them if your rules differ.
1. Team size limit is configurable via `MIN_TEAM_SIZE` / `MAX_TEAM_SIZE` (default 1–4).
2. Member info = name, email, phone; team info = team name, college.
3. One submission per team, no re-upload after submitting.
4. A single score (0–100) + text feedback per judge; all judges can see all submissions.
5. Files are stored on local disk in `Backend/uploads/` (can be swapped for cloud storage later inside `upload.middleware.js` / `submission.service.js`).
6. Admin account is seeded from `.env`; judges are created by the admin.