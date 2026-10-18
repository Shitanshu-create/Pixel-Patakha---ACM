# PIXEL PATAKHA – Sightengine AI-Image Detection: Implementation Plan

Repo analysed: `Shitanshu-create/Pixel-Patakha---ACM` @ `0147099` ("frontend fixes").
Scope: add AI-generated-image detection to the **existing** MERN code, following the current folder architecture (`Backend/{config,controllers,middlewares,models,routes,services,utils}`, `Frontend/src/{components/ui,features/{admin,judge,team,common}}`). No new top-level folders.

---

## 1. Your Requirements → How They Are Met

| # | Requirement | Design decision |
|---|---|---|
| 1 | API called **only after the design is submitted** | Sightengine is called **only from the backend**, **only by a background worker**, **only for files that belong to a Submission document that already exists in MongoDB**. The trigger is placed *after* `Submission.create()` succeeds and *after* the HTTP response is sent. Nothing is called during upload, validation, page views, GET requests or from the browser. |
| 2 | Rate limiting | Three layers: (a) **outbound** limiter that keeps Sightengine calls under the provider limits (1 request/second, daily and monthly operation budgets, back-off on `usage_limit`); (b) **inbound** limiters on the endpoints that can cause scans (`POST /submissions`, admin re-scan); (c) a general API limiter. Details in §6. |
| 3 | Show result as **% AI-generated** | Provider returns `type.ai_generated` (0–1). Stored raw and as an integer **percent** per file, plus a submission-level summary (highest %, average %, level). UI shows e.g. **"AI-generated likelihood: 87%"** with a meter and a Low / Review / High level. |
| 4 | Follow current architecture | New files are listed per folder in §4; existing patterns reused (`asyncHandler`, `ApiError`, `apiResponse`, `cache.service`, `useAsync`, `Badge`, `Card`, tokens in `globals.css`). |
| 5 | No text/summary while fixing | Not applicable to this document; implementation work after approval should produce code only. |

> **Important wording note.** Sightengine's score is the model's **confidence (0–1) that the whole image was produced or edited by a generative AI model**; it is **not** the share of pixels that are AI-made. The UI therefore says **"AI-generated likelihood"** and shows a tooltip explaining this, so judges don't misread 40% as "40% of the design is AI".

---

## 2. Verified Sightengine Facts (checked on sightengine.com today)

| Topic | Fact |
|---|---|
| Endpoint | `POST https://api.sightengine.com/1.0/check.json`, multipart form: `media` (file), `models=genai`, `api_user`, `api_secret` |
| Success response | `status:"success"`, `request.operations` (integer, **5** in the docs example), `type.ai_generated` (0–1), optional `type.ai_generators{ midjourney, flux, dalle, stable_diffusion, gpt, … }` |
| Error response | HTTP 4xx/5xx with `status:"failure"`, `error.type` ∈ `argument_error, credentials_error, media_error, plan_error, request_error, usage_limit, api_error, unknown_error`, plus `error.code`, `error.message` |
| Free plan | **2,000 operations/month, max 500/day, 1 request/second**, no time limit, AI detection included |
| Cost of one AI check | **5 operations** → free plan = **400 checks/month, 100 checks/day** |
| Paid | Starter $29/mo = 10,000 ops (≈2,000 checks), 1 req/s; Pro $99/mo = 40,000 ops, 10 req/s |
| Billing detail | Only successful responses count against the quota |
| Analysis method | Pixel-only; **metadata/EXIF/C2PA ignored**. Docs warn confidence may drop on screenshots with a lot of UI chrome (relevant for UI/UX designs) |
| Free-plan overflow | Calls simply stop working (no charge) – handled via the `usage_limit` error |

Pricing and limits can change; the worker uses the **actual** `request.operations` value from each response, not a hard-coded 5.

---

## 3. Architecture & Flow

```
Team ──POST /api/submissions (multipart)──► checkSubmissionOpen ► submissionLimiter ► multer ► controller
                                                                                   │
                                   Submission.create()  (files[].aiDetection.status = "pending" | "skipped")
                                                                                   │
                              HTTP 201 sent to the team  ◄──────────────────────────┤
                                                                                   ▼
                                           aiDetectionService.enqueue(submissionId)      (fire-and-forget, errors only logged)
                                                                                   │
                                                          ┌────────────────────────┴───────────────┐
                                                          │ worker loop (1 job at a time)           │
                                                          │  1. rate gate (outbound): 1 req/s       │
                                                          │     + daily/month ops budget (Redis)    │
                                                          │  2. atomically claim ONE pending file   │
                                                          │  3. read file from /uploads, POST to    │
                                                          │     Sightengine (models=genai)          │
                                                          │  4. save score/percent/level/generators │
                                                          │  5. recompute submission summary        │
                                                          └────────────────────────┬───────────────┘
                                                                                   ▼
          Admin / Judge screens read aiDetection fields (poll while pending) ◄── MongoDB
          Team screens never receive aiDetection fields
```

