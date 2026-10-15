# PIXEL PATAKHA – Frontend Implementation Plan (React + Vite)

Scope: **Frontend only** (`Frontend/`). The backend in the repo is already built; this plan only consumes it.
Sources used: `design.md` (theme), the poster (landing page inspiration), your two folder-structure screenshots, and the current repo (`Backend/` code and `Frontend/public` assets, verified).

---

## 1. Ground Rules (from your instructions)

| # | Rule | How it is enforced |
|---|---|---|
| 1 | Theme from `design.md` | All colors, fonts, spacing, shadows, borders become CSS variables in `globals.css`; nothing else defines them |
| 2 | Landing page inspired by poster | Section 7 maps each poster element to a landing section |
| 3 | One single app theme | Landing, auth, team, judge and admin all use the same shared components and tokens |
| 4 | Fully responsive | Section 11; mobile-first CSS; tested at 360 / 768 / 1024 / 1440 px |
| 5 | Folder architecture from screenshots | Section 5 |
| 6 | Connected to backend and working | Every screen calls a real endpoint (Section 10); no mock data |
| 7 | Use PNG logos in `public/` | `bvcoe-logo.png`, `DAS-logo.png`, `ACM-logo.png` used in hero, footer and auth screens |
| 8 | All necessary pages | Landing, team register, team login, staff login, team dashboard, submission, judge pages, admin pages, 404 |
| 9 | All CSS variables in `globals.css` | Every other `.css` file only uses `var(--…)`; no hex/px design values outside `globals.css` (only `@media` breakpoints, because CSS variables cannot be used inside media queries) |
| 10 | No Tailwind | Plain CSS files only; no CSS framework or UI library |
| 11 | No text/summary while generating | Build output is code only |

---

## 2. Backend Contract (verified from the repo)

Base: `http://localhost:5000/api` · Auth: `Authorization: Bearer <JWT>` · Response: `{ success, message, data }` · Error: `{ success:false, message, errors?:[{field,message}] }`

| Area | Endpoint | Role | Response `data` |
|---|---|---|---|
| Public | `GET /competition` | none | `{ name, tagline, description, venue, rules[], eventDate, registrationOpen, registrationDeadline, submissionOpen, submissionDeadline }` |
| Auth | `POST /auth/team/register` | none (403 if closed) | `{ team, token }` |
| Auth | `POST /auth/team/login` | none | `{ team, token }` |
| Auth | `POST /auth/staff/login` | none | `{ user, token }` (`user.role` = `admin` or `judge`) |
| Auth | `GET /auth/me` | any | team or user document (has `role`) |
| Team | `GET /team/me` | team | `{ team, submission \| null }` |
| Team | `GET /announcements` | any logged-in | `[{ _id, title, message, createdAt, createdBy:{name,role} }]` |
| Team | `POST /submissions` (multipart: `title`, `description`, `designs[]`) | team | submission (409 if already submitted, 403 if closed) |
| Team | `GET /submissions/me` | team | submission (404 if none) |
| Judge | `GET /judge/submissions` | judge | submissions + `hasReviewed`, `judgeScore` |
| Judge | `GET /judge/submissions/:id` | judge | submission |
| Judge | `POST /judge/submissions/:id/review` `{score,feedback}` | judge | review (201 new / 200 updated) |
| Judge | `GET /judge/reviews` | judge | reviews with `submission:{_id,title,teamName,submittedAt}` |
| Admin | `PUT /admin/competition` | admin | competition |
| Admin | `GET /admin/teams?page&limit&search` | admin | `{ teams[], pagination:{total,page,limit,totalPages} }` |
| Admin | `GET /admin/teams/:id` | admin | `{ team, submission \| null }` |
| Admin | `DELETE /admin/teams/:id` | admin | message only |
| Admin | `GET/POST /admin/judges` | admin | judges[] / judge |
| Admin | `GET /admin/submissions` | admin | submissions + `reviewCount`, `averageScore` |
| Admin | `GET /admin/submissions/:id` | admin | submission + `averageScore` + `reviews[{judge:{name,email},score,feedback,createdAt}]` |
| Admin | `POST /admin/announcements`, `DELETE /admin/announcements/:id` | admin | announcement / message |

Submission files: `{ originalName, filename, url, mimeType, size }` – `url` is absolute and ready to use in `<img>` / `<a>`.
Allowed uploads: PNG, JPG/JPEG, WEBP, PDF. Limits come from backend env (`MAX_FILE_SIZE_MB`, `MAX_FILES_PER_SUBMISSION`).

---

## 3. Conflicts Found & Decisions (please confirm)

