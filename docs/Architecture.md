# AptiCore — Architecture Document

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Pages   │  │  Layouts  │  │  Components │  │  Hooks   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │              │        │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐  │
│  │                    Axios / fetch                       │  │
│  └────────────────────────┬───────────────────────────────┘  │
└───────────────────────────┼───────────────────────────────────┘
                            │ HTTP (withCredentials)
┌───────────────────────────┼───────────────────────────────────┐
│                    Next.js Server (App Router)                 │
│  ┌────────────────────────┴──────────────────────────────┐   │
│  │                    API Routes                          │   │
│  │  /api/auth/*  /api/questions  /api/tests  /api/admin/* │   │
│  └────────────────────────┬──────────────────────────────┘   │
│                           │                                   │
│  ┌────────────────────────┴──────────────────────────────┐   │
│  │              Mongoose ODM (9.x)                        │   │
│  └────────────────────────┬──────────────────────────────┘   │
└───────────────────────────┼───────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │   MongoDB     │
                    └───────────────┘
```

---

## 2. File & Folder Structure

```
AptiCore/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, ThemeProvider)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles (Tailwind v4 + shadcn)
│   │
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── contest/                  # Weekly contests page
│   │
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   │
│   ├── dashboard/                # User dashboard (protected)
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Main dashboard
│   │   ├── tests/                # Browse and take tests
│   │   ├── analytics/            # Performance analytics
│   │   ├── achievements/         # Achievement badges
│   │   ├── history/              # Activity history
│   │   ├── leaderboard/          # Global rankings
│   │   ├── profile/              # User profile
│   │   └── settings/             # User preferences
│   │
│   ├── admin/                    # Admin panel (protected)
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── analytics/            # Admin analytics with charts
│   │   ├── categories/           # Category management
│   │   ├── leaderboard/          # Leaderboard view
│   │   ├── questions/            # Question bank CRUD
│   │   ├── reports/              # Report review
│   │   ├── results/              # Test results
│   │   ├── settings/             # Admin settings
│   │   ├── tests/                # Test management
│   │   │   └── new/              # Create new test
│   │   └── users/                # User management
│   │
│   └── super-admin/              # Super admin panel (protected)
│       ├── layout.tsx            # Super admin layout
│       ├── page.tsx              # Super admin dashboard
│       ├── access/               # Access policy (scaffolded)
│       ├── admins/               # Admin management (scaffolded)
│       ├── analytics/            # Analytics
│       ├── logs/                 # Audit logs (scaffolded)
│       ├── settings/             # System settings (scaffolded)
│       └── users/                # User management
│
├── components/                   # Shared React components
│   ├── landing.tsx               # Landing page hero
│   ├── Navbar.tsx                # Public navigation
│   ├── Footer.tsx                # Public footer
│   ├── dashboardSidebar.tsx      # User dashboard sidebar
│   ├── Searchfilter.tsx          # Search/filter utility
│   ├── Skeletons.tsx             # Loading skeletons
│   ├── theme-provider.tsx        # Theme context
│   │
│   ├── admin/
│   │   └── Sidebar.tsx           # Admin sidebar navigation (mirrors super-admin shell)
│   │
│   ├── super-admin/
│   │   └── Sidebar.tsx           # Super admin sidebar
│   │
│   ├── tests/
│   │   └── TestRunner.tsx        # Test taking interface
│   │
│   └── ui/                       # shadcn/ui components (auto-generated)
│       ├── button.tsx, card.tsx, dialog.tsx, input.tsx, ...
│       ├── table.tsx, tabs.tsx, select.tsx, badge.tsx, ...
│       └── ... (30+ components)
│
├── hooks/                        # Custom React hooks
│   └── use-toast.ts              # Toast notification hook
│
├── lib/                          # Core library code
│   ├── api.ts                    # Axios instance configuration
│   ├── db.ts                     # MongoDB connection with caching
│   ├── jwt.ts                    # JWT generation & verification
│   ├── audit.ts                  # Audit log helper
│   ├── index.ts                  # Zod validation schemas
│   ├── utils.ts                  # Utility functions
│   ├── dummy-data.ts             # Static data for landing page
│   ├── test-platform.ts          # Test slug utilities
│   │
│   └── models/                   # Mongoose models (17 models)
│       ├── index.ts              # Model exports
│       ├── user.ts
│       ├── UserProfile.ts
│       ├── Category.ts
│       ├── Subcategory.ts
│       ├── Question.ts
│       ├── Test.ts
│       ├── Result.ts
│       ├── Achievement.ts
│       ├── UserAchievement.ts
│       ├── Leaderboard.ts
│       ├── XPHistory.ts
│       ├── Bookmark.ts
│       ├── Contest.ts
│       ├── ContestRegistration.ts
│       ├── Report.ts
│       ├── SystemSettings.ts
│       ├── AccessPolicy.ts
│       └── AuditLog.ts
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Shared types
│   └── auth.ts                   # JWT payload types
│
├── public/                       # Static assets
│   ├── image.png
│   └── logo.png
│
├── proxy.ts                      # Development proxy configuration
├── data.json                     # Seed/test data
├── components.json               # shadcn/ui config
├── tailwind.config.ts            # Tailwind configuration
├── next.config.mjs               # Next.js configuration
├── postcss.config.mjs            # PostCSS config
├── eslint.config.mjs             # ESLint config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies & scripts
└── TODO.md                       # Current tasks
```

---

## 3. Data Flow

### Authentication Flow
```
Login Page → POST /api/auth/login → Verify credentials (bcrypt) 
→ Generate JWT → Set HTTP-only cookie → Redirect to dashboard/admin
```

### Test Taking Flow
```
Browse categories → Select test → Load questions → 
Start timer → Answer questions → Submit → 
Calculate score/accuracy → Save result → Update XP/leaderboard
```

### Admin Content Flow
```
Admin login → Access admin panel → CRUD questions/tests → 
Changes saved to MongoDB → Audit log created → 
User dashboard reflects changes
```

---

## 4. Security Architecture

- **Authentication**: JWT-based with HTTP-only cookies (7-day expiry)
- **Password Hashing**: bcryptjs with 12 salt rounds
- **Role-based Access**: 3-tier role system (user → admin → super_admin)
- **API Protection**: Middleware-level role checks on admin/super-admin routes
- **Audit Trails**: All admin actions logged to AuditLog collection

---

## 5. Key Design Patterns

- **App Router**: Next.js 15+ App Router with nested layouts
- **Server Components**: Default, with `"use client"` for interactive pages
- **Mongoose Singleton**: Cached DB connection to prevent connection flooding
- **Zod Validation**: Shared schemas between client and server
- **shadcn/ui**: Component library with Radix primitives for accessibility
- **Dark Mode**: next-themes with system preference detection