**Why a worker and not "call inside the request":** the team's upload must stay fast and never fail because a third party is slow or out of quota; the 1 req/s limit and the 100-checks/day budget make queuing mandatory.

**Crash safety:** MongoDB is the source of truth (`status: pending`). On server start and every 60 s a **sweep** re-queues `pending` files and "un-sticks" `processing` files older than 5 minutes, so a restart never loses scans and never double-bills (the claim step is atomic).

---

## 4. Files to Add / Change

### 4.1 Backend

| File | Action | Purpose |
|---|---|---|
| `Backend/config/env.js` | change | Export Sightengine + limiter settings (§5) |
| `Backend/models/Submission.model.js` | change | Add `aiDetection` subdocument to each file + `aiDetectionSummary` on the submission + sweep index |
| `Backend/services/sightengine.service.js` | **new** | Thin HTTP client: builds multipart request (native `fetch`, `FormData`, `Blob`; **no new dependency**), 30 s timeout, parses response/errors into a typed result (`ok`, `usageLimit`, `retryable`, `fatal`, `credentials`) |
| `Backend/services/aiDetection.service.js` | **new** | Orchestration: `enqueue()`, worker loop, atomic claim, retry/back-off, circuit breaker, summary computation, `rerunSubmission()`, `getStatus()`, `start()/stop()` |
| `Backend/services/aiBudget.service.js` | **new** | Outbound rate gate: min-interval (1 req/s), daily + monthly operation counters in Redis with in-memory fallback; `canSpend()`, `record(operations)`, `usage()` |
| `Backend/services/cache.service.js` | change | Add `incrBy(key, amount, ttl)` helper (same fail-open style as `get/set/del`) |
| `Backend/utils/aiScore.js` | **new** | `toPercent(score)`, `levelFromPercent(percent)`, `topGenerator(generators)` (single source of the thresholds) |
| `Backend/middlewares/rateLimit.middleware.js` | **new** | `apiLimiter`, `submissionLimiter`, `aiRecheckLimiter` built with `express-rate-limit` (+ `rate-limit-redis` store when Redis is ready, memory store otherwise); JSON 429 in the project's `{success,message}` format with `Retry-After` |
| `Backend/controllers/aiDetection.controller.js` | **new** | `rerunSubmissionScan`, `getAiDetectionStatus` (admin only) |
| `Backend/controllers/submission.controller.js` | change | After the 201 response (L42) call `aiDetectionService.enqueue(submission._id)` inside a `.catch(log)`; **strip `aiDetection*` fields from what is returned to the team** |
| `Backend/services/submission.service.js` | change | In `createSubmission` (L32–38) initialise `aiDetection` per file (`pending` for PNG/JPG/WEBP, `skipped` for PDF) and the summary; strip AI fields in `getMySubmission`; keep them in `getJudgeSubmissions`, `getAdminSubmissions`, `getAdminSubmissionWithReviews`, `getSubmissionById` |
| `Backend/services/team.service.js` | change | `getTeamDashboard` (L18): exclude AI fields from the submission shown to the team; `getTeamDetails` (admin) keeps them |
| `Backend/routes/admin.routes.js` | change | `POST /admin/submissions/:id/ai-check`, `GET /admin/ai-detection/status` |
| `Backend/routes/submission.routes.js` | change | Add `submissionLimiter` before `upload.array` on `POST /` (L13) |
| `Backend/routes/index.js` | change | Mount `apiLimiter` on `/api` |
| `Backend/server.js` | change | After DB + Redis connect call `aiDetectionService.start()`; in `shutdown` call `stop()` |
| `Backend/package.json` | change | Add `express-rate-limit`, `rate-limit-redis` |

### 4.2 Frontend