| Topic | `design.md` / poster says | Backend does | Decision in this plan |
|---|---|---|---|
| Team size | 1–3 members | `MAX_TEAM_SIZE` defaults to 4 | Frontend enforces `VITE_MIN_TEAM_SIZE=1`, `VITE_MAX_TEAM_SIZE=3`. **Set `MAX_TEAM_SIZE=3` in root `.env` for the backend too.** |
| Final submission | A design/prototype **link** + reference links (Google Form) | Accepts **file uploads** only (PNG/JPG/WEBP/PDF), no link field | Build the upload flow (as requested: "teams upload designs"). Reference links go in the `description` field, with clear helper text. No backend change. |
| Event date / venue | Poster: Oct 22–23, 9 AM onwards, Venue B404 | Competition defaults: random future date, venue "Main Auditorium / Online" | Poster facts live in `config/eventInfo.js` (static). Backend competition data drives **registration/submission status and deadlines only**. Admin should still update venue/date in the Competition Settings page. |
| Rules text | Official rules in `design.md` | Competition `rules[]` defaults are placeholder rules (e.g. "1–4 members") | Landing rules panel shows the official `design.md` rules (static), **not** the backend `rules[]`. |
| Showcase | Real approved entries only | No public submissions endpoint | Showcase shows clearly labelled placeholder cards ("SAMPLE PLACEHOLDER – not a real submission"), as `design.md` allows. |
| Poster wording | "Price Pool" | – | Rendered as **"Prize Pool"**. |
| Event length | "3-hour designathon" and poster shows two dates | – | Use both as given; no extra claims added. |

---

## 4. Stack, Dependencies & Config Changes

Already in project: React 19, Vite, ESLint.
Add only:
```bash
cd Frontend
npm i react-router-dom axios
```

### Config files to modify / add
| File | Change |
|---|---|
| `vite.config.js` | `envDir: '../'` (reads the single root `.env`); dev `server.proxy` for `/api` and `/uploads` → `http://localhost:5000` |
| `index.html` | Title "PIXEL PATAKHA '26", meta description, `theme-color` = Cosmic Black, preconnect + Google Fonts link (Pixelify Sans, Press Start 2P, Space Mono, `display=swap`), favicon |
| `public/favicon.svg` | Pixel-diamond logo (referenced already by `index.html`, currently missing) |
| `netlify.toml` | Build command, `dist` publish dir, SPA fallback redirect `/* → /index.html (200)` |
| Root `.env` (add lines) | See below |

```env
# Frontend (Vite only exposes VITE_* variables to the browser; no secrets here)
VITE_API_URL=/api
VITE_MIN_TEAM_SIZE=1
VITE_MAX_TEAM_SIZE=3
VITE_MAX_FILE_SIZE_MB=10
VITE_MAX_FILES=5
```
`VITE_API_URL=/api` works in dev through the Vite proxy. In production (Netlify) set it to the deployed backend URL, e.g. `https://<backend-host>/api`, in the Netlify environment settings (root `.env` is git-ignored). Keep `VITE_MAX_FILE_SIZE_MB` / `VITE_MAX_FILES` equal to the backend values.

---

## 5. Folder Structure (follows your screenshots)

Screenshots show `features/{admin, auth, customers, kitchen}`. Mapping for this project: **customers → `team`**, **kitchen → `judge`**. Every feature has `api / components / hooks / pages / styles / utils`. A `common` feature holds logic shared by several features.

