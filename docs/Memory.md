# AptiCore - Memory and Progress Tracker

> Last updated: September 19, 2026  
> Current phase: Phase 9, Security, Bulk Operations & Proctoring Suite (Complete)  
> Build status: Active development & Production Ready  
> System Specs: Standardized in `docs/` (`Architecture.md`, `PRD.md`, `Rules.md`, `Phases.md`, `Design.md`)

## Overall Progress

| Area | Completion | Status |
|---|---|---|
| Authentication & Email Verification | 100% | Complete |
| User Dashboard & Revision Center | 100% | Complete |
| Content Models & Database (21 Models) | 100% | Complete |
| Proctored Test Engine (Modular Runner) | 100% | Complete |
| Question Bank & Bulk Excel/CSV Import | 100% | Complete |
| Admin Panel & Feedback Moderation | 100% | Complete |
| Super Admin Governance & Audit Logs | 100% | Complete |
| Bookmarks & Practice Mode | 100% | Complete |
| Contests Framework | 85% | Active (Weekly countdowns ready; live participation pending) |
| Analytics, Benchmark Diagnostics & Tracking | 100% | Complete |
| Gamification & Avatar Customization | 100% | Complete |
| Design System, Micro-Interactions & UX | 100% | Complete |
| SEO, Privacy & Production Readiness | 100% | Complete |

## Project Structure

### App Routes
| Route | Purpose | Status |
|---|---|---|
| `/` | Landing page with 3D tilt, reading bar & scroll animations | Complete |
| `/about` | About AptiCore | Complete |
| `/blog` | Placement preparation blog | Complete |
| `/careers` | Career openings | Complete |
| `/categories` | Subject directory | Complete |
| `/community` | Student community | Complete |
| `/contact` | Contact page with verified address & phone | Complete |
| `/contest` | Weekly contests with live/upcoming timers | Complete |
| `/cookies` | Cookie policy | Complete |
| `/docs` | Documentation hub | Complete |
| `/guides` | Student interview preparation guides | Complete |
| `/help` | Help center & FAQ | Complete |
| `/policy` & `/privacy` | Privacy policy pages | Complete |
| `/terms` | Terms of service | Complete |
| `/thank-you` | Post-submission confirmation page | Complete |
| `/auth/login` | Student & admin login | Complete |
| `/auth/register` | Account registration with password meter | Complete |
| `/auth/verify-email` | OTP input & 1-click token email verification | Complete |
| `/dashboard` | Student dashboard overview & benchmarks | Complete |
| `/dashboard/bookmark` | Dedicated question bookmarking & practice queue | Complete |
| `/dashboard/achievements` | Badges, XP milestones & border unlocks | Complete |
| `/dashboard/analytics` | Topic mastery & candidate trajectory graphs | Complete |
| `/dashboard/history` | Past test attempt cards & review modals | Complete |
| `/dashboard/leaderboard` | Real-time global rankings & podium | Complete |
| `/dashboard/profile` | Gamified profile & avatar border editor | Complete |
| `/dashboard/tests/*` | Proctored test execution route | Complete |
| `/admin/*` | Operational admin console (tests, questions, feedback, reports, users) | Complete |
| `/super-admin/*` | Governance console (access policies, audit logs, system settings) | Complete |
| `/robots.txt` | Dynamic robots directives (`app/robots.ts`) | Complete |
| `/sitemap.xml` | Dynamic XML sitemap covering 19 endpoints (`app/sitemap.ts`) | Complete |
| `/*` (404) | Custom interactive not-found page (`app/not-found.tsx`) | Complete |

### API Routes
| Route Group | Purpose | Status |
|---|---|---|
| `/api/auth/*` | login, register, logout, me, verify-email, resend-verification | Complete |
| `/api/categories/*` | Category listing, CRUD, and subcategories | Complete |
| `/api/subcategories/*` | Subcategory hierarchy management | Complete |
| `/api/questions/*` | Question CRUD and defect report submission | Complete |
| `/api/admin/questions/bulk-upload/*` | Excel/CSV multi-stage parse, validation & confirm insertion | Complete |
| `/api/tests/*` | Test configuration and question pool loading | Complete |
| `/api/results/*` | Submit results, save-progress auto-save, mark-abandoned | Complete |
| `/api/bookmarks/*` | Question bookmarks CRUD and revision tags | Complete |
| `/api/feedback/*` | Student feedback submission and admin moderation | Complete |
| `/api/profile/*` | Profile update, avatar selection, and image uploads | Complete |
| `/api/leaderboard` | Real-time global leaderboard index | Complete |
| `/api/achievements/*` | System achievements and user unlock progress | Complete |
| `/api/xp-history` | Granular XP activity audit log | Complete |
| `/api/page-data/*` | Composite preload endpoints for zero-waterfall tab loads | Complete |
| `/api/admin/*` | Admin overview, questions, tests, users, feedback, reports, logs | Complete |
| `/api/super-admin/*` | Super-admin overview, analytics, access policies, audit logs | Complete |