| File | Action | Purpose |
|---|---|---|
| `Frontend/src/components/ui/AiScoreMeter.jsx` + `AiScoreMeter.css` | **new** | Percent meter bar + number, coloured by level via existing tokens (`--color-success-green` / `--color-arcade-yellow` / `--color-pixel-pink`); no new hex values |
| `Frontend/src/components/ui/AiScoreBadge.jsx` | **new** | Compact badge: `AI 87% · HIGH`, or status text (`Queued`, `Scanning…`, `Not scanned`, `Failed`) using the existing `Badge` tones |
| `Frontend/src/features/common/utils/aiDetection.js` | **new** | `levelToTone`, `formatPercent`, `statusLabel`, `summaryText` (no thresholds here – backend sends `level`) |
| `Frontend/src/features/common/hooks/useInterval.js` | **new** | Visibility-aware polling helper |
| `Frontend/src/features/admin/components/AiScanCard.jsx` | **new** | Card for the admin detail page: overall %, per-file table, last checked, **Re-run scan** button (confirm dialog) |
| `Frontend/src/features/admin/components/AiBudgetCard.jsx` | **new** | Admin overview widget: today / month usage, queue length, worker state |
| `Frontend/src/features/admin/api/adminApi.js` | change | `rerunAiCheck(id)`, `getAiDetectionStatus()` |
| `Frontend/src/features/admin/pages/SubmissionsPage.jsx` | change | New **AI Likelihood** column, sort option "AI %", filter "High only"; poll while any scan is pending |
| `Frontend/src/features/admin/pages/SubmissionDetailPage.jsx` | change | Render `AiScanCard`; poll while pending |
| `Frontend/src/features/admin/pages/AdminOverviewPage.jsx` | change | Render `AiBudgetCard` |
| `Frontend/src/features/judge/components/FilePreviewGrid.jsx` | change | Per-file `AiScoreBadge` under each preview (grid is also used by the admin page) |
| `Frontend/src/features/judge/components/JudgeSubmissionCard.jsx` | change | Small `AiScoreBadge` for the submission summary |
| `Frontend/src/features/judge/pages/JudgeReviewPage.jsx` | change | Summary card above the file grid with the disclaimer text |
| `Frontend/src/features/team/components/SubmissionForm.jsx` | change | One-line transparency notice (wording needs organiser approval, see D5) |
| `Frontend/src/features/admin/styles/admin.css`, `features/judge/styles/judge.css` | change | Layout classes only, tokens only |

---

## 5. Data Model & Configuration

### 5.1 `Submission.model.js`

Add to `submissionFileSchema` (each file):

```js
aiDetection: {
  provider:     { type: String, default: 'sightengine' },
  status:       { type: String, enum: ['pending','processing','done','skipped','failed'], default: 'pending', index: false },
  score:        { type: Number, min: 0, max: 1 },        // raw ai_generated
  percent:      { type: Number, min: 0, max: 100 },      // Math.round(score * 100)
  level:        { type: String, enum: ['low','review','high'] },
  topGenerator: { name: String, percent: Number },       // from type.ai_generators
  operations:   Number,                                  // request.operations actually billed
  requestId:    String,
  attempts:     { type: Number, default: 0 },
  nextAttemptAt: Date,
  startedAt:    Date,
  checkedAt:    Date,
  reason:       String                                   // e.g. "pdf_not_supported", "file_missing", "media_error: …"
}
```

Add to the submission:

```js
aiDetectionSummary: {
  status:       { type: String, enum: ['pending','partial','done','skipped','failed'], default: 'pending' },
  maxPercent:   Number,      // headline number = highest file
  avgPercent:   Number,
  level:        { type: String, enum: ['low','review','high'] },   // level of maxPercent
  scannedFiles: Number,
  totalFiles:   Number,
  checkedAt:    Date
}
```

Index for the sweep: `submissionSchema.index({ 'files.aiDetection.status': 1, submittedAt: 1 })`.
Existing submissions (created before this feature) have no `aiDetection` → treated as `not scanned`; admin can trigger **Re-run scan** (budget permitting).

### 5.2 Root `.env` additions (single shared file, backend-only variables)

