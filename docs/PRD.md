# AptiCore - Product Requirements Document (PRD)

## 1. Product Overview

**AptiCore** is an enterprise-grade aptitude test preparation and assessment platform designed specifically for engineering students and job candidates preparing for competitive campus recruitment drives (TCS, Infosys, Wipro, Amazon, Google, etc.). It features 24,600+ questions spanning Quantitative Aptitude, Logical Reasoning, Verbal Ability, Coding MCQs, SQL, and Data Interpretation.

**Tagline**: "Master Your Placement Prep With Confidence"

## 2. Target Users & Stakeholders

| User Role | Description | Key Needs |
|---|---|---|
| **Students** | Engineering students (UG/PG) and job aspirants | Full-screen timed mock tests, performance analytics, revision bookmark queues, gamified XP progression, interactive weekly contests |
| **Admins** | Content curators and academic moderators | High-speed Excel/CSV question bulk upload, test configuration, user role management, feedback moderation, report resolution |
| **Super Admins** | System administrators and platform operators | Access policy configuration, immutable audit logs, global maintenance mode, XP rate multipliers, cross-platform metrics |

## 3. Core Feature Scope & Status

### 3.1 Student Experience

| Feature | Description | Status |
|---|---|---|
| **Verified Authentication** | Email/password registration with 6-digit OTP and 1-click token email verification via SMTP | Complete |
| **Student Dashboard** | Personalized overview with level, streak, XP progress bar, recent test attempts, and recommended focus areas | Complete |
| **Category-Based Tests** | Categorized test navigation across Quantitative, Logical, Verbal, and Technical subjects | Complete |
| **Proctored Test Runner** | Modular full-screen test engine with section rails, color-coded question palette, countdown timer, and tab-switch detection | Complete |
| **Auto-Save & Abandon Recovery** | Background progress saving (`/api/results/save-progress`) and incomplete test detection (`/api/results/mark-abandoned`) | Complete |
| **In-Depth Attempt Review** | Granular test analytics card (`TestAttemptCard`) showing marks, accuracy, time taken, and question-by-question review | Complete |
| **Performance Analytics** | Recharts-driven accuracy trends, topic breakdown, consistency calendar, and weakest topic diagnostics | Complete |
| **Question Bookmarks & Revision** | Dedicated revision center (`/dashboard/bookmark`) to filter, search, practice, and annotate saved questions | Complete |
| **Gamified Avatar Borders** | Dynamic profile avatar frames (`game-avatar.tsx`) with 10 unlockable tiers (Standard, Frostfire, Valkyrie, Cyber Lotus, etc.) | Complete |
| **XP & Level Progression** | Level 1–50+ scaling formula with XP rewards from tests, streaks, and milestone achievements | Complete |
| **Live Competitive Leaderboard** | Real-time global standings with podium highlights, tests taken, accuracy metrics, and direct profile navigation | Complete |
| **Achievement Badges** | Milestone badges with Common, Rare, Epic, and Legendary rarity tiers and social sharing | Complete |
| **Feedback Submission** | In-app feedback system for students to rate questions, tests, or platform features with sentiment tags | Complete |
| **Interactive Motion & Scroll** | 3D Hero card mouse-tilt, top reading bar, company ticker marquee, and GPU-accelerated `ScrollReveal` | Complete |
| **Mobile & Tablet Optimization** | Off-canvas drawer sidebar on viewports <1024px, and sticky bottom floating CTA sheet on mobile devices | Complete |
| **Contests Hub** | Weekly live, upcoming, and completed contests with countdown timers and candidate registration | Complete |

### 3.2 Administrative Console