```
Pixel-Patakha---ACM/
├── .env                              # shared (already exists)
└── Frontend/
    ├── assets/                       # kept per your structure (reserved; decorative art is drawn in code)
    ├── public/
    │   ├── ACM-logo.png  DAS-logo.png  bvcoe-logo.png   # existing
    │   └── favicon.svg
    ├── index.html
    ├── netlify.toml
    ├── vite.config.js
    ├── eslint.config.js
    ├── package.json
    └── src/
        ├── main.jsx                  # imports globals.css, then index.css, mounts <App/>
        ├── App.jsx                   # <BrowserRouter>, providers, <AppRoutes/>
        ├── App.css                   # app shell (min-height, flex column)
        ├── index.css                 # root element / base layout only (uses var())
        │
        ├── styles/
        │   ├── globals.css           # ALL design tokens, resets, fonts, keyframes, utilities
        │   ├── LandingPage.css
        │   └── 404NotFound.css
        │
        ├── pages/
        │   ├── LandingPage.jsx       # (rename existing "Landing Page.jsx")
        │   └── 404NotFound.jsx
        │
        ├── config/
        │   ├── env.js                # reads import.meta.env (API URL, team size, upload limits)
        │   ├── axiosClient.js        # axios instance + interceptors
        │   ├── routes.js             # route path constants
        │   ├── navLinks.js           # landing + sidebar nav definitions
        │   └── eventInfo.js          # static event content (poster facts, timeline, rules, FAQ, features, footer links)
        │
        ├── components/
        │   ├── layout/
        │   │   ├── AnnouncementStrip.jsx/.css
        │   │   ├── Navbar.jsx/.css
        │   │   ├── Footer.jsx/.css
        │   │   ├── PublicLayout.jsx          # strip + navbar + outlet + footer
        │   │   ├── AuthLayout.jsx/.css       # centered card on starfield
        │   │   └── DashboardLayout.jsx/.css  # topbar + sidebar (drawer on mobile) + outlet
        │   ├── ui/
        │   │   ├── Button.jsx/.css           # primary | secondary | danger | ghost; supports `to` (Link) and `loading`
        │   │   ├── Card.jsx/.css             # accent: cyan | purple | yellow | pink | muted
        │   │   ├── Badge.jsx/.css            # tone + icon + text (never color alone)
        │   │   ├── Alert.jsx/.css            # success | error | warning | info (icon + text)
        │   │   ├── FormField.jsx/.css        # label, required mark, hint, error wiring (aria-describedby)
        │   │   ├── Input.jsx  Textarea.jsx  Toggle.jsx  (+ Form.css)
        │   │   ├── FileDropzone.jsx/.css     # multi-file picker, previews, client validation
        │   │   ├── Spinner.jsx/.css          # pixel spinner
        │   │   ├── EmptyState.jsx  ErrorState.jsx  (+ State.css)
        │   │   ├── Modal.jsx/.css            # ConfirmDialog built on this (focus trap, Esc to close)
        │   │   ├── DataTable.jsx/.css        # table ≥768 px, stacked cards on mobile
        │   │   ├── Pagination.jsx/.css
        │   │   ├── Accordion.jsx/.css        # FAQ
        │   │   ├── PageHeader.jsx  StatCard.jsx  (+ .css)
        │   │   └── Toast.jsx/.css
        │   ├── pixel/
        │   │   ├── PixelSprite.jsx           # draws a sprite from a string grid as crisp SVG rects
        │   │   ├── sprites.js                # robot, hero, invader, coin, heart, star, creature, diamond, black-hole
        │   │   ├── VoxelIsland.jsx           # floating block island (SVG)
        │   │   ├── PixelStars.jsx/.css       # square drifting/twinkling particles
        │   │   ├── PixelDiamondLogo.jsx
        │   │   └── Pixel.css
        │   └── landing/
        │       ├── HeroSection.jsx/.css
        │       ├── FeatureCards.jsx/.css
        │       ├── TimelineSection.jsx/.css
        │       ├── RulesSection.jsx/.css
        │       ├── ShowcaseSection.jsx/.css
        │       └── FaqSection.jsx/.css
        │
        └── features/
            ├── common/
            │   ├── api/        competitionApi.js  announcementApi.js
            │   ├── context/    ToastContext.jsx
            │   ├── hooks/      useAsync.js  useCompetition.js  useDocumentTitle.js  useDebounce.js  useToast.js
            │   └── utils/      formatDate.js  formatFileSize.js  apiError.js  windowStatus.js
            ├── auth/
            │   ├── api/        authApi.js
            │   ├── context/    AuthContext.jsx
            │   ├── components/ ProtectedRoute.jsx  RoleRoute.jsx  PublicOnlyRoute.jsx  MemberFields.jsx
            │   ├── hooks/      useAuth.js
            │   ├── pages/      TeamRegisterPage.jsx  TeamLoginPage.jsx  StaffLoginPage.jsx
            │   ├── styles/     auth.css
            │   └── utils/      tokenStorage.js  validators.js  roleHome.js
            ├── team/           # was "customers"
            │   ├── api/        teamApi.js  submissionApi.js
            │   ├── components/ RegistrationSummary.jsx  SubmissionStatusCard.jsx  AnnouncementsFeed.jsx  SubmissionView.jsx  SubmissionForm.jsx
            │   ├── hooks/      useTeamProfile.js  useMySubmission.js
            │   ├── pages/      TeamDashboardPage.jsx  SubmissionPage.jsx
            │   ├── styles/     team.css
            │   └── utils/      submissionWindow.js
            ├── judge/          # was "kitchen"
            │   ├── api/        judgeApi.js
            │   ├── components/ JudgeSubmissionCard.jsx  FilePreviewGrid.jsx  ReviewForm.jsx
            │   ├── hooks/      useJudgeSubmissions.js  useMyReviews.js
            │   ├── pages/      JudgeSubmissionsPage.jsx  JudgeReviewPage.jsx  MyReviewsPage.jsx
            │   ├── styles/     judge.css
            │   └── utils/      reviewFilters.js
            └── admin/
                ├── api/        adminApi.js
                ├── components/ TeamsTable.jsx  SubmissionsTable.jsx  JudgeForm.jsx  AnnouncementForm.jsx  CompetitionForm.jsx  ReviewList.jsx
                ├── hooks/      useAdminTeams.js  useAdminSubmissions.js
                ├── pages/      AdminOverviewPage.jsx  TeamsPage.jsx  TeamDetailPage.jsx  SubmissionsPage.jsx  SubmissionDetailPage.jsx  JudgesPage.jsx  AnnouncementsPage.jsx  CompetitionSettingsPage.jsx
                ├── styles/     admin.css
                └── utils/      dateInput.js  escapeRegex.js  sortRows.js
```
Conventions: plain CSS, class names prefixed per component (`.btn`, `.btn--primary`, `.card--cyan`) to avoid collisions; component CSS sits next to its component, page CSS in `src/styles`, feature CSS in `features/<name>/styles`. Dashboard areas are lazy-loaded per role (`React.lazy`) so landing visitors never download admin/judge code.

