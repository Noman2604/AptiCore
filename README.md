# AptiCore 🚀
> **Enterprise-Grade Placement Prep & Aptitude Assessment Platform — 24,600+ Questions Across Quantitative Aptitude, Logical Reasoning, Verbal Ability & Technical Coding**

AptiCore is a modern, high-performance aptitude test preparation and assessment platform engineered for students, universities, and job seekers aiming for top campus placements (TCS, Infosys, Wipro, Amazon, Google, etc.). It features full-screen proctored mock tests, dynamic analytics, gamified XP progression, interactive weekly contests, Excel/CSV bulk question management, verified email security, and comprehensive role-based administrative consoles.

---

## ✨ Features

### 🎓 Student Experience
- **Interactive Landing Page**: Top reading progress bar, 3D mouse-tilt Hero mock test card, continuous recruiter company ticker, and GPU-accelerated scroll reveals.
- **Smart Proctored Test Runner**: Full-screen assessment engine supporting 6 question types (MCQ, MSQ, True/False, Fill in Blank, Numerical, Coding) with persistent countdown timer, section rails, question palette, review flags, negative marking, auto-saving progress, and anti-cheat tab-switch detection.
- **Question Bookmarks & Revision Queue**: Dedicated dashboard bookmark center (`/dashboard/bookmark`) allowing students to filter, search, tags, and practice saved questions with detailed explanations.
- **Deep Performance Analytics**: Topic-by-topic accuracy charts, consistency streak counters, performance trends over time, and focus area recommendations.
- **Gamified Progression & Avatar Borders**: Level up from 1 to 50+ by earning XP through daily streaks, test completions, and unlocking Common, Rare, Epic, Legendary, and Mythic avatar borders (e.g. *Frostfire Harmony*, *Cyber Lotus*, *Solar Phoenix*, *Prismatic Crystal*).
- **Live Leaderboard**: Real-time ranking with podium highlights, tests completed, accuracy percentages, and badges.
- **User Feedback**: Built-in feedback modal allowing students to rate and comment on questions, tests, or platform features.
- **Mobile-First UX**: Responsive collapsible sidebar drawer on tablets/iPads (<1024px) and a sticky mobile action bar for instant test launching.

### 🛡️ Administrative & Platform Governance
- **Question Bank & Bulk Excel Upload**: Create, edit, and duplicate questions with a high-speed multi-stage Excel/CSV bulk upload engine (`.xlsx`, `.xls`, `.csv`) featuring client-side parsing, schema preview, and batch ingestion.
- **Test Creation & Publishing**: Configure custom test durations, negative marking, question pools, randomizations, and passing criteria with server-side pagination, search, and CSV export.
- **Role-Based Access Control (RBAC)**: 3-tier user governance (`user`, `admin`, `super_admin`) with fine-grained policy enforcement.
- **Audit Trails**: Non-repudiation logging of all administrative actions with timestamp, user ID, IP address, and operation payload.
- **Content Moderation & Feedback**: Review user-submitted question error reports and feedback comments with status management and resolution notes.
- **System Settings**: Global maintenance mode, registration toggles, XP rate multipliers, and feature switches.

