# AptiCore - Architecture Document

## 1. System Architecture Overview

```
Client (Browser)
  -> Next.js 16 App Router
     -> Dynamic Routes, Layouts, Server & Client Components
     -> Motion & Interaction Layer (ScrollReveal, AnimatedCounter, 3D Tilt)
     -> Proctored Test Engine (Modular Runner, ProctorStrip, Tab-Switch Detector)
     -> Gamification Engine (GameAvatar borders, XP streaks, Achievement badges)
     -> Consent & Analytics Layer (CookieBanner, Google Analytics 4)
     -> Axios Client with HTTP-Only Cookie Authentication
     -> High-Speed Ingestion Pipeline (Excel / CSV parsing via SheetJS)
     -> Composite Data Layer (/api/page-data/*)
     -> Next.js Route Handlers (API Endpoints)
        -> MongoDB via Mongoose ODM (Cached Connection Singleton)
        -> Nodemailer SMTP Service (OTP & Verification Tokens)
        -> Cloudinary Asset Delivery (Avatars & Attachments)
```

## 2. File and Folder Structure

```
AptiCore/
|-- app/                         # Next.js App Router pages, layouts, and metadata
|   |-- layout.tsx               # Root layout (Theme, Sonner, CookieBanner, Analytics, OG)
|   |-- page.tsx                 # Landing page with dynamic scroll animations & ticker
|   |-- not-found.tsx            # Custom 404 page with search suggestions
|   |-- robots.ts                # Dynamic robots.txt crawler directives
|   |-- sitemap.ts               # Dynamic XML sitemap generator (19 routes)
|   |-- globals.css              # Global styles & CSS variable design tokens
|   |-- about/                   # About AptiCore page
|   |-- blog/                    # Blog and placement prep insights
|   |-- careers/                 # Careers and hiring portal
|   |-- categories/              # Category and test browsing
|   |-- community/               # Student discussion and community hub
|   |-- contact/                 # Contact page with corporate address & phone
|   |-- contest/                 # Weekly live/upcoming contests
|   |-- cookies/                 # Cookies policy page
|   |-- docs/                    # Platform documentation page
|   |-- guides/                  # Student interview preparation guides
|   |-- help/                    # Help center and FAQ
|   |-- policy/ & privacy/       # Privacy policy routes
|   |-- terms/                   # Terms of service page
|   |-- thank-you/               # Post-submission thank you page
|   |-- auth/                    # Authentication sub-tree
|   |   |-- login/               # Sign-in page with validation
|   |   |-- register/            # Account registration with password meter
|   |   `-- verify-email/        # OTP and token email verification flow
|   |-- dashboard/               # Student portal & test environment
|   |   |-- layout.tsx           # Dashboard layout with responsive drawer sidebar
|   |   |-- page.tsx             # Overview (XP, streak, recent tests, recommendations)
|   |   |-- bookmark/            # Saved question management & revision practice
|   |   |-- achievements/        # Badges, XP milestones & border unlocks
|   |   |-- analytics/           # Deep performance graphs & topic mastery
|   |   |-- history/             # Past test attempts & attempt detail modals
|   |   |-- leaderboard/         # Real-time competitive global rankings
|   |   |-- profile/             # Gamified user profile & avatar border selector
|   |   `-- tests/               # Dynamic test runner route ([slug]/[subSlug])
|   |-- admin/                   # Administrative operations console
|   |   |-- layout.tsx           # Admin shell with role authorization
|   |   |-- page.tsx             # Operational overview & KPIs
|   |   |-- questions/           # Question bank & bulk Excel/CSV upload
|   |   |-- tests/               # Test configuration, pagination & CSV export
|   |   |-- categories/          # Category & subcategory taxonomy manager
|   |   |-- achievements/        # Achievement reward creation & configuration
|   |   |-- feedback/            # User feedback moderation & sentiment tracking
|   |   |-- reports/             # Question error reports review & resolution
|   |   `-- users/               # User directory & role governance
|   |-- super-admin/             # System-level governance panel
|   |   |-- access/              # RBAC policy assignment
|   |   |-- logs/                # Immutable audit log inspection
|   |   |-- settings/            # System-wide toggles & maintenance mode
|   |   `-- analytics/           # Cross-platform business metrics
|   `-- api/                     # RESTful API route handlers
|       |-- auth/                # login, register, logout, me, verify-email, resend
|       |-- admin/               # questions, bulk-upload, tests, users, logs, settings
|       |-- super-admin/         # access, analytics, overview
|       |-- dashboard/           # overview, analytics, history, achievements
|       |-- page-data/           # Composite zero-waterfall preload endpoints
|       |-- questions/           # Question fetching and user reports
|       |-- results/             # submit, save-progress, mark-abandoned
|       |-- bookmarks/           # CRUD for student saved questions
|       |-- feedback/            # Student feedback & ratings
|       |-- achievements/        # Achievement definitions & user claims
|       `-- xp-history/          # Detailed gamification activity trail
|-- components/                  # Shared React components
|   |-- tests/                   # Test engine architecture
|   |   |-- runner/              # Modular test subcomponents
|   |   |   |-- QuestionCard.tsx        # Render MCQ, MSQ, Coding, Fill-in, etc.
|   |   |   |-- QuestionPalette.tsx     # Color-coded navigation grid & status
|   |   |   |-- ProctorStrip.tsx        # Timer, violations counter, fullscreen toggle
|   |   |   |-- TestSectionRail.tsx     # Tabbed section navigation
|   |   |   |-- SubmitConfirmModal.tsx  # Summary dialog before final submission
|   |   |   |-- WarningModal.tsx        # Anti-cheat tab switch warning modal
|   |   |   `-- MobileBottomBar.tsx     # Mobile-optimized test controls
|   |   `-- TestRunner.tsx       # Main proctored test container & state machine
|   |-- history/                 # History components
|   |   `-- TestAttemptCard.tsx  # In-depth attempt breakdown card
|   |-- ui/                      # Radix primitives & custom UI components
|   |   |-- game-avatar.tsx      # Gamified avatar frames & rarity styling
|   |   `-- sidebar.tsx          # Base sidebar primitive
|   |-- landing.tsx              # Landing page component suite
|   |-- Navbar.tsx               # Global navigation with mobile drawer
|   |-- Footer.tsx               # Global footer with verified corporate info
|   |-- dashboardSidebar.tsx     # Responsive collapsible sidebar (drawer <1024px)
|   |-- ScrollReveal.tsx         # GPU-accelerated IntersectionObserver reveals
|   |-- AnimatedCounter.tsx      # Smooth numerical count-up easing
|   |-- CookieBanner.tsx         # GDPR cookie consent banner
|   |-- Analytics.tsx            # Google Analytics 4 tracking script
|   `-- StickyMobileCTA.tsx      # Mobile floating bottom action sheet
|-- hooks/                       # Custom React hooks
|   |-- use-mobile.ts            # Responsive breakpoint hook (1024px threshold)
|   `-- use-toast.ts             # Toast notification hook
|-- lib/                         # Core library code
|   |-- models/                  # 21 Mongoose schemas & TypeScript models
|   |-- db.ts                    # MongoDB connection with HMR caching singleton
|   |-- api.ts                   # Axios instance with credentials
|   |-- mail.ts                  # Nodemailer verification email dispatch
|   |-- jwt.ts                   # JWT token generation & verification
|   |-- tokens.ts                # Cryptographic OTP & token generators
|   |-- audit.ts                 # AuditLog recording utility
|   |-- cloudinary.ts            # Cloudinary asset upload client
|   |-- analytics.ts             # Google Analytics event tracking utility
|   `-- index.ts                 # Zod validation schemas & shared helpers
|-- types/                       # Shared TypeScript interfaces & types
`-- public/                      # Static assets, favicons, and Open Graph card
```