---

## 6. Design System (`globals.css` is the single source)

### 6.1 Tokens defined in `globals.css`
```css
:root {
  /* Colors (design.md §3) */
  --color-cosmic-black:   #030711;
  --color-deep-navy:      #07152B;
  --color-electric-cyan:  #00D9FF;
  --color-pixel-blue:     #087BFF;
  --color-voxel-purple:   #6338F5;
  --color-arcade-yellow:  #FFE229;
  --color-pixel-pink:     #FF1493;
  --color-cloud-white:    #F4F7FF;
  --color-muted-text:     #AAB8D0;
  --color-panel-border:   #203D65;
  --color-success-green:  #48E08A;
  --color-error-red:      #FF5364;

  /* Semantic aliases (components use these) */
  --bg-page: var(--color-cosmic-black);
  --bg-panel: var(--color-deep-navy);
  --text-primary: var(--color-cloud-white);
  --text-secondary: var(--color-muted-text);
  --border-subtle: var(--color-panel-border);
  --border-strong: var(--color-electric-cyan);
  --link: var(--color-pixel-blue);
  --focus-ring: 3px solid var(--color-electric-cyan);

  /* Derived alpha colors (color-mix, so no extra hex values) */
  --color-cyan-glow:   color-mix(in srgb, var(--color-electric-cyan) 40%, transparent);
  --color-overlay:     color-mix(in srgb, var(--color-cosmic-black) 80%, transparent);

  /* Gradients (hero art / decoration only) */
  --gradient-purple-blue: linear-gradient(135deg, var(--color-voxel-purple), var(--color-pixel-blue));
  --gradient-cyan-blue:   linear-gradient(135deg, var(--color-electric-cyan), var(--color-pixel-blue));

  /* Typography */
  --font-display: 'Pixelify Sans', 'Courier New', monospace;
  --font-label:   'Press Start 2P', 'Courier New', monospace;
  --font-body:    'Space Mono', ui-monospace, 'Courier New', monospace;
  --fs-hero:      clamp(2.25rem, 7vw, 4.75rem);   /* 36 → 76 px */
  --fs-h2:        clamp(1.375rem, 3vw, 1.875rem); /* 22 → 30 px */
  --fs-card-title:clamp(1rem, 2vw, 1.25rem);      /* 16 → 20 px */
  --fs-body:      0.9375rem;                      /* 15 px */
  --fs-small:     0.8125rem;                      /* 13 px */
  --fs-label:     0.625rem;                       /* 10 px */
  --fs-label-xs:  0.5rem;                         /* 8 px  */

  /* Spacing (4 px base) */
  --space-xs: 4px;  --space-s: 8px;  --space-m: 16px;  --space-l: 24px;
  --space-xl: 32px; --space-2xl: 48px; --space-3xl: clamp(64px, 9vw, 96px);

  /* Shape */
  --radius-none: 0;  --radius-sm: 2px;
  --border-width: 2px;
  --container-max: 1280px;
  --sidebar-width: 260px;
  --tap-target: 44px;

  /* Hard offset shadows (pixel style) */
  --shadow-primary: 4px 4px 0 var(--color-voxel-purple);
  --shadow-secondary: 4px 4px 0 var(--color-panel-border);
  --shadow-danger: 4px 4px 0 var(--color-pixel-pink);
  --shadow-card-hover: 0 0 0 2px var(--color-electric-cyan), 0 0 16px var(--color-cyan-glow);
  --title-shadow: 2px 2px 0 var(--color-arcade-yellow), 4px 4px 0 var(--color-voxel-purple),
                  6px 6px 0 var(--color-pixel-blue), 0 0 24px var(--color-cyan-glow);

  /* Motion & layers */
  --transition-fast: 120ms ease;  --transition-base: 200ms ease;
  --z-base: 1; --z-nav: 100; --z-drawer: 200; --z-modal: 300; --z-toast: 400;
}
```
Also in `globals.css`: modern reset, `html { scroll-behavior: smooth }`, body (Cosmic Black + faint nebula `radial-gradient` using tokens, Space Mono, Cloud White), heading font rules, `:focus-visible` using `--focus-ring`, `.container`, `.sr-only`, `.pixelated { image-rendering: pixelated }`, shared `@keyframes` (`float`, `twinkle`, `drift`, `spin-pixel`), and one global `@media (prefers-reduced-motion: reduce)` block that disables all animations/transitions.

**Breakpoints** (documented in a comment, repeated literally in `@media`): mobile < 768 px, tablet 768–1023 px, desktop ≥ 1024 px, plus 480 px for small phones. Mobile-first: base styles are mobile; `min-width` queries add layout.