| Feature | Description | Status |
|---|---|---|
| **Admin Dashboard** | Operational overview with platform stats, test completion metrics, and user growth charts | Complete |
| **Question Bank Management** | CRUD operations for 6 question types, category/subcategory tagging, search, and duplication | Complete |
| **Bulk Excel / CSV Upload** | Client-side parsing (SheetJS), schema preview, validation warnings, and batch confirm insertion | Complete |
| **Test Orchestration** | Create and configure tests with passing marks, negative marking, duration, and question pools | Complete |
| **Test List & CSV Export** | Server-side paginated test table with multi-parameter search, status filtering, and CSV export | Complete |
| **Category & Subcategory Manager** | Hierarchical taxonomy management with icon and slug controls | Complete |
| **Achievement Management** | Admin interface to configure achievement criteria, XP rewards, icons, and rarity tiers | Complete |
| **Feedback Moderation** | Review user-submitted ratings and platform suggestions with status toggles and admin notes | Complete |
| **Question Report Resolution** | Review user-flagged question discrepancies (typos, invalid keys) with resolution status workflows | Complete |
| **User Directory & RBAC** | User listing, search, status toggle (active/inactive), and role upgrades (`user`, `admin`) | Complete |

### 3.3 Super-Admin Governance

| Feature | Description | Status |
|---|---|---|
| **Super-Admin Overview** | System health, database connection status, error alerts, and cross-platform activity | Complete |
| **Access Policy Engine** | Role-permission mappings to configure fine-grained API and UI access boundaries | Complete |
| **Immutable Audit Logs** | Real-time audit trail capturing all administrative actions with timestamp, user ID, IP address, and payload | Complete |
| **Platform System Settings** | Global toggles for maintenance mode, registration locks, and XP point rate multipliers | Complete |
| **Enterprise Analytics** | Deep cross-tenant analytical reporting on user retention, exam completion rates, and platform usage | Complete |

---

## 4. Technical Specifications

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.1.7 (App Router with Server & Client Components) |
| **Language** | TypeScript 5.9 (Strict Mode) |
| **Styling** | Tailwind CSS v4 + Semantic CSS Custom Variables + shadcn/ui primitives |
| **Database** | MongoDB with Mongoose 9.x ODM (HMR-cached connection singleton) |
| **Authentication** | JWT (HS256) stored in HTTP-Only, SameSite cookies + bcryptjs (12 salt rounds) |
| **Email Verification** | Nodemailer SMTP (Gmail App Passwords / Custom SMTP) with 6-digit OTP & 32-byte tokens |
| **Spreadsheet Engine** | XLSX (SheetJS) for client-side Excel/CSV parsing and data transformation |
| **Data Fetching & Preload** | Composite Page-Data APIs (`/api/page-data/*`) to eliminate client waterfall requests |
| **Validation** | Zod schemas shared across API boundary and React Hook Form client forms |
| **Visual Charts** | Recharts (ResponsiveContainer, AreaChart, BarChart, PieChart) |
| **Motion & Scroll** | CSS GPU Transforms + Native `IntersectionObserver` (`ScrollReveal`) |
| **Theme Engine** | `next-themes` (Dark / Light / System) with zero flash of unstyled content |
| **Toasts** | `sonner` rich notifications |
| **Analytics & SEO** | GA4 integration with cookie-consent gating + dynamic `robots.ts` & `sitemap.ts` |
| **Image Optimization** | Next.js Image Optimization (`image/avif`, `image/webp`) |

---

## 5. Database Models (21 Models)