## Completed Architectural Deliverables

### 1. Authentication & Email Security
- Full JWT authentication with HTTP-only, secure, SameSite cookies.
- Account signup with 6-digit OTP and 32-byte cryptographic token generation.
- Verification emails dispatched via Nodemailer SMTP with 60s resend cooldown.
- Dedicated `/auth/verify-email` interface supporting both manual OTP entry and 1-click URL auto-verification.

### 2. High-Throughput Question Ingestion (Bulk Upload)
- High-performance client and server spreadsheet parser using SheetJS (`xlsx`).
- Multi-format support: `.xlsx`, `.xls`, and `.csv`.
- Two-stage pipeline: `/api/admin/questions/bulk-upload/parse` (schema validation, option extraction, error warnings) followed by `/confirm` (atomic batch insertion into MongoDB).
- Automatic category/subcategory matching and error highlighting.

### 3. Modular Proctored Test Engine
- Componentized architecture in `components/tests/runner/`:
  - `QuestionCard`: 6 question types with interactive radio/checkbox/text/code inputs.
  - `QuestionPalette`: Real-time status indicators (Answered, Unanswered, Marked for Review).
  - `ProctorStrip`: Countdown timer, anti-cheat tab-switch warning counter, fullscreen toggle.
  - `TestSectionRail`: Tabbed subject navigation for sectional exams.
  - `SubmitConfirmModal`: Pre-submission summary dialog.
  - `WarningModal`: Tab-switch / window blur violation popup.
- Automated interim progress saving (`/api/results/save-progress`) to prevent progress loss.
- Abandoned test tracking (`/api/results/mark-abandoned`).

### 4. Student Question Bookmark & Revision Queue
- Dedicated `/dashboard/bookmark` page.
- Filter saved questions by subject, difficulty, custom tags, or keyword search.
- Interactive Revision Practice Mode: solve saved questions with instant explanation reveals.
- Inline annotation notes and bookmark deletion.

### 5. Gamified Avatar Borders System
- Profile customization suite in `components/ui/game-avatar.tsx`.
- 10 distinct animated SVG/CSS frames (*Standard, Frostfire Harmony, Valkyrie Wings, Cyber Lotus, Abyssal Shallows, Solar Phoenix, Mecha Sentinel, Gladiator Legion, Prismatic Crystal, Golden Lion*).
- 5 rarity tiers (Common, Rare, Epic, Legendary, Mythic) unlocked via levels, streaks, and challenges.

### 6. User Feedback & Content Moderation
- Student rating and comment modal for questions, tests, or platform features.
- Admin feedback review console (`app/admin/feedback/page.tsx`) with status toggles (pending, published, hidden, resolved) and resolution notes.
- Question error reporting workflow (`lib/models/QuestionReport.ts`, `app/admin/reports/page.tsx`).

### 7. Performance & SEO Optimizations
- Composite Page-Data layer (`/api/page-data/*`) to eliminate client-side waterfall latency.
- Dynamic `robots.txt` and 19-route `sitemap.xml`.
- Branded 1200x630 Open Graph / Twitter Cards sharing asset (`public/og-image.png`).
- Full favicon suite (`favicon.ico` 4.7KB, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`).
- Modern AVIF & WebP image formats enabled in `next.config.mjs`.

## Remaining Roadmap

### Contests (Phase 10)
- Synchronized live contest participation engine with automated question release and countdown clocks.
- Admin contest scheduling interface with automated prize and badge allocation.
- WebRTC webcam-based proctoring integration for high-stakes placement exams.

## Environment Variables Reference

```bash
# Application Config
APP_NAME=AptiCore
APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/apticore

# Authentication
JWT_SECRET=your-secure-jwt-secret-key-here

# Email Verification (Nodemailer / SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM="AptiCore <your-email@gmail.com>"
EMAIL_VERIFICATION_EXPIRES=24h

# Cloudinary (Optional Asset & Avatar Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Documentation Hub Index

| File | Description |
|---|---|
| `PRD.md` | Product requirements, stakeholder roles, and feature completion matrix |
| `Architecture.md` | System architecture, directory structure, data flows, and complete model/API reference |
| `Rules.md` | Engineering guidelines, bulk upload validation, email security, and coding conventions |
| `Phases.md` | Development roadmap, phase completion logs, and future initiatives |
| `Design.md` | Design tokens, avatar border gamification system, typography, and motion guidelines |
| `Memory.md` | This file - active memory, environment schema, and progress tracker |
| `skill.md` | UI/UX design intelligence reference |