### 6.2 Typography rules
- Pixelify Sans: hero title, section headings, card titles, nav labels.
- Press Start 2P: small badges, counters, HUD chips, button labels (10–12 px). Never for paragraphs/FAQ/rules.
- Space Mono: paragraphs, rules, forms, tables, timestamps.
- Uppercase only for short headings/labels.

### 6.3 Shared component specs
| Component | Spec |
|---|---|
| Button primary | Arcade Yellow bg, Cosmic Black text, `--shadow-primary`, hover lifts 2 px, cyan focus outline, min height `--tap-target`. Reserved for **Register Team** / **Submit Design** |
| Button secondary | Transparent/Deep Navy, cyan border + text, hover cyan tint |
| Button danger | Pink border/text (delete actions) |
| Card | Deep Navy, 2 px cyan or Panel Border border, optional pixel-corner accents, hover glow (`--shadow-card-hover`) |
| Badge | Yellow = milestone, Cyan = info, Purple = category, Green = success/complete, Pink/Red = warning/error; always icon + label |
| Inputs | Dark bg, white text, muted border → cyan on focus, label above, required `*`, inline error text + icon, `aria-invalid`, `aria-describedby` |
| Alert | Icon + title + message; success, error, warning, info |
| Spinner | Small pixel-block spinner, `role="status"`, visually hidden "Loading" text |
| Table | Panel Border rows; on mobile each row becomes a card with `data-label` captions |
| Modal | Overlay + Deep Navy panel, focus trap, Esc, returns focus |
| Empty / Error states | Explain what will appear / what went wrong + retry button |

### 6.4 Motion
Allowed only: slow drifting pixel particles, gentle float on islands/sprites, button lift, card glow, smooth anchor scrolling. All disabled under `prefers-reduced-motion`. No essential info depends on animation or hover.

### 6.5 Accessibility
Semantic landmarks (`header/nav/main/footer`), heading order, visible focus, keyboard-operable navbar menu / accordion / modal / drawer, alt text for logos (empty alt for decoration), `aria-hidden` on all sprites, status never by color alone, 44 px touch targets, readable body sizes.

---

## 7. Landing Page (inspired by the poster)

### 7.1 Poster → page mapping
| Poster element | Landing page implementation |
|---|---|
| Black starfield with nebula | Page background (tokens) + `PixelStars` particles (reduced on mobile) |
| Diagonal blue/purple pixel band behind the title | `HeroBand`: rotated gradient band (`--gradient-purple-blue` / cyan-blue) with stepped pixel edges via `clip-path`; becomes a simple horizontal stripe on mobile |
| Huge 3D "PIXEL PATAKHA" (white, yellow edge, purple extrude) | Two-line hero title in Pixelify Sans, white fill, `--title-shadow`, slight tilt on desktop, straight on mobile |
| "Prize Pool ₹1,00,000" | HUD chip in Press Start 2P with a coin sprite |
| "OCT 22nd–23rd · 9AM onwards" | HUD chip (calendar sprite) |
| "Venue: B404" | HUD chip (pin sprite) |
| Robot, hero character with cap, space invaders, coins, hearts, plus-stars | `PixelSprite` components arranged around the hero, floating slowly; hidden/reduced < 768 px |
| Purple black-hole swirl | Decorative sprite top-left of hero (desktop only) |
| Bharati Vidyapeeth logo (top) | `bvcoe-logo.png` shown above hero title / in navbar-adjacent badge |
| "DAS × ACM BVP" (bottom) | `DAS-logo.png` × `ACM-logo.png` row in hero footer strip and in footer |

All sprites are original pixel art drawn in code (grid strings), in line with the design.md asset rules; the poster is used for composition and mood only. Only palette colors are used (no green terrain; islands use purple/blue/navy).

