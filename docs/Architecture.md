# AptiCore - Architecture Document

## 1. System Architecture Overview

```
Client (Browser)
  -> Next.js 16 App Router
     -> Pages, layouts, components, hooks
     -> Axios client with credentials
     -> API routes
        -> MongoDB via Mongoose
```

## 2. File and Folder Structure

```
AptiCore/
|-- app/                     # Next.js App Router pages
|   |-- layout.tsx           # Root layout
|   |-- page.tsx             # Landing page
|   |-- globals.css          # Global styles
|   |-- about/               # About page
|   |-- blog/                # Blog page
|   |-- careers/             # Careers page
|   |-- categories/          # Category listing
|   |-- community/           # Community page
|   |-- contact/             # Contact page
|   |-- contest/             # Weekly contests page
|   |-- cookies/             # Cookies policy page
|   |-- docs/                # Documentation page
|   |-- guides/              # Guides page
|   |-- help/                # Help page
|   |-- policy/              # Policy page
|   |-- terms/               # Terms page
|   |-- auth/                # Authentication pages
|   |-- dashboard/           # User dashboard
|   |-- admin/               # Admin panel
|   `-- super-admin/         # Super admin panel
|-- components/              # Shared React components
|-- hooks/                   # Custom React hooks
|-- lib/                     # Core library code
|   `-- models/              # Mongoose models
|-- types/                   # Shared TypeScript types
|-- public/                  # Static assets
|-- proxy.ts                 # Development proxy configuration
|-- data.json                # Seed/test data
|-- components.json          # shadcn/ui config
|-- tailwind.config.ts       # Tailwind configuration
|-- next.config.mjs          # Next.js configuration
|-- postcss.config.mjs       # PostCSS config
|-- eslint.config.mjs        # ESLint config
|-- tsconfig.json            # TypeScript config
`-- package.json             # Dependencies and scripts
```

## 3. Data Flow

### Authentication flow
```
Login page -> POST /api/auth/login -> Verify credentials (bcrypt)
-> Generate JWT -> Set HTTP-only cookie -> Redirect to dashboard/admin
```

### Test taking flow
```
Browse categories -> Select test -> Load questions
-> Start timer -> Answer questions -> Submit
-> Calculate score/accuracy -> Save result -> Update XP/leaderboard
```

### Admin content flow
```
Admin login -> Access admin panel -> CRUD questions/tests
-> Changes saved to MongoDB -> Audit log created
-> User dashboard reflects changes
```

## 4. Security Architecture

- Authentication uses JWT in HTTP-only cookies with 7-day expiry
- Passwords are hashed with bcryptjs using 12 salt rounds
- Role-based access uses a 3-tier system: `user`, `admin`, `super_admin`
- API protection uses route-level checks for admin and super-admin endpoints
- Audit trails log admin actions to the AuditLog collection

## 5. Key Design Patterns

- App Router with nested layouts
- Server Components by default, with `"use client"` only for interactive components
- Mongoose singleton with cached DB connection
- Zod validation shared between client and server
- shadcn/ui components with Radix primitives for accessibility
- Dark mode via `next-themes` with system preference detection
