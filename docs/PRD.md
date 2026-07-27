# AptiCore — Product Requirements Document (PRD)

## 1. Product Overview

**AptiCore** (also referred to as AptitudeX internally) is an advanced aptitude test preparation platform designed for Indian engineering students preparing for campus placements. It provides 24,600+ questions across quantitative aptitude, logical reasoning, verbal ability, coding MCQs, SQL, data interpretation, technical MCQs, and HR interview preparation.

**Tagline**: "Crack Your Placement With Confidence"

---

## 2. Target Users

| User Type | Description | Key Needs |
|-----------|------------|-----------|
| **Students** | Engineering students (UG/PG) preparing for placements | Mock tests, performance tracking, leaderboard competition, weak area analysis |
| **Admins** | Content managers and platform operators | Question/test management, user management, result monitoring, analytics |
| **Super Admins** | System operators with full control | User/role management, access policies, audit logs, system settings |

---

## 3. Core Features

### 3.1 For Students

| Feature | Description | Status |
|---------|------------|--------|
| **User Authentication** | Email/password registration & login with JWT | ✅ Complete |
| **Dashboard** | Personalized overview with XP, level, streak, recent results, achievements | ✅ Complete |
| **Category-based Tests** | Browse tests by category, subcategory drilling | ✅ Complete |
| **Test Taking** | Full-screen test runner with timer, question navigation, progress tracking | ✅ Complete |
| **Test Results** | Score, accuracy, time taken, answer review | ✅ Complete |
| **Analytics** | Performance trends, topic accuracy, focus areas, consistency tracking | ✅ Complete |
| **Leaderboard** | Global ranking with XP, accuracy, tests completed | ✅ Complete |
| **Achievements** | Milestone-based rewards (common/rare/epic/legendary) | ✅ Complete |
| **XP & Level System** | Earn XP from tests, streaks, achievements; level up | ✅ Complete |
| **Streak Tracking** | Daily activity streaks with multipliers | ✅ Complete |
| **Profile Management** | Bio, college, degree, location, social links | ✅ Complete |
| **User Settings** | Notifications, privacy, appearance, security/password | ✅ Complete |
| **Activity History** | Test history, XP history, achievement history with pagination | ✅ Complete |
| **Contests** | Live/upcoming/ended weekly contests with countdown timers | ✅ Complete |
| **Bookmarks** | Save questions for later review | ✅ Complete |
| **Reports** | Report incorrect/unclear questions | ✅ Complete |

### 3.2 For Admins

| Feature | Description | Status |
|---------|------------|--------|
| **Admin Dashboard** | Quick overview with user counts, result stats, avg accuracy | ✅ Complete |
| **User Management** | CRUD users, role assignment (user/admin/super_admin), activate/deactivate | ✅ Complete |
| **Question Bank** | CRUD questions with 6 types, category/subcategory assignment, duplicate | ✅ Complete |
| **Test Management** | View/create/edit tests with pagination, filters, CSV export | ✅ Complete |
| **Category Management** | View/create categories with subcategories | ✅ Complete |
| **Results Viewing** | Filter/search test results with pagination, CSV export | ✅ Complete |
| **Reports Review** | View user-submitted reports (pending/resolved/rejected) | ✅ Complete |
| **Leaderboard View** | View global leaderboard with CSV export | ✅ Complete |
| **Analytics** | Charts for accuracy trends, status distribution, top users | ✅ Complete |
| **Settings** | Admin profile viewing | ✅ Complete |

### 3.3 For Super Admins

| Feature | Description | Status |
|---------|------------|--------|
| **Super Admin Dashboard** | System health, stats, activity feed, alerts | ✅ Complete |
| **User Management** | Full user management with role control | ✅ Complete |
| **Admin Management** | Manage admin-level accounts | ⬜ Pending (UI scaffolded) |
| **Access Policies** | Role-based permission management | ⬜ Pending (UI scaffolded) |
| **Audit Logs** | View admin action logs | ⬜ Pending (UI scaffolded) |
| **System Settings** | Feature toggles, XP multipliers, maintenance mode | ⬜ Pending (UI scaffolded) |
| **Analytics** | Cross-tenant analytics | ✅ Complete |

---

## 4. Technical Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.1.7 (App Router) |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS v4 + shadcn/ui components |
| **Database** | MongoDB (Mongoose 9.x ODM) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Forms** | React Hook Form + Zod validation |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **UI Components** | Radix UI primitives, Lucide icons |
| **Theme** | next-themes (dark/light) |
| **Notifications** | sonner (toast) |

---

## 5. Database Models

| Model | Description |
|-------|------------|
| **User** | Authentication, roles (user/admin/super_admin) |
| **UserProfile** | Extended profile data, XP, level, streaks |
| **Category** | Test/question categories with slugs |
| **Subcategory** | Nested subcategories under categories |
| **Question** | 6 question types, options, difficulty, marks |
| **Test** | Test configuration with question assignments |
| **Result** | User test attempts with answers, scores |
| **Achievement** | Achievement definitions with criteria |
| **UserAchievement** | User-achievement unlock tracking |
| **Leaderboard** | User ranking with XP, accuracy |
| **XPHistory** | XP transaction log |
| **Bookmark** | User question bookmarks |
| **Contest** | Weekly contest definitions |
| **ContestRegistration** | Contest participant tracking |
| **Report** | Question/content/user reports |
| **SystemSettings** | Platform configuration |
| **AccessPolicy** | Role-permission mappings |
| **AuditLog** | Admin action audit trail |

---

## 6. API Routes

| Route | Purpose |
|-------|---------|
| `/api/auth/*` | Login, register, logout, me |
| `/api/categories` | Category CRUD |
| `/api/subcategories` | Subcategory management |
| `/api/questions` | Question CRUD |
| `/api/tests` | Test CRUD and listing |
| `/api/results` | User test results |
| `/api/profile` | User profile CRUD |
| `/api/leaderboard` | Global leaderboard |
| `/api/achievements/*` | Achievement definitions and user progress |
| `/api/xp-history` | XP transaction log |
| `/api/bookmarks` | User bookmarks |
| `/api/admin/*` | Admin-specific endpoints |
| `/api/super-admin/*` | Super admin endpoints |