## 3. Core Data & Execution Flows

### 3.1 Authentication & Email Verification Flow
```
Registration Form -> POST /api/auth/register
  -> Validate input (Zod) -> Hash password (bcryptjs 12 rounds)
  -> Generate 6-digit OTP & 32-byte cryptographic token (lib/tokens.ts)
  -> Create User (isEmailVerified: false, expires: 24h)
  -> Dispatch verification email (lib/mail.ts via SMTP)
  -> Redirect user to /auth/verify-email?email=...
     |
     +--> [Option A: Manual OTP] -> POST /api/auth/verify-email { email, otp }
     |
     +--> [Option B: 1-Click Link] -> GET /auth/verify-email?token=... -> Auto-verifies
  -> Verify token & expiration -> Mark isEmailVerified = true
  -> Issue JWT cookie -> Redirect to /dashboard
```

### 3.2 Proctored Test Taking & Auto-Save Flow
```
Category Selection -> Start Test -> Mount TestRunner.tsx
  -> Fetch test structure & question pool
  -> Enforce fullscreen & initialize countdown timer
  -> Event Listeners: visibilitychange / blur triggers ProctorStrip tab-switch warning
  -> Candidate answers questions (MCQ, MSQ, Coding, Fill-in, etc.)
  -> Periodic / On-demand Auto-Save -> POST /api/results/save-progress
  -> If abandoned / timeout -> POST /api/results/mark-abandoned
  -> On Submit -> SubmitConfirmModal -> POST /api/results
  -> Backend evaluates answers -> Computes score, accuracy, section breakdown
  -> Award XP -> Update streak in UserProfile -> Create XPHistory record
  -> Check & unlock Achievements -> Recalculate Leaderboard rank
  -> Redirect to /dashboard/history with detailed analysis
```