### 7.2 Sections (order from design.md §6)
1. **AnnouncementStrip** – `★ BVEST '26 • DESIGN. BUILD. PLAY. ★`, yellow on Deep Navy.
2. **Navbar** – sticky; pixel-diamond logo + wordmark; About, Timeline, Rules, FAQ anchors; **REGISTER TEAM** (yellow). Logged-in users see **DASHBOARD** instead. Mobile: hamburger with `aria-expanded`, closes on link click/Esc. Anchors work from any route (`/#rules`).
3. **Hero** – title, subtitle `A 3-HOUR UI/UX DESIGNOTHON`, line `Turn bold ideas into intuitive digital experiences.`, CTAs **REGISTER YOUR TEAM** (yellow → `/register`) and **EXPLORE THE EVENT** (→ `#about`), quick facts (3 hours · 1–3 members · Figma · Canva · Adobe XD), **Live Quest card** (date, venue, prize pool, and live registration status from `GET /competition`: Open / Closed + deadline). If registration is closed, the primary CTA is disabled with the reason shown.
4. **FeatureCards – "Your Next Design Quest"** – Think Fast, Build Smart, Show Your Craft (numbered badges, sprite icons, cyan/purple/yellow borders).
5. **Timeline – "The 3-Hour Run"** – `00:00 Quest Start`, `01:00 Mentorship Check-in`, `03:00 Final Submission`; horizontal dotted neon line on desktop, vertical on mobile; flag / team / star icons. No extra milestones.
6. **Rules – "Play Fair. Create Original."** – cyan checklist panel (team size 1–3, Figma/Canva/Adobe XD, own laptop + charger, own mobile hotspot – no Wi-Fi/devices provided, reference links submitted with final work) + separate pink warning panel with warning icon and explicit text: plagiarism and generative AI tools (image and layout generators) are strictly prohibited.
7. **Showcase – "Your Creation, on the Board"** – 3 placeholder cards labelled "SAMPLE PLACEHOLDER – not a real submission", short explanation (register first, submit final work after the event) and **TEAM REGISTRATION** button.
8. **FAQ** – 7 accordion items (who can participate, tools, how to register, how to submit, AI tools, equipment, reference links). Answers come only from `design.md`; anything not confirmed says "confirmed by organizers" instead of inventing rules.
9. **Footer** – branding, BVEST '26, "Organized by DAS × ACM" with logos, Rules (`#rules`), Contact, Official Communication Group, social links. Contact / group / social items render **only if a value exists** in `eventInfo.js` (none were provided yet – see Section 14).

Static text for sections 3–9 is stored in `config/eventInfo.js` so copy changes never touch components.

---

## 8. Routing & Guards

| Path | Page | Access |
|---|---|---|
| `/` | LandingPage | public |
| `/register` | TeamRegisterPage | public-only |
| `/login` | TeamLoginPage | public-only |
| `/staff/login` | StaffLoginPage (admin + judge) | public-only |
| `/team` | TeamDashboardPage | role `team` |
| `/team/submission` | SubmissionPage | role `team` |
| `/judge` | JudgeSubmissionsPage | role `judge` |
| `/judge/submissions/:id` | JudgeReviewPage | role `judge` |
| `/judge/reviews` | MyReviewsPage | role `judge` |
| `/admin` | AdminOverviewPage | role `admin` |
| `/admin/teams`, `/admin/teams/:id` | TeamsPage, TeamDetailPage | role `admin` |
| `/admin/submissions`, `/admin/submissions/:id` | SubmissionsPage, SubmissionDetailPage | role `admin` |
| `/admin/judges` | JudgesPage | role `admin` |
| `/admin/announcements` | AnnouncementsPage | role `admin` |
| `/admin/competition` | CompetitionSettingsPage | role `admin` |
| `*` | 404NotFound | public |

- `ProtectedRoute`: requires a valid session; shows `Spinner` while the session loads.
- `RoleRoute`: wrong role → redirected to that user's own home (`roleHome.js`).
- `PublicOnlyRoute`: logged-in users opening `/login` or `/register` go to their home.
- Roles are also enforced by the server; the UI only mirrors it.

---

## 9. Auth & API Layer

**`config/axiosClient.js`**
- `baseURL = VITE_API_URL`.
- Request interceptor adds `Authorization: Bearer <token>`.
- Response interceptor unwraps `response.data.data` and converts failures into one error shape `{ status, message, fieldErrors }` (`fieldErrors` built from `errors[]`, mapping paths like `members[0].email` to form fields). Network failure → "Cannot reach the server. Please try again."
- `401` on an authenticated request → clear token, notify `AuthContext`, redirect to the right login page with a "Session expired" toast. Login/register calls are excluded.
- Uploads: `FormData` with `title`, `description`, repeated `designs` fields; no manual `Content-Type`.

**`AuthContext`** (`user`, `role`, `isAuthenticated`, `isLoading`, `registerTeam`, `loginTeam`, `loginStaff`, `logout`)
- Token kept in `localStorage` (`pp_token`) via `tokenStorage.js`.
- On app start, if a token exists → `GET /auth/me` to restore the user and role; invalid token → cleared.
- Register/login store the token and user immediately.

**API modules** are thin functions (one per endpoint in Section 2) returning unwrapped data; hooks (`useAsync`) provide `data / loading / error / refetch`.

---

## 10. Pages — Behavior & Backend Wiring

### 10.1 Auth pages (`AuthLayout`, same card style)
**TeamRegisterPage** → `POST /auth/team/register`
- Loads `GET /competition`; if `registrationOpen=false` or deadline passed → locked panel (with deadline) instead of the form.
- Fields: team name, college, leader email, password, confirm password (client only), members (leader row prefilled with leader email, read-only email; add/remove rows between `VITE_MIN_TEAM_SIZE` and `VITE_MAX_TEAM_SIZE`; each member: name, email, phone).
- Client validation mirrors backend (required fields, valid emails, password ≥ 6); server field errors are placed under the matching inputs; 409 (duplicate team name/email) and 403 (closed) shown in an Alert.
- Success → confirmation screen (team name, "Registration successful") with **GO TO DASHBOARD** (user is already logged in).