| Model | Collection | Primary Responsibility |
|---|---|---|
| **User** | `users` | Base account credentials, role (`user`/`admin`/`super_admin`), verification tokens |
| **UserProfile** | `userprofiles` | Gamified stats (totalXP, level, streaks), education records, avatar border ID |
| **Category** | `categories` | High-level aptitude subjects (Quantitative, Logical, Verbal, Technical) |
| **Subcategory** | `subcategories` | Topic breakdown under categories (Percentages, Syllogisms, Speed, Arrays) |
| **Question** | `questions` | Question content, 6 question types, options, solutions, hints, difficulty, marks |
| **Test** | `tests` | Test definitions, assigned question pools, time limits, passing & negative marks |
| **Result** | `results` | Student exam submissions, question-by-question responses, score, accuracy, timing |
| **Achievement** | `achievements` | Achievement definitions, criteria types (score, streak, tests, accuracy), XP reward |
| **UserAchievement**| `userachievements`| User achievement completion records with unlocked timestamp |
| **XPHistory** | `xphistories` | Granular audit trail of XP earned per activity (test completion, streaks, bonuses) |
| **Leaderboard** | `leaderboards` | Cached rank index with user details, total XP, accuracy, and tests taken |
| **Bookmark** | `bookmarks` | Saved questions per user with custom revision tags and annotations |
| **Feedback** | `feedbacks` | User ratings, comments, target types (question, test, platform), moderation status |
| **QuestionReport** | `questionreports` | User-reported question discrepancies with resolution workflows |
| **Report** | `reports` | General platform error reports |
| **Contest** | `contests` | Scheduled weekly competitive tests with start/end windows and prizes |
| **ContestRegistration**| `contestregistrations`| Candidate registrations for upcoming contests |
| **AccessPolicy** | `accesspolicies` | Dynamic role-to-permission mapping rules |
| **AuditLog** | `auditlogs` | Non-repudiation audit trail of admin mutations (IP, actor, action, timestamp) |
| **SystemSettings** | `systemsettings` | Global platform settings (maintenance mode, XP multipliers, registration) |

---

## 6. Complete API Route Catalog

| Group | Route | Purpose |
|---|---|---|
| **Auth** | `/api/auth/register` | Create account & send verification email |
| **Auth** | `/api/auth/login` | Authenticate & issue HTTP-only JWT cookie |
| **Auth** | `/api/auth/logout` | Clear auth session |
| **Auth** | `/api/auth/me` | Return active user session & profile |
| **Auth** | `/api/auth/verify-email` | Validate 6-digit OTP code or cryptographic token |
| **Auth** | `/api/auth/resend-verification`| Resend verification code with cooldown rate-limit |
| **Student** | `/api/dashboard/overview` | Fetch user dashboard KPIs |
| **Student** | `/api/dashboard/analytics` | Fetch performance graphs and topic breakdown |
| **Student** | `/api/dashboard/history` | Paginated attempt history |
| **Student** | `/api/dashboard/achievements` | User achievements and unlocked avatar borders |
| **Student** | `/api/tests` & `[id]` | Browse tests and load question pool |
| **Student** | `/api/results` & `[id]` | Submit test attempt & view comprehensive review |
| **Student** | `/api/results/save-progress` | Periodic auto-save during active test session |
| **Student** | `/api/results/mark-abandoned`| Auto-flag abandoned or timed-out test attempts |
| **Student** | `/api/bookmarks` & `[id]` | Manage saved questions and revision tags |
| **Student** | `/api/feedback` & `[id]` | Submit platform feedback or question comments |
| **Student** | `/api/profile` | Update profile details and avatar border styling |
| **Student** | `/api/leaderboard` | View global top ranking candidates |
| **Admin** | `/api/admin/questions/bulk-upload/parse` | Parse and validate uploaded Excel/CSV files |
| **Admin** | `/api/admin/questions/bulk-upload/confirm` | Batch insert validated questions into MongoDB |
| **Admin** | `/api/admin/questions` & `[id]` | Create, update, duplicate, or delete questions |
| **Admin** | `/api/admin/tests` & `[id]` | Configure tests with pagination and CSV export |
| **Admin** | `/api/admin/categories` | Manage categories and subcategories |
| **Admin** | `/api/admin/achievements` | Configure achievement requirements and XP rewards |
| **Admin** | `/api/admin/feedback` | Moderate student feedback and post admin notes |
| **Admin** | `/api/admin/reports` | Resolve question defect reports |
| **Admin** | `/api/admin/users` & `[id]` | Manage user status and permissions |
| **Admin** | `/api/admin/logs` | Inspect system audit trail |
| **Super-Admin** | `/api/super-admin/overview` | High-level system statistics |
| **Super-Admin** | `/api/super-admin/analytics` | Advanced usage metrics |
| **Super-Admin** | `/api/super-admin/access` | RBAC access policies |
| **Optimization**| `/api/page-data/*` | Preload composite data for instant tab transitions |
| **SEO** | `/robots.txt` & `/sitemap.xml`| Dynamic search engine crawl directives & 19-route sitemap |
