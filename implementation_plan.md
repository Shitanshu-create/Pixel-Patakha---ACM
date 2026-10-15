# PIXEL PATAKHA – Audit Report & Fix / New-Feature Implementation Plan

Repo analysed: `Shitanshu-create/Pixel-Patakha---ACM` @ commit `5db354c` ("added env.js").
Scope: every file in `Backend/` (45 files) and `Frontend/` (≈130 files), plus root config, `docker-compose.yml`, README and git history.

**How this was checked**
- Every source file was read.
- ✔ = **verified by running something** (ESLint, production build, small scripts reproducing the bug).
- Everything else is from reading the code. A MongoDB instance and a browser were not available in the sandbox, so full end-to-end runs were not executed; those items are marked "code review".

---

## 1. Executive Summary

| Severity | Count | Meaning |
|---|---|---|
| Critical | 4 | Feature is broken or unusable right now |
| High | 15 | Will fail or be exploited on competition day |
| Medium | 21 | Wrong behaviour, weak protection, poor UX |
| Low | 10 | Polish, hygiene, docs |
| **Total** | **50** | Numbered findings in §2.1–2.4 (the unconfirmed-content list in §2.5 is extra) |

### Top 10 problems to fix first
1. **Submission page refetches in an endless loop, so the form cannot be used** (`useAsync` + inline function) ✔ — CP-2
2. **Admin "Competition Settings" save throws an error after saving, and the page is unstyled** (`showSuccess` does not exist) — CP-1
3. **Registration success screen is unreachable and would crash** (`navigate` is not defined, route guard redirects first) ✔ — FE-1
4. **Judge-creation modal loses focus after every keystroke** (Modal effect) — FE-3
5. **Redis cache never works** (`lazyConnect` without `connect()`) ✔ — BE-1
6. **No live updates in the competition phase** (no polling; "LIVE FEED" loads once) and **window status is computed from the visitor's clock** — CP-3, CP-4
7. **CORS allows every origin; no rate limiting; default admin credentials; README publishes a sample secret** — SEC-1, SEC-2, SEC-3
8. **Uploaded designs are publicly downloadable and trusted by file extension only** — SEC-4
9. **A wrong submission can never be corrected** (no replace, no admin reset; only "delete team") — CP-8
10. **No real competition phase model** (manual toggles only, duplicate Competition documents possible, no judging/results phase) — CP-5, CP-6, CP-11

### Verification evidence (things actually executed)
| Check | Result |
|---|---|
| `npm run lint` (Frontend) | **23 errors + 3 warnings** (list in FE-7) |
| `vite build` | Passes (it does not detect undefined variables, so errors above ship silently) |
| `useAsync` with an inline function (as in `useMySubmission`), simulated 5 ms response | **81 fetches in 400 ms** vs **1** for a stable function |
| `ioredis` with `lazyConnect:true`, no `connect()` | status stays `wait`; `cache.service` requires `ready` → cache disabled |
| `new RegExp('(')`, `'['` (admin team search) | `SyntaxError` → HTTP 500 |
| `bcrypt.compare({$ne:null}, hash)` (login with object password) | throws → HTTP 500 instead of 401; `notEmpty()` lets the object through |
| First commit `.env` | 0 bytes (no secret leaked in history) |
| `git ls-files Backend/node_modules` | **586 tracked files** |

---

## 2. Findings

### 2.1 Competition-phase bugs (what you reported)