**TeamLoginPage** → `POST /auth/team/login` (leader email + password), link to register, small link to staff login.
**StaffLoginPage** → `POST /auth/staff/login`; redirects admin → `/admin`, judge → `/judge`.

### 10.2 Team area (`DashboardLayout`, sidebar: Dashboard, Submission)
**TeamDashboardPage** → `GET /team/me`, `GET /competition`, `GET /announcements`
- Status cards: Registration (Confirmed badge), Submission (Not submitted / Submitted + time), Submission window (Open / Closed + deadline).
- Registration details: team name, college, leader email, members table.
- Competition updates feed (newest first, with date); empty state if none.
- CTA **SUBMIT DESIGN** (yellow) enabled only when window is open and nothing submitted; otherwise disabled with the reason.

**SubmissionPage** → `GET /submissions/me` (404 = not submitted), `GET /competition`, `POST /submissions`
- Already submitted → read-only view: title, description, submitted time, files (image thumbnails, PDF "open" links, file size), "one submission per team" note. No edit/delete (backend has none).
- Window closed / deadline passed → locked state explaining why.
- Open → form: title (required), description (helper text: include reference links for external assets, icons and inspiration), `FileDropzone` (PNG/JPG/WEBP/PDF, max count and size from env; shows previews, removable items, inline errors). A confirm dialog warns the submission is final. Handles 409/403/400 messages from the server. Success state shows the new submission.

### 10.3 Judge area (sidebar: Submissions, My Reviews)
**JudgeSubmissionsPage** → `GET /judge/submissions`: cards/table with team name, title, submitted time, Reviewed (with score) / Pending badge, client-side filter All / Pending / Reviewed, **REVIEW** button.
**JudgeReviewPage** → `GET /judge/submissions/:id`, `GET /judge/reviews` (to prefill an existing review), `POST /judge/submissions/:id/review`: files viewer + team/submission details on one side; review form (score 0–100, feedback required) on the other; stacked on mobile. Shows "Review submitted" vs "Review updated" from status code 201 / 200. No rubric or criteria are added (none approved yet).
**MyReviewsPage** → `GET /judge/reviews`: table of team, title, score, feedback, last updated.

### 10.4 Admin area (sidebar: Overview, Teams, Submissions, Judges, Announcements, Competition)
- **AdminOverviewPage** – stat cards computed from existing endpoints (total teams from `pagination.total`, submissions count, judges count) + current registration/submission window status, with quick links.
- **TeamsPage** → `GET /admin/teams?page&limit&search`: debounced search (special characters escaped before sending, because the backend builds a regex), pagination, submission status per team (matched from one `GET /admin/submissions` call by team id), delete with confirmation → `DELETE /admin/teams/:id`.
- **TeamDetailPage** → `GET /admin/teams/:id`: team info, members, submission with files.
- **SubmissionsPage** → `GET /admin/submissions`: team name, title, submitted time, review count, average score; client-side search and sort (time / score / team).
- **SubmissionDetailPage** → `GET /admin/submissions/:id`: files, average score, every judge's score and feedback.
- **JudgesPage** → `GET/POST /admin/judges`: list + create form (name, email, password ≥ 6; 409 on duplicate).
- **AnnouncementsPage** → `GET /announcements`, `POST /admin/announcements`, `DELETE /admin/announcements/:id` with confirmation.
- **CompetitionSettingsPage** → `GET /competition`, `PUT /admin/competition`: name, tagline, description, venue, event date, registration toggle + deadline, submission toggle + deadline, rules (one per line). Date inputs converted between `datetime-local` and ISO.