### 3.3 Bulk Question Upload Pipeline (Excel / CSV)
```
Admin uploads .xlsx / .xls / .csv file in /admin/questions
  -> Client-side FileReader reads buffer -> SheetJS (xlsx) parses rows
  -> Multi-stage validation:
     - Question text present (>5 chars)
     - Valid type (mcq, msq, boolean, fill_blank, numerical, coding)
     - Minimum 2 options for choice questions
     - Correct answer matching options
     - Points, difficulty, category & subcategory resolution
  -> POST /api/admin/questions/bulk-upload/parse (validates schema & returns preview)
  -> Admin reviews valid rows count, warnings, and error items
  -> Admin clicks Confirm -> POST /api/admin/questions/bulk-upload/confirm
  -> Batch insert questions into MongoDB -> Create AuditLog entry
```

### 3.4 Student Question Bookmark & Revision Queue Flow
```
During test / review -> Click Bookmark icon -> POST /api/bookmarks
  -> Save Bookmark (userId, questionId, tags, notes)
Dashboard -> Navigate to /dashboard/bookmark
  -> Load all bookmarked questions with categories and subcategories
  -> Filter by difficulty, subject, search query, or custom tags
  -> Practice Mode: answer bookmarked questions directly with instant explanations
  -> Remove or update notes via DELETE / PATCH /api/bookmarks/[id]
```

### 3.5 Feedback & Error Reporting Pipeline
```
Student clicks "Feedback" or "Report Question"
  -> Submits rating, sentiment, and description -> POST /api/feedback or /api/question-reports
  -> Admin enters /admin/feedback or /admin/reports
  -> Filters pending / resolved items -> Updates status and appends adminNotes
  -> AuditLog record created for all resolutions
```

## 4. Database Models Reference (21 Models)

| Model | Schema File | Purpose |
|---|---|---|
| **User** | `lib/models/user.ts` | Base user auth, email verification tokens, role, isActive |
| **UserProfile** | `lib/models/UserProfile.ts` | Gamified stats (XP, level, streaks), education records, avatar border |
| **Category** | `lib/models/Category.ts` | Top-level aptitude domains (Quantitative, Logical, Verbal, Technical) |
| **Subcategory** | `lib/models/Subcategory.ts` | Granular topics (Percentages, Syllogisms, Speed & Distance, Arrays) |
| **Question** | `lib/models/Question.ts` | 6 question types, options, correct answers, hints, explanations |
| **Test** | `lib/models/Test.ts` | Test configuration, question pool, duration, passing marks, negative marks |
| **Result** | `lib/models/Result.ts` | Student attempt record, answers, score, accuracy, time spent, status |
| **Achievement** | `lib/models/Achievement.ts` | System achievement definitions, criteria types, XP rewards, rarity |
| **UserAchievement** | `lib/models/UserAchievement.ts` | Unlocked achievements per user with timestamp |
| **XPHistory** | `lib/models/XPHistory.ts` | Granular audit trail of XP earned (test completion, streak, bonus) |
| **Leaderboard** | `lib/models/Leaderboard.ts` | Precomputed user standings, accuracy, tests completed, rank |
| **Bookmark** | `lib/models/Bookmark.ts` | Saved questions per user with custom revision tags and notes |
| **Feedback** | `lib/models/Feedback.ts` | User ratings, comments, target types (question, test, platform), status |
| **QuestionReport** | `lib/models/QuestionReport.ts` | Question defect reports with admin resolution workflows |
| **Report** | `lib/models/Report.ts` | General platform error reports |
| **Contest** | `lib/models/Contest.ts` | Weekly competitive contests with countdowns and leaderboards |
| **ContestRegistration** | `lib/models/ContestRegistration.ts` | Contest candidate signups |
| **AccessPolicy** | `lib/models/AccessPolicy.ts` | Role-permission mappings for dynamic RBAC |
| **AuditLog** | `lib/models/AuditLog.ts` | Administrative action audit trail (IP, user, action, target) |
| **SystemSettings** | `lib/models/SystemSettings.ts` | Global configuration (maintenance mode, XP multipliers, registration) |

## 5. API Routes Reference

