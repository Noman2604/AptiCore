# TODO: Create `/api/stats` Landing Page Stats Endpoint

- [x] 1. Plan approved by user
- [x] 2. Create `app/api/stats/route.ts` with GET handler
  - [x] Use `connectDB()`
  - [x] Query `User.countDocuments({ role: "user", isActive: true })` for `totalUsers`
  - [x] Query `Question.countDocuments({ isActive: true })` for `totalQuestions`
  - [x] Query `Test.countDocuments({ isPublished: true })` for `totalTests`
  - [x] Static `companiesCovered: 85`
  - [x] Return `{ success: true, data: { ... } }` following existing patterns
- [x] 3. API is consumed by `components/landing.tsx` — no changes needed, it already fetches from `/api/stats`