### 10.5 404NotFound
Pixel-style "404 – LEVEL NOT FOUND" with a button back to the right home (landing or the user's dashboard).

### 10.6 Cross-cutting UI states
Every data screen implements loading (Spinner), empty (explains what will appear), error (message + retry) and success (Toast/Alert). Dates formatted with `Intl.DateTimeFormat('en-IN')`.

---

## 11. Responsive Plan

| Area | < 768 px (mobile) | 768–1023 px (tablet) | ≥ 1024 px (desktop) |
|---|---|---|---|
| Navbar | Hamburger menu, full-width register button inside | Condensed links | Full links + register button |
| Hero | Stacked: logo, title, CTAs, facts, Live Quest; art simplified/hidden | Smaller title and art | Text left, art right, tilted title, diagonal band |
| Feature / showcase cards | 1 column | 2 columns | 3 columns |
| Timeline | Vertical | Simplified horizontal | Horizontal dotted line |
| Rules | Stacked panels | Stacked | Two columns |
| Dashboard layout | Sidebar becomes an off-canvas drawer opened from topbar | Drawer | Fixed sidebar (`--sidebar-width`) |
| Tables | Stacked cards (`data-label`) | Table with scroll container | Full table |
| Forms | Single column, 44 px controls | Single / two columns | Two columns where useful |
| Particles | Few, static | Medium | Full (still subtle) |

Rules for all pages: no horizontal scroll (`min-width: 0`, wrapping text, `max-width: 100%` images, wide tables inside `overflow-x: auto`); `100dvh` for full-height layouts; sprites use `image-rendering: pixelated`; essential content readable even if decoration is hidden.

---

## 12. Implementation Phases

**Phase 1 – Foundation**
- Install `react-router-dom`, `axios`; update `vite.config.js`, `index.html`, `netlify.toml`, `public/favicon.svg`; add `VITE_*` values to root `.env`.
- Write `globals.css` (all tokens, reset, fonts, keyframes, utilities), `index.css`, `App.css`.
- `config/` files (`env.js`, `axiosClient.js`, `routes.js`, `navLinks.js`, `eventInfo.js`).
- Done when: dev server runs, fonts load, `GET /api/competition` works through the proxy.

**Phase 2 – Shared UI**
- All `components/ui/*` and `components/pixel/*` (sprites, particles, logo).
- Done when: every component renders from tokens only (no hex values outside `globals.css`).

**Phase 3 – Auth core**
- `features/auth` (API, context, hooks, guards, utils) + `features/common` (toast, hooks, utils).
- `App.jsx` routing with lazy role areas, `PublicLayout`, `AuthLayout`, `DashboardLayout`.
- Done when: login/logout/session restore and route guards work for all three roles.

**Phase 4 – Landing page**
- `AnnouncementStrip`, `Navbar`, `Footer`, hero + all `components/landing/*`, `pages/LandingPage.jsx`, `styles/LandingPage.css`, `pages/404NotFound.jsx`.
- Done when: the design.md §14 acceptance checklist passes and registration status comes from the API.

**Phase 5 – Registration & login pages**
- `TeamRegisterPage`, `TeamLoginPage`, `StaffLoginPage`, `MemberFields`, validators.
- Done when: a team can register, see the confirmation, and log in again.

**Phase 6 – Team dashboard & submission**
- `features/team/*`.
- Done when: dashboard shows real data, announcements, and upload works against the real backend with all error states.

**Phase 7 – Judge area**
- `features/judge/*`.
- Done when: a judge can list, open, score, re-score (update) and see their reviews.

**Phase 8 – Admin area**
- `features/admin/*`.
- Done when: all admin pages manage real data (teams, submissions, judges, announcements, competition).

**Phase 9 – Polish & QA**
- Responsive pass at 360 / 768 / 1024 / 1440 px, keyboard pass, reduced-motion pass, contrast check, `npm run lint`, `npm run build`, Netlify deploy check.

---

## 13. Testing Checklist (with the real backend)

Run: `docker compose up -d` → `cd Backend && npm run seed:admin && npm run dev` → `cd Frontend && npm run dev`.

| # | Scenario | Expected |
|---|---|---|
| 1 | Open `/` | Poster-style hero, status "Registration open" from API |
| 2 | Admin logs in at `/staff/login` | Lands on `/admin` |
| 3 | Admin creates a judge and an announcement | Both appear in lists |
| 4 | Register a team with 3 members | Confirmation screen, then dashboard shows details and announcement |
| 5 | Register duplicate team name/email | Inline/Alert 409 message |
| 6 | Try 4 members | Add button disabled at the max |
| 7 | Admin closes registration | Landing CTA disabled; `/register` shows locked panel |
| 8 | Team opens submission page while closed | Locked state |
| 9 | Admin opens submissions | Upload form appears for the team |
| 10 | Upload PNG/PDF; try `.exe`, oversized file, too many files | First succeeds; others blocked client-side and (if bypassed) show server error |
| 11 | Submit twice | Second attempt shows already-submitted view |
| 12 | Judge logs in, reviews, edits the review | 201 then 200 messages; score visible in list |
| 13 | Admin opens submission | Average score and each judge's feedback visible |
| 14 | Admin deletes team | Team, its submission and reviews disappear |
| 15 | Wrong role URL (team opens `/admin`) | Redirected to `/team` |
| 16 | Remove token / expired token | Redirected to login with "Session expired" |
| 17 | Responsive, keyboard, reduced-motion | No horizontal scroll, all controls reachable, animations off |

---

## 14. Inputs Needed From You (not provided, so nothing was invented)

1. **Contact** (email/phone) for the footer.
2. **Official Communication Group** link (WhatsApp/Discord/etc.).
3. **Social links** (Instagram, LinkedIn, etc.), if any.
4. Confirm **team size 1–3** (and set `MAX_TEAM_SIZE=3` in the root `.env`).
5. Confirm the Section 3 decisions, especially: file-upload submission vs the Google-Form link flow, and static poster details (Oct 22–23, 9 AM, B404, ₹1,00,000) on the landing page.
6. Confirm the **FAQ** answers for eligibility ("Who can participate?") – only organizer-confirmed text will be shown.