| ID | Sev | Problem | Where | Effect |
|---|---|---|---|---|
| **CP-1** | Critical | `const { showSuccess, showError } = useToast()` – the toast API only exposes `success / error / warning / info`. After the PUT succeeds, `showSuccess(...)` throws `TypeError`, the `catch` calls `showError(...)` which also throws. The page also uses classes that do not exist in any CSS file (`admin-settings-form`, `admin-settings-card`, `admin-grid-2`, `admin-toggle-field`, `admin-field-hint`, `admin-page-container`, `admin-form-actions`, `admin-settings-section-title`) and unsupported props (`Card variant="glass"`, `Button variant="outline"`, `Alert variant="danger"`); `FormField` has no `id`, so labels are not linked. | `CompetitionSettingsPage.jsx` L20, 93, 95, 113, 119, 232; `ToastContext.jsx` L24-29 | Windows are saved in the DB but the admin sees an error/no confirmation, repeats the save, and the page layout is broken. This is the page used to open/close registration and submissions. |
| **CP-2** ✔ | Critical | `useMySubmission` passes a **new inline async function on every render** to `useAsync`; `execute` depends on function identity, so the effect re-runs after every render → endless `GET /submissions/me`. Each cycle flips `loading`, so `SubmissionPage` swaps the form for a spinner repeatedly. | `useMySubmission.js` L5-17, `useAsync.js` L8-31, `SubmissionPage.jsx` L23 | Teams cannot type a title/select files; the backend is hammered (81 requests in 0.4 s in a test with a simulated 5 ms response; with real network latency the rate is lower but still continuous). Fatal on competition day. |
| **CP-3** | High | No polling/refresh anywhere (`grep setInterval` = nothing). The dashboard card says "LIVE FEED" but loads announcements once; submission status loads once. README claims "real-time announcements" and "countdowns" – not implemented. | `AnnouncementsFeed.jsx`, `useCompetition.js` | Teams don't see "Submissions are open" or the problem-statement announcement until they hard-refresh. |
| **CP-4** | High | Window status is computed in the browser (`new Date()` in `windowStatus.js`) once per render and never re-evaluated. While `/competition` is loading **or has failed**, `competition` is `null` and the result is treated as **closed** ("Loading competition status…"). `SubmissionPage` ignores the competition error; `TeamDashboardPage` ignores competition loading; `HeroSection` shows "Registration Closed / Locked" flash or permanently if the API is down. | `windowStatus.js`, `HeroSection.jsx`, `SubmissionPage.jsx`, `TeamDashboardPage.jsx` | Wrong clock on a student laptop = wrong UI. Deadline passes while the page is open → user uploads files, then gets 403. |
| **CP-5** | High | There is no phase model: two manual booleans + deadlines, no start times, no "Start Quest" action. `updateCompetition` does `Object.assign(competition, req.body)` with no validation, so `submissionOpen:true` with a past/empty deadline, a deadline before the event, or an empty `name` are all accepted. The admin must be at the keyboard to flip the toggle at the exact minute (quest start 00:00, final submission 03:00). | `admin.controller.js` L16, `Competition.model.js` | Human error risk on the day; inconsistent windows. |
| **CP-6** | High | `Competition.findOne()` then `create({})` is repeated in 3 places with no unique key. The landing page, register page etc. fire parallel first requests → **duplicate Competition documents** are possible on a fresh DB; admin updates one, middleware reads another. `seedAdmin.js` does **not** create the competition although README says it does. Defaults are generated at first-request time (event date +7 d, registration deadline +5 d, venue "Main Auditorium / Online", rules say "1-4 members"). | `competition.controller.js` L14, `admin.controller.js` L12, `competitionWindow.middleware.js` L6 | Toggles may appear to "not work"; wrong default dates/venue/rules in the live API. |
| **CP-7** | High | Multer saves files **before** the controller validates the title; the 400 (missing title), team-not-found and duplicate-key (race) paths do not delete the saved files. A logged-in team can loop `POST /submissions` with no title and fill the disk (5 × 10 MB per request). | `submission.controller.js` L8-16, `submission.service.js` | Disk exhaustion / orphan files. |
| **CP-8** | High | One submission per team, no replace, no admin "reset submission". The only admin tool is **Delete team**, which destroys the registration and credentials. | `submission.service.js`, `admin.routes.js` | A wrong file = a lost team or manual DB surgery during the event. |
| **CP-9** | High | Upload robustness: no progress bar, no axios timeout, no cancel/retry; previews call `URL.createObjectURL` **during render** (new blob URL every keystroke → flicker + leak); judge/admin pages load full-size originals with no `loading="lazy"`/thumbnails (5 × 10 MB per team × all teams); files live on local disk (lost on most hosts' redeploys); URLs are stored **absolute with the request's Host header** (`${req.protocol}://${host}`) – break after a domain change, are `http://` behind a proxy (mixed-content blocked on HTTPS Netlify) and point to `localhost:3000` for phones on the LAN. | `FileDropzone.jsx` L107-108, `FilePreviewGrid.jsx`, `submission.service.js` L35 | Slow/failed uploads on hotspot Wi-Fi, broken images in production. |
| **CP-10** | Medium | Window is checked only **before** the upload starts. A slow upload that finishes after the deadline is accepted with no stated policy; `submittedAt` is upload-completion time. | `competitionWindow.middleware.js`, `submission.routes.js` L13 | Disputes about on-time submissions. |
| **CP-11** | Medium | Judging has no phase: judges can score while submissions are still open; no "close/lock judging"; no ranking, tie handling, results or winners; average of raw scores is unfair when judges review different subsets; page is called "Leaderboard" but has no rank; unscored shows a pink (warning) "Not Scored" badge; score accepts decimals and string forms (`isNumeric`); UI invents a scoring scale ("50 = Average, 80+ = Exceptional") and criteria ("UX flow, visual hierarchy, original craft") that organisers never approved (design.md forbids this). | `JudgeReviewPage`/`ReviewForm.jsx`, `SubmissionsPage.jsx`, `judge.routes.js` L23 | Unreliable results. |
| **CP-12** | Medium | No mechanism to release the problem statement at 00:00 except a generic announcement (no pin, priority, expiry or attachment). `createdBy` is populated with the admin's **email** and sent to every team. | `announcement.controller.js` L16 | Key announcement can scroll away; admin email exposed. |
| **CP-13** | Medium | Admin cannot see submission status per team in the team list, cannot filter "not submitted", no export (CSV) of teams/submissions/scores, overview has a hard-coded prize pool and no review-progress numbers (README promises them). | `TeamsPage.jsx`, `AdminOverviewPage.jsx` | Slow to chase missing submissions / publish results. |
| **CP-14** | Medium | Team-size rules disagree: frontend `VITE_MAX_TEAM_SIZE=3`, backend default `MAX_TEAM_SIZE=4`, DB default rules text "1-4 members". Duplicate member emails/phones are allowed inside and across teams; team name duplicates ignore case (exact-match query + case-sensitive unique index); no capacity cap; leader email is not verified and **there is no password reset**. | `auth.service.js` L23, `Team.model.js`, `env.js` | Same person in multiple teams; locked-out teams; wrong limits. |
| **CP-15** | Low | Judge queue has no search/sort/pagination; full-page spinner on every refetch. | `JudgeSubmissionsPage.jsx` | Slow with many entries. |

### 2.2 Frontend functional bugs

| ID | Sev | Problem | Where |
|---|---|---|---|
| **FE-1** ✔ | Critical | `TeamRegisterPage` uses `navigate(...)` but never declares it (`useNavigate` imported, not called) → `ReferenceError` if the success screen renders. It never does: `registerTeam` sets the user, `PublicOnlyRoute` immediately redirects to `/team`, so the "Quest Accepted" confirmation (required by design.md) is unreachable. | `TeamRegisterPage.jsx` L2, 97, 192; `PublicOnlyRoute.jsx` |
| **FE-2** ✔ | Critical | `useAsync` design flaws: depends on function identity (CP-2), `execute()` is called inside `useEffect` without `.catch` → "Uncaught (in promise)" on every failed request, no request cancellation → stale responses overwrite new ones (team search), spread dependency list rejected by the React compiler lint. | `useAsync.js` |
| **FE-3** | High | `Modal` effect depends on `[isOpen, onClose]`; callers pass inline `onClose`, so on every parent re-render the effect runs and calls `dialogRef.current.focus()`. In **JudgesPage** each keystroke re-renders → focus leaves the input after one character. No focus trap, no focus restore, no scroll lock, fixed duplicate `id="modal-dialog-title"`. | `Modal.jsx` L15-31 |
| **FE-4** | High | `AuthContext` logs the user out on **any** `/auth/me` failure (network blip, 500, backend restart), deleting the token. `RoleRoute` always redirects to team `/login` (also for admin/judge, no `from` state, no "session expired" toast); logout does not navigate. | `AuthContext.jsx` L31-33, `RoleRoute.jsx` L18, `DashboardLayout.jsx` |
| **FE-5** | High | Sticky navbar likely never sticks: `.app-shell { overflow-x: hidden }` makes an ancestor the scroll container. Anchor links have no `scroll-margin-top`, so sections land under the 68 px navbar. | `App.css` L7, `Navbar.css` |
| **FE-6** | Medium | Styles missing for props used in code: `card--green` (≥5 uses), `btn--outline`, `alert--danger`, Card `variant`. | `Card.css`, `Button.css`, `Alert.css` |
| **FE-7** ✔ | Medium | `npm run lint` fails: **23 errors / 3 warnings** – `no-undef navigate`; unused: `useNavigate`, `Link` (JudgeReviewPage), `refetch` (AnnouncementsFeed), `newSub` (SubmissionPage), `err` (dateInput); `react-hooks/set-state-in-effect` in JudgesPage, TeamDetailPage, SubmissionDetailPage, JudgeReviewPage, ReviewForm, AdminOverviewPage, CompetitionSettingsPage; `react-hooks/use-memo` in useAsync; `react-refresh/only-export-components` in AuthContext/ToastContext; missing effect deps. | many |
| **FE-8** | Medium | Design rule "all values in `globals.css`" broken: `#ffeb60` (`Button.css` L41), `#a384ff` (`Badge.css` L38); raw `9px`/`10px` font sizes. | CSS |
| **FE-9** | Medium | `vite.config.js` proxies to port **3000** while backend default is **5000** (README says 3000). Dev API breaks when `PORT` is unset. | `vite.config.js` L12, 16 |
| **FE-10** | Medium | No React error boundary (any render error = blank page); no request timeout/`AbortController`; Suspense `fullScreen` prop ignored; dashboard flashes "Closed" while competition loads; Teams page resets page before debounced search → double fetch; deleting the last row of a page leaves an empty page. | `App.jsx`, `Spinner.jsx`, `TeamsPage.jsx` |
| **FE-11** | Medium | Landing vs poster/design: logos (`bvcoe`, `DAS`, `ACM`) only in footer, not in the hero as in the poster; `Poster.jpeg` (232 KB) shipped in `public/` but unused; footer ignores `phone`, `whatsappGroup`, `socials` (design.md requires Official Communication Group + socials); extra "Showcase" nav item. | `HeroSection.jsx`, `Footer.jsx`, `eventInfo.js` |
| **FE-12** | Low | Accessibility: settings page labels not linked; `Input` never receives `aria-describedby`; mobile drawer/sidebar have no focus handling/Esc and stay tabbable when off-screen; accordion `aria-controls` points to an id that is not in the DOM when collapsed; error toast uses `role="status"`; register inputs lack `autoComplete`; dropzone Space key scrolls page. | various |
| **FE-13** | Low | Badge colours imply warning for neutral states (`null` score → pink); `MyReviewsPage`/lists hard-code paths instead of `ROUTES`; admin imports a component from the judge feature; `useAuth`/`useToast` exported from component files. | various |
| **FE-14** | Low | Staff login placeholder reveals the admin email pattern (`admin@pixelpatakha.com`). | `StaffLoginPage.jsx` L78 |

### 2.3 Security issues

| ID | Sev | Problem | Where |
|---|---|---|---|
| **SEC-1** | High | CORS callback returns `true` in **both** branches → every origin allowed, with `credentials: true`. | `app.js` L17-22 |
| **SEC-2** | High | No rate limiting or lockout on `/auth/team/login`, `/auth/staff/login`, `/auth/team/register`, `/submissions`. 6-character minimum passwords. Unlimited fake team registrations and brute force. | `auth.routes.js`, `submission.routes.js` |
| **SEC-3** | High | `env.js` falls back to `admin@pixelpatakha.com` / `Admin@12345`; `seedAdmin` silently creates that admin if env vars are missing. README publishes a sample `JWT_SECRET` and `ADMIN_PASSWORD`. No minimum JWT secret length. Anyone deploying with README values is compromised. | `env.js` L25-26, `README.md`, `seedAdmin.js` |
| **SEC-4** | High | `/uploads/*` is served publicly without authentication (designs readable before judging; names contain the original filename). Upload validation trusts the client-sent `mimetype` and file extension only (no magic-byte check, no `nosniff`); PDFs can carry active content. | `app.js` L32, `upload.middleware.js` L35-45 |
| **SEC-5** | Medium | No security headers (no `helmet`: HSTS, `nosniff`, frame protection, CSP); `x-powered-by` exposed; `netlify.toml` sets none. | `app.js`, `netlify.toml` |
| **SEC-6** | Medium | JWT (7 days) stored in `localStorage` (readable by any XSS), no revocation/logout on server, `authMiddleware` never checks the account still exists (a deleted team keeps API access until expiry). | `auth.middleware.js`, `tokenStorage.js` |
| **SEC-7** ✔ | Medium | Input handling: `password` sent as an object passes `notEmpty()` then makes bcrypt throw → 500; `updateCompetition` mass-assigns `req.body`; `listTeams` builds `new RegExp(userInput)` (crash on `(`/`[`, ReDoS); `limit` not capped; no max length on title/description/feedback/announcement text; no NoSQL-operator sanitising. | `auth.routes.js`, `admin.controller.js` L16, `team.service.js` L33 |
| **SEC-8** | Medium | Error handler returns the raw `err.message` for 500s (internal detail leak) and never logs errors server-side; stack traces returned when `NODE_ENV=development`. | `error.middleware.js` L9, 55 |
| **SEC-9** | Medium | Account enumeration: register reveals which team name/email exists; login returns before hashing when the user is missing (timing difference). | `auth.service.js` |
| **SEC-10** | Medium | `docker-compose.yml`: unpinned `mongo:latest`/`redis:alpine`, ports 27017 and 6379 published on all interfaces with **no authentication**. | `docker-compose.yml` |
| **SEC-11** | Medium | `Backend/node_modules` (586 files) is committed despite `.gitignore`. (Initial `.env` commit was empty – no secrets leaked.) | git history |
| **SEC-12** | Low | No password max length (bcrypt truncates at 72 bytes); judge passwords are set by the admin and never forced to change; no password reset for anyone. | `auth.routes.js`, `JudgesPage.jsx` |
| **SEC-13** | Low | No audit trail for sensitive admin actions (delete team, change windows, create judge). | backend |

### 2.4 Backend bugs & robustness

| ID | Sev | Problem | Where |
|---|---|---|---|
| **BE-1** ✔ | High | Redis cache is dead code: `lazyConnect: true` and `connect()` is never called, so `status` stays `wait`; `cache.service` returns early unless `ready`. `retryStrategy` returns `null` after 3 tries, so it never reconnects after a Redis restart. README claims caching/"session store". | `redis.js` L15, `cache.service.js` L6 |
| **BE-2** | Medium | Duplicate-name check is case-sensitive at query and index level (see CP-14). | `auth.service.js` L23 |
| **BE-3** | Medium | `getAdminSubmissions` loads all reviews in memory; no pagination on submissions/judges/announcements. | `submission.service.js` |
| **BE-4** | Medium | `deleteTeam` is not atomic (files, reviews, submission, team deleted separately). | `team.service.js` |
| **BE-5** | Low | No graceful shutdown/`unhandledRejection` handler; `db.js` exits on the first failed connection (Docker start-up race). | `server.js`, `db.js` |
| **BE-6** | Low | Exceeding `MAX_FILES` returns "Upload error: Unexpected field" (confusing). | `upload.middleware.js`, `error.middleware.js` |
| **BE-7** | Low | README is wrong: backend on port 3000 vs code default 5000; lists endpoints that do not exist (`/api/admin/overview`, `POST /api/judge/reviews`, public `/api/announcements`), features that do not exist (team disqualification/reactivation, countdowns, "Redis session store"). | `README.md` |
| **BE-8** | Low | No tests, no `engines`, no backend lint config. | `Backend/` |

### 2.5 Content accuracy (design.md §14: "no invented requirements")

These statements appear on the site but are not in `design.md` or the poster:
- FAQ: "open to college students registered for BVEST '26 … any recognized university"; "Pre-built full templates are strictly barred".
- Rules/AI box: "Every submission is audited. Violations result in immediate disqualification."; "Judges verify originality during mentorship and final evaluation."
- Timeline: "Mentors review your initial direction and provide actionable feedback."; "…before the timer hits zero".
- Features: "experienced industry judges". Rules say "campus Wi-Fi" (official text: Wi-Fi is not provided).
- Showcase: invented project names/authors ("Retro Arcade Companion App", "Sample Design Team"), "Hall of Fame", and a promise that top prototypes "will be exhibited here".
- Register form hint: "appear on the leaderboard" (no public leaderboard exists).
- Judge form: scoring scale and criteria (see CP-11).
- Submission flow differs from design.md (it describes a design **link** + Google Form; backend implements **file upload**).

---

## 3. Implementation Plan

Order: **Phase 0 → 1 → 2 → 3 → 4 → 5 → 6**. Phase 0 and 1 are required before any real users. Sizes: S ≤ ½ day, M ≈ 1 day, L ≈ 2–3 days.

### Phase 0 – Hotfixes (unblock the app) · Size M

| # | Fix | Files | Closes |
|---|---|---|---|
| 0.1 | **Rewrite `useAsync`**: keep the latest function in a `useRef`, so identity never triggers refetches; run once on mount (or when an explicit `deps` array changes); add `AbortController`/"latest request wins"; catch inside the effect (no unhandled rejection); expose `{ data, error, loading, refetch, setData }`. Add a unit test that renders it with an inline function and asserts **1** call (the script used in this audit). | `useAsync.js`, `useMySubmission.js`, all hooks | CP-2, FE-2 |
| 0.2 | **Toast API**: use `toast.success / toast.error` in `CompetitionSettingsPage` (or add `showSuccess/showError` aliases to the provider – pick one and use it everywhere). | `CompetitionSettingsPage.jsx` | CP-1 |
| 0.3 | **Rebuild the settings page layout**: add the missing CSS classes to `admin.css` (tokens only), use `Card accent="cyan"`, `Button variant="secondary"`, `Alert variant="error"`, give every `FormField`/`Input` an `id`. | `CompetitionSettingsPage.jsx`, `admin.css` | CP-1, FE-6 |
| 0.4 | **Registration success**: in `AuthContext` split `registerTeam` (API only) from `adoptSession(res)` (store token + user). The register page shows the confirmation, and **Go to Dashboard** calls `adoptSession` then `navigate`. Remove the unused import and the undefined variable. | `AuthContext.jsx`, `TeamRegisterPage.jsx` | FE-1 |
| 0.5 | **Modal**: keep `onClose` in a ref, focus the dialog only when `isOpen` flips to true, add a focus trap, restore focus on close, lock body scroll, generate unique ids with `useId`. | `Modal.jsx` | FE-3 |
| 0.6 | **Auth**: log out only on `401` from `/auth/me`; on network/5xx show a retry screen and keep the token. `RoleRoute` redirects to `/staff/login` for judge/admin paths and passes `state.from`; show a "Session expired" toast on the `pp_session_expired` event; `logout` navigates home. | `AuthContext.jsx`, `RoleRoute.jsx`, `DashboardLayout.jsx` | FE-4 |
| 0.7 | **Layout**: replace `overflow-x: hidden` with `overflow-x: clip` (or remove it); add `html { scroll-padding-top: calc(var(--navbar-height) + var(--strip-height)) }` or `scroll-margin-top` on sections (define the heights in `globals.css`). | `App.css`, `globals.css` | FE-5 |
| 0.8 | **Lint to zero**: fix all 23 errors/3 warnings (list in FE-7); move `useAuth`/`useToast` hooks to their own files; replace "setState in effect" fetch patterns with the new `useAsync`. Add `npm run lint` to a pre-push/CI step. | many | FE-7 |
| 0.9 | Add the missing component styles (`card--green`, etc.); replace `#ffeb60`/`#a384ff` with tokens in `globals.css`; replace raw `9px/10px`. | `Card.css`, `Button.css`, `Badge.css`, `FileDropzone.css` | FE-6, FE-8 |
| 0.10 | **Proxy/env**: `vite.config.js` reads `PORT` from the root `.env` (`loadEnv`) instead of hard-coding 3000; align README. | `vite.config.js`, `README.md` | FE-9 |
| 0.11 | **Repo hygiene**: `git rm -r --cached Backend/node_modules`, keep `.gitignore`, commit. Remove sample secrets from README. | repo | SEC-11, SEC-3 |

**Acceptance:** lint = 0 problems; Submission page shows **one** `GET /submissions/me`; settings save shows a toast and the page is styled; registration shows the confirmation screen; typing in the judge modal keeps focus.

### Phase 1 – Backend security hardening · Size L

| # | Fix | Detail | Closes |
|---|---|---|---|
| 1.1 | **CORS allow-list** | `CLIENT_URL` accepts a comma-separated list; reject anything else (`callback(new Error('Not allowed'))`). Keep `credentials` only if cookies are adopted. | SEC-1 |
| 1.2 | **Helmet + hardening** | `helmet()`, `app.disable('x-powered-by')`, `app.set('trust proxy', 1)` in production; `Cross-Origin-Resource-Policy: cross-origin` only for the files route. Add equivalent headers in `netlify.toml` (`X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, CSP allowing Google Fonts). | SEC-5 |
| 1.3 | **Rate limits** (`express-rate-limit`, Redis store once BE-1 is fixed) | login: 10 / 15 min per IP + per email; register: 5 / hour per IP; submissions: 10 / 10 min per team; global API: 300 / 5 min per IP. | SEC-2 |
| 1.4 | **Secrets** | In `env.js` throw if `JWT_SECRET` < 32 chars; remove admin fallbacks (`ADMIN_EMAIL/PASSWORD` required to seed, password ≥ 12 chars, never printed); in production refuse to start with default values. Rewrite README env section with placeholders only. **Rotate** any secret that was ever used from the README. | SEC-3 |
| 1.5 | **Input validation** | `express-validator` for `PUT /admin/competition` (whitelist fields, ISO dates, `registrationOpensAt < registrationDeadline < submissionDeadline`, length limits); `isString()` + length on `password` (8–72), `title` (≤120), `description` (≤4000), `feedback` (≤2000), announcement (title ≤120, message ≤2000); `score` → `isInt({min:0,max:100})` (decide integers vs decimals); cap `limit` ≤ 100; **escape the regex** (`escapeRegex`) in `listTeams`; reject non-string body fields; add `express-mongo-sanitize` equivalent for Express 5 (custom middleware). | SEC-7, CP-5, CP-11 |
| 1.6 | **Errors** | Log every 5xx with request id (`pino`); return a generic message for 5xx in all environments; stack only when `NODE_ENV=development` **and** request is local. | SEC-8 |
| 1.7 | **Auth** | `authMiddleware` loads the account (lean, cached 60 s in Redis) → 401 if deleted/disabled; JWT 8–12 h; add `POST /auth/logout` + `tokenVersion` on Team/User to revoke; optionally move the token to an `httpOnly; Secure; SameSite=Lax` cookie (then CSRF token needed). Constant-time login (always run a dummy bcrypt compare). Generic "already registered" message or accept the trade-off consciously. | SEC-6, SEC-9 |
| 1.8 | **Redis fix** | `await redisClient.connect()` in `server.js` (log and continue on failure), `enableOfflineQueue:false`, `retryStrategy: t => Math.min(t*200, 5000)` (never `null`). Add `/api/health` fields `{ mongo, redis }`. | BE-1 |
| 1.9 | **Docker** | Pin images (`mongo:7`, `redis:7-alpine`), bind ports to `127.0.0.1`, add Mongo root user + Redis `requirepass`, update `MONGO_URI`/`REDIS_URL`. | SEC-10 |
| 1.10 | **Server stability** | Graceful shutdown (`SIGTERM`), `unhandledRejection` logging, Mongo connection retry with back-off. | BE-5 |
| 1.11 | **Admin audit log** | `AuditLog` model (actor, action, target, ip, time) written for delete team, edit competition, create judge, start/close windows, reset submission. | SEC-13 |

**Acceptance:** requests from a non-listed origin are blocked; 11th wrong login in 15 min returns 429; server won't start with a short secret; `GET /api/health` reports Redis `ready`; `?search=(` returns an empty list, not 500.

### Phase 2 – Competition phase rework (server-driven) · Size L

**2.1 Single Competition document**
- Add `key: { type: String, default: 'main', unique: true }`; one helper `getCompetition()` using `findOneAndUpdate({key:'main'}, {$setOnInsert: {...}}, {upsert:true,new:true})`; use it in the controller, middleware and admin code.
- `seedAdmin.js` also upserts the competition with the **real** values (name, venue "B404", dates from the poster, rules from design.md, team size 1–3) – no more "now + 7 days" defaults.

**2.2 Window fields & computed status** (backwards compatible)
```text
registrationOpen (manual switch, existing)   registrationOpensAt?   registrationDeadline
submissionOpen   (manual switch, existing)   submissionOpensAt?     submissionDeadline
questStartedAt?  questDurationMinutes=180    mentorshipAtMinutes=60
submissionGraceSeconds=60                    judgingOpen=false      resultsPublished=false
```
- `GET /api/competition` returns the stored fields **plus** a computed block and `serverTime`:
```json
{
  "serverTime": "2026-10-22T04:00:05.000Z",
  "windows": {
    "registration": { "isOpen": true,  "reason": null, "opensAt": null, "closesAt": "…" },
    "submission":   { "isOpen": false, "reason": "NOT_STARTED", "opensAt": "…", "closesAt": "…" },
    "judging":      { "isOpen": false },
    "stage": "REGISTRATION | LIVE | SUBMISSION | JUDGING | RESULTS"
  }
}
```
- One shared function `evaluateWindows(competition, now)` is used by the API response **and** by `checkRegistrationOpen` / `checkSubmissionOpen`, so UI and enforcement can never disagree.
- Never cache `windows` (cache the static part only, TTL 60 s; compute `windows`/`serverTime` per request).

**2.3 Admin "Competition Control" panel** (replaces the raw form for day-of operations; the full form stays under "Advanced")
- **Start Quest** (confirm dialog): sets `questStartedAt = now`, `submissionOpen = true`, `submissionDeadline = now + 180 min`, posts a pinned announcement "Quest started".
- **Extend deadline** (+5 / +10 / +15 min), **Close submissions now**, **Reopen**, **Open judging**, **Lock judging**, **Publish results**.
- Validation warnings in the UI (deadline in the past, switch on with no deadline).
- Every action writes an audit log entry (1.11).

**2.4 Frontend: one source of truth**
- `CompetitionProvider` (context) fetches `/competition` once, **polls every 15–20 s** (pause when `document.hidden`, immediate refetch on tab focus), keeps `serverOffset = serverTime - Date.now()`; exposes `{ competition, windows, now, loading, error, refetch }`.
- Remove `windowStatus.js` client computation; components read `windows.*`.
- Distinct UI states for **loading**, **error (with retry)**, **open**, **closed (reason)**, **not started (opens at …)** – never "closed" while loading/failed.
- `useCountdown(targetISO)` (tick from `now`) → countdown on landing Live Quest card, team dashboard ("time left to submit"), and mentorship check-in at +60 min. Auto-disables the form when the countdown hits zero (+ grace).
- `AnnouncementsFeed` polls every 15 s; new item shows a toast/"New" badge; pinned items first.

**2.5 Submission reliability**
- `useAsync` fixed (0.1). Upload with `axios` `onUploadProgress` → progress bar, `timeout: 10 min`, **Cancel** button, **Retry** after failure; keep the form values on failure.
- Fix `FileDropzone`: create object URLs with `useMemo`/`useEffect` cleanup, not in render; dedupe files; accept partial batch.
- Backend: validate **before** persisting files — split into `multer` (memory/temp) → validate (title, window, team, duplicate) → move; or wrap the controller in `try/catch` that `unlink`s `req.files` on any error. Add a **janitor** script that removes files not referenced by any Submission (run on start and nightly).
- Server-side deadline policy: window checked at request start **and** when the upload completes; accept if completed ≤ `submissionDeadline + submissionGraceSeconds`; store `uploadStartedAt` and `submittedAt`.
- **Replace until deadline** (decision D3): `PUT /submissions/me` replaces files/title/description while the window is open; keeps history count (`version`). If you keep "one final upload", provide admin reset instead (below).
- Admin: `DELETE /admin/submissions/:id` ("Reset submission") so a team can resubmit without being deleted.

**2.6 File storage & delivery** (decision D4)
- Option A (minimum): keep disk storage on a persistent volume, **stop** using `express.static`; store only `filename` in the DB and build URLs at read time from `PUBLIC_API_URL` (fixes Host-header/mixed-content/LAN issues); serve via `GET /api/files/:submissionId/:filename` with auth (team owner, judge, admin) or short-lived signed links (`?t=` HMAC, 10 min) so `<img>` tags work.
- Option B (recommended for deployment): S3-compatible/Cloudinary storage with pre-signed uploads/downloads; generate **thumbnails** (sharp) for galleries, originals on click.
- In both: magic-byte validation (`file-type`), reject mismatches, `Content-Disposition`/`nosniff`, max total size per submission, filename = random UUID + safe extension.

**2.7 Judging & results**
- `judgingOpen` flag: `POST /judge/.../review` returns 403 unless open (admin can still view). Judges' screen shows "Judging opens when the organisers start it".
- Score rule decided by organisers (D5): integer 0–100, or rubric with weights; display **exactly** the approved criteria, no invented text.
- `GET /admin/results`: ranking by average, `reviewCount`, tie handling (same rank), optional "minimum reviews" filter and judge-normalisation option; CSV export.
- `resultsPublished`: when true, teams see their own result (rank/score; feedback visibility = decision D6) at `GET /team/result`; landing/Showcase can show approved entries only (new `showcase: Boolean` on Submission, admin toggles) → replaces placeholders.
- UI: rename "Leaderboard" page to match reality or add rank column; neutral badge for "Not scored".

**2.8 Problem statement & announcements**
- Add `pinned: Boolean`, `type: 'info' | 'problem-statement' | 'urgent'`, optional `expiresAt` to `Announcement`; team dashboard shows a highlighted banner for the latest pinned item.
- Optional (decision D7): attach a PDF/image problem statement (same secure file route).
- Public announcement strip on the landing page can show the latest *urgent* item (needs a public read endpoint with only title/message, no author email).
- Do not populate `createdBy.email` (use name only).

**2.9 Registration rules**
- One source of truth for team size: backend env `MIN_TEAM_SIZE/MAX_TEAM_SIZE` and expose them (and file limits) in `GET /competition` as `limits`; frontend reads them instead of separate `VITE_*` copies.
- Case-insensitive unique team name (collation `{locale:'en', strength:2}` index + query), normalise whitespace.
- Reject member emails/phones that already belong to another team (decision D8) and duplicates inside the same team.
- Optional `maxTeams` capacity with "waitlist" message (decision D9).
- **Password reset** (no email service assumed): `PATCH /admin/teams/:id/password` generates a temporary password shown once; forced change on next login. If an email service is available later: email reset link.
- Admin can edit a team's members/leader email (typo fixes): `PATCH /admin/teams/:id`.

**Acceptance (phase 2):** two browser tabs always agree on window status within 20 s; admin presses **Start Quest** and teams see the form open + countdown without refreshing; a 3-minute upload that finishes inside the grace period is accepted, one finishing after is rejected with a clear message; admin can reset a submission; two simultaneous first requests create exactly one Competition document.

### Phase 3 – Frontend remaining fixes · Size M

| # | Fix | Closes |
|---|---|---|
| 3.1 | Error boundary around routes with a friendly "Something broke – reload" screen; log to console/Sentry. | FE-10 |
| 3.2 | `Spinner` supports `fullScreen`; dashboard waits for competition state; shared `<AsyncBoundary loading error>` component to remove copy-pasted spinner/error blocks. | FE-10 |
| 3.3 | TeamsPage: single source of page/search state (reset page together with the debounced value), go to previous page after deleting the last row, show **Submission status** column + filter (All / Submitted / Missing) using one `GET /admin/submissions` lookup. | FE-10, CP-13 |
| 3.4 | Admin overview: real stats (teams, submitted vs missing, reviews completed / expected, judges, windows) from a new `GET /admin/stats`; remove hard-coded prize pool. | CP-13 |
| 3.5 | Landing: put `bvcoe`, `DAS`, `ACM` logos in the hero as in the poster; fix anchors with `scroll-margin`; render footer contact / communication group / social links when values exist; decide on `Poster.jpeg` (use as OG image or delete). | FE-11 |
| 3.6 | Accessibility pass: link labels to inputs everywhere, `aria-describedby` support in `Input`/`Textarea`, drawer/sidebar focus + Esc + `inert` when closed, accordion panel always in DOM (`hidden`), `role="alert"` for error toasts, `autoComplete="new-password"`/`email`, keyboard Space handling in dropzone. | FE-12 |
| 3.7 | Lazy images (`loading="lazy"`, `decoding="async"`, fixed aspect ratio) in judge/admin galleries; use thumbnails when 2.6-B is done. | CP-9 |
| 3.8 | Replace hard-coded routes with `ROUTES`/`generatePath`; move shared `FilePreviewGrid` to `components/`; remove staff placeholder email. | FE-13, FE-14 |
| 3.9 | Judge queue: search by team/title, sort, pagination, keep list while refetching (no full-page spinner). | CP-15 |

### Phase 4 – New features to build · Size L

| Feature | Backend | Frontend |
|---|---|---|
| **Competition Control panel** (2.3) | `POST /admin/competition/start-quest`, `/extend`, `/close-submissions`, `/open-judging`, `/lock-judging`, `/publish-results` | New admin page, confirm dialogs, status badges |
| **Results & ranking** (2.7) | `GET /admin/results`, `GET /admin/export/{teams,submissions,results}.csv` | Admin results page + CSV buttons |
| **Judge management** | `PATCH /admin/judges/:id` (disable/enable, reset password), `DELETE /admin/judges/:id` | Judges table actions, forced password change on first login |
| **Team management** | `PATCH /admin/teams/:id` (fix details), `PATCH /admin/teams/:id/password`, `DELETE /admin/submissions/:id` | Team detail page actions |
| **Countdown + live feed** (2.4) | `serverTime` in competition response | `useCountdown`, polling hooks, "New" badge |
| **Pinned problem statement** (2.8) | `Announcement.pinned/type/expiresAt` | Highlighted banner on team dashboard |
| **Secure file access** (2.6) | Signed/authenticated file route, thumbnails | Use returned URLs; lightbox viewer for images/PDF |
| **Showcase from real entries** | `Submission.showcase` + `GET /public/showcase` (title, team name, thumbnail only for approved, after results) | Replace placeholder cards; hide section until entries exist |
| **Audit log viewer** (optional) | `GET /admin/audit` | Admin table |
| **Forgot-password / email verification** (optional, needs email provider) | Reset tokens | Reset pages |

### Phase 5 – Content & documentation · Size S

1. Replace the unconfirmed copy listed in §2.5 with design.md text, or mark each sentence "TBC by organisers". Keep only: team size 1–3; Figma/Canva/Adobe XD; bring laptop, charger and mobile hotspot (Wi-Fi/devices not provided); reference links with the final submission; plagiarism and generative AI prohibited.
2. Remove "leaderboard", "Hall of Fame", "experienced industry judges", "audited/disqualification" statements unless organisers confirm.
3. Decide submission method wording (upload vs Google Form link) and make FAQ + timeline match the real flow.
4. Rewrite `README.md` to match the code (ports, endpoints, env variables, no real secrets, no claims of unimplemented features). Add `.env.example` (placeholders) at the root.
5. Update the two old `implementation_plan*.md` files or archive them to avoid contradicting this plan.

### Phase 6 – Testing & release readiness · Size L

| Layer | What to add |
|---|---|
| Backend unit/integration | `vitest`/`jest` + `supertest` + `mongodb-memory-server`: auth (register/login/401/403), window rules (open/closed/grace), submission (title missing → no orphan file, duplicate, size/type, magic-bytes), review upsert + judging flag, admin endpoints, rate limits, Competition singleton race (parallel first calls). |
| Frontend unit | `vitest` + Testing Library: `useAsync` (inline fn → 1 call), `AuthContext` (network error keeps session, 401 logs out), `Modal` focus, register success flow, settings save toast. |
| E2E | Playwright: register → login → (admin opens quest) → countdown appears → upload → judge scores → admin results → CSV. Run at 360/768/1024/1440 px. |
| Load rehearsal | `k6`/`autocannon`: 150 teams polling `/competition` + `/announcements` every 15 s and 100 concurrent 5 MB uploads; check CPU/disk/Mongo; verify Redis cache hit rate. |
| CI | GitHub Actions: `npm ci`, lint, build, tests for both apps; fail on lint errors; `npm audit --omit=dev`; secret scanning (gitleaks). |
| Dry run | Full rehearsal with the real venue network (hotspot) and 5 test teams; checklist: backup DB + uploads before start, admin has two devices, deadline extension tested, rollback plan. |

---

## 4. Decisions Needed From You

| # | Question | Default if you don't answer |
|---|---|---|
| D1 | Final team size: 1–3 (design.md) or 1–4 (backend default)? | 1–3 everywhere |
| D2 | Submission method: **file upload** (current backend) or design/prototype **link** + reference links (design.md)? | Keep file upload; add an optional "Design link" field |
| D3 | May teams **replace** their submission until the deadline? | Yes (versioned); admin reset also available |
| D4 | File storage: disk on persistent volume, or cloud (S3/Cloudinary)? Where is the backend hosted? | Disk + authenticated route now; cloud later |
| D5 | Approved judging rubric / score scale (and integer vs decimal)? | Single integer 0–100, no criteria text shown |
| D6 | After results: do teams see score, rank, and judge feedback? | Rank + score only |
| D7 | Attach the problem statement as a file, or text announcement only? | Text, pinned |
| D8 | Block the same person (email/phone) in multiple teams? | Yes |
| D9 | Maximum number of teams (venue capacity)? | No cap |
| D10 | Grace period for uploads that finish after the deadline? | 60 seconds |
| D11 | Official Communication Group link, contact email/phone, social links | Footer hides the items |
| D12 | Event timing: Oct 22–23, 9 AM (poster) vs "3-hour" run — which day/time is the 3-hour quest, and what is the registration deadline? | Admin sets in Competition Control |

---

## 5. Suggested Order of Work & Effort

| Step | Phase | Effort | Blocks |
|---|---|---|---|
| 1 | Phase 0 hotfixes | ~1 day | nothing – do first |
| 2 | Phase 1 security (1.1–1.8) | ~2 days | before public deployment |
| 3 | Phase 2.1–2.5 (competition core) | ~3 days | needs D1–D3, D10, D12 |
| 4 | Phase 2.6 file storage | ~1–2 days | needs D4 |
| 5 | Phase 2.7–2.9 judging/results/announcements/registration | ~3 days | needs D5–D9 |
| 6 | Phase 3 + Phase 4 UI work | ~3 days | parallel with 3–5 |
| 7 | Phase 5 content/docs | ~½ day | needs D2, D11 |
| 8 | Phase 6 tests + rehearsal | ~2 days | before event |

**Minimum viable set for event day:** Phase 0, Phase 1 (1.1–1.8), Phase 2.1–2.5 and 2.7 (basic results), plus Phase 5 content corrections and the Phase 6 dry run.