### Authentication & Account
| Route | Methods | Description |
|---|---|---|
| `/api/auth/register` | `POST` | User registration & dispatch verification email |
| `/api/auth/login` | `POST` | User login & set HTTP-only JWT cookie |
| `/api/auth/logout` | `POST` | Clear auth cookie and session |
| `/api/auth/me` | `GET` | Return authenticated user identity & role |
| `/api/auth/verify-email` | `POST` | Verify email via 6-digit OTP or cryptographic token |
| `/api/auth/resend-verification` | `POST` | Resend verification email with rate-limiting cooldown |

### Student Portal & Tests
| Route | Methods | Description |
|---|---|---|
| `/api/dashboard/overview` | `GET` | Dashboard summary (XP, streak, recent results) |
| `/api/dashboard/analytics` | `GET` | Detailed performance analytics & charts |
| `/api/dashboard/history` | `GET` | Paginated attempt history |
| `/api/dashboard/achievements` | `GET` | User achievement progress and unlocked borders |
| `/api/tests` | `GET` | List available tests with category filters |
| `/api/tests/[id]` | `GET` | Fetch single test with question pool |
| `/api/results` | `POST`, `GET` | Submit completed test attempt / list results |
| `/api/results/save-progress` | `POST` | Auto-save interim test progress |
| `/api/results/mark-abandoned` | `POST` | Mark incomplete/abandoned test attempt |
| `/api/results/[id]` | `GET` | Fetch detailed result breakdown |
| `/api/bookmarks` | `GET`, `POST` | List and create question bookmarks |
| `/api/bookmarks/[id]` | `PATCH`, `DELETE` | Update notes or delete question bookmark |
| `/api/feedback` | `POST` | Submit student feedback or platform comment |
| `/api/feedback/[id]` | `GET` | Retrieve specific feedback item |
| `/api/profile` | `GET`, `PUT` | View or update student profile & avatar border |
| `/api/leaderboard` | `GET` | Global rankings and podium users |

### Administrative & Super-Admin Console
| Route | Methods | Description |
|---|---|---|
| `/api/admin/overview` | `GET` | Admin metrics (total users, tests, accuracy) |
| `/api/admin/questions` | `GET`, `POST` | Question bank CRUD |
| `/api/admin/questions/bulk-upload/parse` | `POST` | Validate & preview Excel/CSV questions |
| `/api/admin/questions/bulk-upload/confirm` | `POST` | Batch insert parsed questions into MongoDB |
| `/api/admin/tests` | `GET`, `POST` | Test CRUD with pagination and CSV export |
| `/api/admin/categories` | `GET`, `POST` | Category and subcategory taxonomy manager |
| `/api/admin/achievements` | `GET`, `POST` | Achievement criteria and reward management |
| `/api/admin/feedback` | `GET`, `PATCH` | Moderate user feedback and reply with notes |
| `/api/admin/reports` | `GET`, `PATCH` | Review and resolve question error reports |
| `/api/admin/users` | `GET`, `PATCH` | User directory and role modifications |
| `/api/admin/logs` | `GET` | View administrative audit logs |
| `/api/admin/settings` | `GET`, `PUT` | System settings and platform toggles |
| `/api/super-admin/overview` | `GET` | High-level system statistics |
| `/api/super-admin/analytics` | `GET` | Advanced platform usage analytics |
| `/api/super-admin/access` | `GET`, `PUT` | Role-permission access policies |

### Composite Optimization Layer
| Route | Methods | Description |
|---|---|---|
| `/api/page-data/dashboard` | `GET` | Composite preload payload for instant student dashboard mount |
| `/api/page-data/analytics` | `GET` | Composite payload for analytics charts |
| `/api/page-data/history` | `GET` | Composite payload for history tab |
| `/api/page-data/achievements` | `GET` | Composite payload for achievements grid |
| `/api/page-data/admin/overview` | `GET` | Consolidated KPIs for admin panel |
| `/api/page-data/super-admin/overview`| `GET` | Consolidated KPIs for super-admin panel |

## 6. Security & Integrity Architecture

- **Authentication**: JWT signed with HS256, stored in HTTP-only, SameSite cookies with 7-day expiry.
- **Email Security**: Cryptographically secure 6-digit OTP codes and 32-byte hexadecimal tokens with 24-hour expiration and 60-second resend cooldowns.
- **Password Security**: Salted and hashed using `bcryptjs` with 12 computational rounds.
- **Role-Based Access Control**: 3-tiered permission checks (`user`, `admin`, `super_admin`) executed at middleware and route-handler boundaries.
- **Proctoring Integrity**: Client-side visibility and window focus listeners detect tab switching and surface warning alerts, while automated background saving prevents student progress loss during network fluctuations.
- **Audit Trails**: Non-repudiation logging in the `AuditLog` collection records administrative actions with actor ID, IP address, and payload snapshot.
- **Input Sanitization**: Client and server-side request payloads validated strictly against Zod schemas.