### 🌐 Security, Production & SEO Readiness
- **Verified Authentication**: Secure signup with 6-digit OTP and 1-click token email verification powered by Nodemailer/SMTP with rate-limited resend cooldowns.
- **Search Engine Optimization**: Page-specific `<title>` & `<meta name="description">` tags, dynamic `robots.txt` generator (`app/robots.ts`), and 19-route dynamic XML sitemap (`app/sitemap.ts`).
- **Social Sharing**: High-contrast 1200x630 Open Graph and Twitter Cards asset (`public/og-image.png`).
- **Privacy & Compliance**: GDPR-ready Cookie consent banner (`components/CookieBanner.tsx`) with localStorage preference memory, and dedicated `/policy`, `/cookies`, and `/terms` legal pages.
- **Analytics**: Google Analytics 4 integration (`components/Analytics.tsx`, `lib/analytics.ts`) with consent gating.
- **Performance Optimization**: Composite page-data APIs (`/api/page-data/*`) to eliminate client waterfall requests, and Next.js modern image pipeline (`image/avif`, `image/webp`).

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design Tokens |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) Primitives |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose 9.x](https://mongoosejs.com/) |
| **Authentication** | JWT (HTTP-Only Secure Cookies) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (12 rounds) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) (SMTP / Gmail App Passwords) |
| **Spreadsheet Engine** | [XLSX (SheetJS)](https://sheetjs.com/) for bulk question import |
| **Validation** | [Zod](https://zod.dev/) + React Hook Form |
| **Visual Charts** | [Recharts](https://recharts.org/) |
| **Motion & Scroll** | CSS GPU Transforms + Native `IntersectionObserver` (`ScrollReveal`) |
| **Theme** | [`next-themes`](https://github.com/pacocoursey/next-themes) (Light / Dark / System) |
| **Notifications** | [`sonner`](https://sonner.emilkowal.ski/) |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Noman2604/AptiCore.git
cd AptiCore
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` in the root directory:
```bash
cp .env.example .env.local
```

Fill in the required configuration keys:
```env
# Application Config
APP_NAME=AptiCore
APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/apticore

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email Service (Nodemailer / SMTP Settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM="AptiCore <your-email@gmail.com>"
EMAIL_VERIFICATION_EXPIRES=24h

# Cloudinary (Optional Profile/Asset Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📂 Project Architecture

```
AptiCore/
|-- app/                         # Next.js App Router (pages, layouts, metadata)
|   |-- layout.tsx               # Root layout with Theme, Sonner, Cookie & Analytics
|   |-- page.tsx                 # Landing page with interactive scroll animations
|   |-- not-found.tsx            # Custom branded 404 page
|   |-- robots.ts                # Dynamic search engine crawler directives
|   |-- sitemap.ts               # Dynamic sitemap generator (19 routes)
|   |-- auth/                    # Login, register, and email verification
|   |   |-- login/               # User authentication
|   |   |-- register/            # Account registration
|   |   `-- verify-email/        # OTP and token email verification
|   |-- dashboard/               # Student portal & test environment
|   |   |-- bookmark/            # Saved question management & practice
|   |   |-- achievements/        # Badges, XP milestones & border unlocks
|   |   |-- analytics/           # Detailed performance insights
|   |   |-- history/             # Past test attempts & review
|   |   |-- leaderboard/         # Real-time competitive rankings
|   |   |-- profile/             # Gamified user profile & avatar editor
|   |   `-- tests/               # Dynamic test runner route
|   |-- admin/                   # Administrative operations console
|   |   |-- questions/           # Question bank & bulk Excel upload
|   |   |-- tests/               # Test configuration & CSV export
|   |   |-- categories/          # Category & subcategory taxonomy
|   |   |-- achievements/        # Achievement reward manager
|   |   |-- feedback/            # User feedback review & moderation
|   |   |-- reports/             # Question error reports review
|   |   `-- users/               # User directory & role governance
|   |-- super-admin/             # System-level administration & audit
|   |   |-- access/              # RBAC policy configuration
|   |   |-- logs/                # Immutable audit log inspection
|   |   `-- settings/            # Platform toggles & XP multipliers
|   `-- api/                     # RESTful API endpoints & route handlers
|-- components/                  # Shared UI components
|   |-- tests/                   # Modular proctored test engine
|   |   |-- runner/              # QuestionCard, Palette, ProctorStrip, Modals
|   |   `-- TestRunner.tsx       # Main test orchestration container
|   |-- history/                 # Test attempt cards & history UI
|   |-- ui/                      # shadcn/ui primitives & GameAvatar borders
|   |-- landing.tsx              # Landing page visual components
|   |-- ScrollReveal.tsx         # GPU-accelerated scroll reveal wrapper
|   |-- AnimatedCounter.tsx      # Smooth numerical count-up easing
|   |-- CookieBanner.tsx         # GDPR cookie consent banner
|   |-- Analytics.tsx            # GA4 tracking script
|   `-- StickyMobileCTA.tsx      # Mobile bottom floating action sheet
|-- lib/                         # Core library, database & models
|   |-- db.ts                    # Cached MongoDB Mongoose connection
|   |-- api.ts                   # Axios instance with credentials
|   |-- mail.ts                  # Nodemailer verification email sender
|   `-- models/                  # Mongoose models (User, Test, Question, Feedback, etc.)
|-- docs/                        # Complete project documentation hub
`-- public/                      # Static assets, favicons, and Open Graph card
```

---

## 📖 Documentation Hub

Detailed documentation is available in the [`docs/`](file:///docs/) directory:

- [**`docs/Architecture.md`**](file:///docs/Architecture.md): System architecture, file structure, proctoring state machine, data flows, and complete API/model references.
- [**`docs/PRD.md`**](file:///docs/PRD.md): Product requirements, user personas, and full feature completion matrix.
- [**`docs/Phases.md`**](file:///docs/Phases.md): Development milestones, phase completion logs, and future roadmap.
- [**`docs/Design.md`**](file:///docs/Design.md): Design tokens, avatar border gamification system, typography stacks, and motion guidelines.
- [**`docs/Rules.md`**](file:///docs/Rules.md): Engineering standards, bulk upload validation, email security, proctoring rules, and coding conventions.
- [**`docs/Memory.md`**](file:///docs/Memory.md): Active development memory log, environment schema, and progress tracker.

---

## 📄 License

This project is licensed under the MIT License.