```env
# AI image detection (Sightengine) – backend only, never prefix with VITE_
AI_DETECTION_ENABLED=true
SIGHTENGINE_API_USER=
SIGHTENGINE_API_SECRET=
SIGHTENGINE_API_URL=https://api.sightengine.com/1.0/check.json

# Outbound rate limiting (free plan values)
SIGHTENGINE_MIN_INTERVAL_MS=1100        # ≥ 1 request / second
SIGHTENGINE_DAILY_OPS_LIMIT=450         # provider cap is 500; keep a safety margin
SIGHTENGINE_MONTHLY_OPS_LIMIT=1900      # provider cap is 2000
SIGHTENGINE_OPS_PER_CHECK=5             # used for planning only; real value read from each response
SIGHTENGINE_TIMEOUT_MS=30000
SIGHTENGINE_MAX_ATTEMPTS=3
AI_MAX_FILES_PER_SUBMISSION=5           # images scanned per team (PDFs are skipped)

# Level thresholds (percent) – calibrate before the event
AI_LEVEL_REVIEW_MIN=30
AI_LEVEL_HIGH_MIN=70

# Inbound rate limiting
RATE_LIMIT_API_PER_5MIN=300
RATE_LIMIT_SUBMIT_PER_10MIN=10
RATE_LIMIT_RECHECK_PER_MIN=5
```
`config/env.js`: export typed values (`parseInt`, booleans). If `AI_DETECTION_ENABLED=false` **or** keys are missing, the feature is **off**: files are saved with `status:"skipped"`, `reason:"not_configured"`, the server starts normally, and the admin card says "AI scan not configured". The secret is never logged or returned by any endpoint.

---

## 6. Rate Limiting (detailed)

### 6.1 Outbound (protects the Sightengine quota)

| Rule | Implementation |
|---|---|
| ≤ 1 request/second | Single worker, concurrency 1, `aiBudget.waitTurn()` enforces `SIGHTENGINE_MIN_INTERVAL_MS` between calls (last-call timestamp in Redis key `ai:last`, memory fallback) |
| Daily budget | Redis counter `ai:ops:day:YYYYMMDD` (TTL 48 h) incremented by the **actual** `request.operations` of each response; `canSpend()` is checked **before** each call using `SIGHTENGINE_OPS_PER_CHECK`; when exhausted the file stays `pending` and the worker sleeps until the next sweep |
| Monthly budget | Counter `ai:ops:month:YYYYMM` (TTL 40 days), same logic |
| Provider-side refusal | Error `usage_limit` → **do not** count an attempt, set a pause (`ai:pause_until` = now + 1 h), keep file `pending` |
| Transient errors (network, timeout, 5xx, `api_error`) | Retry with back-off 30 s → 2 min → 10 min, max `SIGHTENGINE_MAX_ATTEMPTS`; then `failed` with `reason` |
| Permanent errors (`media_error`, `argument_error`, `request_error`) | No retry → `failed` + reason |
| `credentials_error` / `plan_error` | **Circuit breaker**: stop the worker, log once at `error` level, show "AI scan paused – check API keys/plan" on the admin card; resumes after admin fixes `.env` and restarts or presses **Re-run** |
| Fairness under low budget | Sweep ordering: **first image of every submission first**, then 2nd images, etc., oldest submission first → every team gets at least one scan before anyone gets extras |
| Redis down | Falls back to in-memory counters (still safe for one server; counters reset on restart – the provider's own `usage_limit` remains the final guard) |

### 6.2 Inbound (protects your API)

| Limiter | Applies to | Default | Key |
|---|---|---|---|
| `apiLimiter` | all `/api/*` | 300 / 5 min | IP |
| `submissionLimiter` | `POST /api/submissions` | 10 / 10 min | team id (falls back to IP) |
| `aiRecheckLimiter` | `POST /api/admin/submissions/:id/ai-check` | 5 / min | admin id |

429 response: `{ "success": false, "message": "Too many requests. Try again in N seconds." }` + `Retry-After` header. The frontend `axiosClient` already unwraps `message`; the toast shows it. Use the Redis store when `redisClient.status === 'ready'`, else the default memory store. Set `app.set('trust proxy', 1)` in production so the IP key is the real client IP.

### 6.3 Capacity planning (free plan, 5 ops per check)

| Event size | Images scanned | Ops needed | Fits free plan? |
|---|---|---|---|
| 30 teams × 2 images | 60 | 300 | Yes (≤ 100 checks/day) |
| 60 teams × 3 images | 180 | 900 | Yes over 2 days (100/day cap), within 400/month |
| 100 teams × 5 images | 500 | 2,500 | **No** (> 400 checks/month) → set `AI_MAX_FILES_PER_SUBMISSION=1–2` or use Starter (≈ 2,000 checks/month) |
| Calibration (20 human + 20 AI UI screens) | 40 | 200 | Uses ~½ of one day's budget – do it days before the event |

Formula: `checks_needed = Σ images_per_team (≤ AI_MAX_FILES_PER_SUBMISSION)`; compare with `floor(daily_limit / 5)` per day and `floor(monthly_limit / 5)` per month. The admin **AI Budget card** shows live usage so you can react during the event.

---

## 7. Backend Behaviour (step by step)

1. **Submission created** (`submission.service.createSubmission`): for each file: image types → `aiDetection.status='pending'` (only the first `AI_MAX_FILES_PER_SUBMISSION` images; extra images `skipped`, `reason:"over_file_limit"`); PDFs → `skipped`, `reason:"pdf_not_supported"`; feature disabled → `skipped`, `reason:"not_configured"`. Summary status computed (`pending`, or `skipped` if nothing to scan).
2. **Controller** sends 201 first, then `aiDetectionService.enqueue(id)` (wrapped in `try/catch`, never throws into the request). Returned body to the team has all AI fields removed.
3. **Worker `tick()`** (runs on enqueue, then every 2 s while work exists, and from the 60 s sweep):
   1. Stop if circuit open, paused (`ai:pause_until`), or budget exhausted.
   2. `waitTurn()` (1 req/s).
   3. **Pick and atomically claim one file**: the sweep query lists candidate files (`status:'pending'` and `nextAttemptAt` empty or ≤ now) ordered by *file index ascending, then `submittedAt` ascending* (the fairness rule in §6.1). The worker claims the first candidate with
      `Submission.updateOne({ _id, files: { $elemMatch: { filename, 'aiDetection.status': 'pending' } } }, { $set: { 'files.$.aiDetection.status': 'processing', 'files.$.aiDetection.startedAt': now }, $inc: { 'files.$.aiDetection.attempts': 1 } })`
      and proceeds **only if `modifiedCount === 1`** (otherwise another worker/instance took it, so it moves to the next candidate).
   4. Read `Backend/uploads/<filename>`; missing file → `skipped`, `reason:"file_missing"` (e.g. team deleted).
   5. `sightengine.service.check(buffer, mimeType, originalName)`.
   6. Success → save `score`, `percent`, `level`, `topGenerator`, `operations`, `requestId`, `checkedAt`, `status:'done'`; add `operations` to the counters.
   7. Failure → apply the §6.1 table.
   8. Recompute `aiDetectionSummary` (max %, avg %, level of max, counts, status `partial` while some files are pending).
4. **Recovery**: `start()` runs one sweep immediately and every 60 s; reclaims `processing` older than 5 min; `stop()` clears the timer and lets the current call finish.
5. **Admin re-run** (`POST /admin/submissions/:id/ai-check`): resets files in `failed`, `pending`, or **never scanned** to `pending` (never touches `done` unless body `{ "force": true }`), then `enqueue()`. Still goes through the same budget gate, so it can't overspend. Returns the updated summary. Limited by `aiRecheckLimiter`.
6. **Status** (`GET /admin/ai-detection/status`): `{ enabled, circuit: "closed|open", pausedUntil, usage: { day:{used,limit}, month:{used,limit} }, queue: { pending, processing, failed }, thresholds: { reviewMin, highMin } }`.

**Role visibility of the new fields**

| Role | Sees `aiDetection` / `aiDetectionSummary` |
|---|---|
| Admin | Yes (list, detail, team detail) |
| Judge | Yes (list, detail) – default, see D1 |
| Team | **Never** (stripped in `createSubmission` response, `getMySubmission`, `getTeamDashboard`) |

---

## 8. API Contract (what the frontend receives)

`GET /api/admin/submissions` (each item) and `GET /api/judge/submissions`:

```json
{
  "_id": "…",
  "teamName": "Pixel Pirates",
  "files": [
    {
      "originalName": "home.png", "url": "…", "mimeType": "image/png", "size": 482113,
      "aiDetection": {
        "status": "done", "percent": 87, "level": "high",
        "topGenerator": { "name": "midjourney", "percent": 92 },
        "checkedAt": "2026-10-22T06:41:09.000Z"
      }
    },
    { "originalName": "flow.pdf", "aiDetection": { "status": "skipped", "reason": "pdf_not_supported" } }
  ],
  "aiDetectionSummary": {
    "status": "done", "maxPercent": 87, "avgPercent": 87, "level": "high",
    "scannedFiles": 1, "totalFiles": 2, "checkedAt": "2026-10-22T06:41:09.000Z"
  }
}
```
Raw `score`, `requestId`, `attempts`, provider error text stay in the DB; only fields needed by the UI are returned (use a `toPublicAi()` mapper in `aiDetection.service.js`).

New endpoints: `POST /api/admin/submissions/:id/ai-check` → `200 { success, message, data: aiDetectionSummary }`; `GET /api/admin/ai-detection/status` → `200 { success, data: { … } }`.

---

## 9. Frontend Behaviour

**Display rules**

| Backend state | Shown as |
|---|---|
| `done` | `AiScoreMeter` with **"87%"**, level chip: Low (green tone) / Review (yellow) / High (pink); tooltip: "Model confidence that this image is AI-generated. It is not the share of the design made with AI. Use as a flag for manual review." |
| `pending` / `processing` | Muted badge "Scan queued…" / "Scanning…" (auto-refresh) |
| `skipped` + `pdf_not_supported` | Muted "Not scanned (PDF)" |
| `skipped` + `not_configured` / `over_file_limit` | Muted "Not scanned" with reason in title text |
| `failed` | Pink "Scan failed" + (admin only) **Re-run scan** |
| Submission summary | Headline = **highest file %** ("Highest: 87% · 1 of 2 files scanned"), average in small text |

- Admin **Submissions** page: new column, sortable by AI %, filter chip "High only". Rows whose summary is not final are refreshed every 10 s with `useInterval` (paused when the tab is hidden, stops when nothing is pending).
- Admin **Submission detail**: `AiScanCard` (overall meter, per-file rows with % and likely generator when level ≥ review, last checked, **Re-run scan**). Re-run opens the existing `Modal`/confirm pattern and surfaces 429/usage messages via the toast.
- **Judge** pages: badge on cards, summary card above the files with the disclaimer, per-file badges in `FilePreviewGrid`. Judges' score form is unchanged and **never auto-influenced** by the AI value.
- **Team** pages: no AI data. `SubmissionForm` shows the approved transparency sentence (D5).
- **Styling**: only existing tokens; meter uses `--color-success-green`, `--color-arcade-yellow`, `--color-pixel-pink`, track `--color-panel-border`; works at 360 px (meter stacks under the filename), keyboard-focusable tooltip, text label always accompanies colour (accessibility rule from `design.md`).

---

## 10. Implementation Phases

| Phase | Work | Output / done when |
|---|---|---|
| **A – Config & schema** (S) | `env.js`, `.env` keys, `Submission.model.js` fields + index, `utils/aiScore.js` | Server boots with the feature on/off; new submissions get `aiDetection` defaults |
| **B – Client & budget** (M) | `sightengine.service.js`, `aiBudget.service.js`, `cache.service.incrBy` | Unit-testable functions: parse success/error, spend/refuse by budget, 1 req/s gate |
| **C – Worker & trigger** (M) | `aiDetection.service.js` (enqueue, claim, retry, summary, sweep, circuit breaker), controller trigger after 201, `server.js` start/stop | A real submission moves `pending → processing → done` with a percent saved; restart mid-scan recovers |
| **D – Inbound limiters & admin endpoints** (S) | `rateLimit.middleware.js`, routes, `aiDetection.controller.js` | 429 behaviour verified; re-run and status endpoints work |
| **E – Role-safe exposure** (S) | Strip AI fields for team responses; include for admin/judge | Team API responses contain no `aiDetection*` keys |
| **F – Frontend** (M) | UI components, utils, hook, pages listed in §4.2 | Percent shown in admin list/detail and judge pages; polling works; responsive |
| **G – Tests & calibration** (M) | Backend tests with mocked `fetch`; Postman run (§11); calibration with known samples; adjust `AI_LEVEL_*` | Threshold values agreed; no false "High" on your known-human UI set |
| **H – Docs** (S) | README: new env keys, quota math, how to disable; note privacy | Matches the code |

Order: A → B → C → D → E → F → G → H (E can run in parallel with F).

---

## 11. Testing (Postman + checks)

Setup: add the keys to the root `.env` (or point `SIGHTENGINE_API_URL` to a local mock server returning `{"status":"success","request":{"operations":5},"type":{"ai_generated":0.87}}` so no quota is spent), run backend, seed admin, create a judge, open submissions as admin.

| # | Request | Expected |
|---|---|---|
| 1 | Team `POST /submissions` (form-data: title, `designs` = 1 PNG) | **201 immediately**; body has **no** `aiDetection*` fields |
| 2 | Admin `GET /admin/submissions` right after | file shows `status: pending|processing`; after ~2–3 s `done` with `percent` |
| 3 | Team `GET /submissions/me` and `GET /team/me` | No AI fields anywhere |
| 4 | Judge `GET /judge/submissions` and `/:id` | AI fields present |
| 5 | Upload PNG + PDF | PNG scanned, PDF `skipped` / `pdf_not_supported` |
| 6 | Submission rejected (no title / window closed / duplicate 409) | **No** Sightengine call made (check server log/mock hit counter) |
| 7 | 11 × `POST /submissions` within 10 min with the same team | 11th returns **429** + `Retry-After` |
| 8 | Admin `POST /admin/submissions/:id/ai-check` 6× in a minute | 6th returns **429** |
| 9 | Set `SIGHTENGINE_DAILY_OPS_LIMIT=10`, submit 3 teams × 1 image | 2 scanned, 3rd stays `pending` until budget resets; `GET /admin/ai-detection/status` shows 10/10 |
| 10 | Mock returns `usage_limit` | Files remain `pending`, worker pauses ~1 h, no attempt consumed |
| 11 | Mock returns 500 three times | File ends `failed` after 3 attempts with reason; admin **Re-run** requeues |
| 12 | Wrong API secret | Circuit opens, admin card shows "paused – check credentials", team uploads still succeed |
| 13 | Kill server while a file is `processing`, restart | File is reclaimed after 5 min (or immediately if `startedAt` is stale) and finished once |
| 14 | Delete the team while its file is pending | Worker marks file missing / drops it, no crash |
| 15 | Frontend at 360 / 768 / 1024 px | Meter and badges don't overflow; keyboard focus visible on tooltip/re-run |

Automated: unit tests for `aiScore.js`, `sightengine.service.js` (success, each error type, timeout), `aiBudget.service.js` (day/month rollover, gate), claim atomicity (two workers, one file → one call).

**Calibration before the event:** run 20 known-human UI screens + 20 known-AI UI screens (≈ 200 ops) and choose `AI_LEVEL_REVIEW_MIN` / `AI_LEVEL_HIGH_MIN` so human designs stay Low. Docs warn accuracy can drop on screenshots with heavy UI chrome, so expect to tune.

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| False positives on flat UI designs | Level is only a **flag**; wording "likelihood"; never auto-disqualify; calibration step; judges' scoring unaffected |
| Quota exhausted mid-event | Budget gate, fairness ordering, admin budget card, `AI_MAX_FILES_PER_SUBMISSION`, Starter plan option |
| PDFs bypass detection | Explicit "Not scanned (PDF)" badge; optional later phase: rasterise PDF pages (each page costs 5 ops) |
| Third-party outage | Async worker, retries, `failed` state with re-run; submissions never blocked |
| Privacy of unpublished designs | Files are uploaded to Sightengine for analysis → disclose in rules/registration, review Sightengine's data-retention terms |
| API keys leaking | Backend-only env, never `VITE_`, never logged/returned; keys rotated if ever committed |
| Restart loses queue | DB-backed `pending` + startup sweep |
| Multiple server instances | Atomic per-file claim; Redis-based counters shared |
| Existing public `/uploads` | Out of scope here (tracked in the audit plan); the worker reads from disk, not via URL |

---

## 13. Decisions Needed From You

| # | Question | Default if you don't answer |
|---|---|---|
| D1 | Who sees AI results? | Admin **and** judges; never teams |
| D2 | PDFs: skip in v1, or rasterise pages (extra dependency + 5 ops per page)? | Skip in v1 with a clear badge |
| D3 | How many images per team to scan? | Up to 5 (all images); lower it if your team count exceeds the budget table |
| D4 | Level thresholds | Low < 30 %, Review 30–69 %, High ≥ 70 % (to be calibrated) |
| D5 | Transparency sentence shown to teams (e.g. "Submitted designs may be automatically scanned for AI-generated content.") | Show it in the submission form only after organisers approve the text |
| D6 | Stay on the free plan or upgrade (Starter ≈ 2,000 checks/month)? | Free plan; limits configurable in `.env` |
| D7 | Add an admin "cleared / flagged" decision with a note (stored on the submission)? | Not in this scope |