# AptiCore — Development Rules & Guidelines

## 1. Technology Constraints

### MUST USE
- **Next.js 16** (App Router) — Do not use Pages Router
- **TypeScript** — Strict mode (`tsconfig.json: strict: true`)
- **Tailwind CSS v4** with `@import "tailwindcss"` syntax
- **shadcn/ui** components from `components/ui/` directory
- **Lucide React** for icons
- **Mongoose 9.x** for MongoDB ODM
- **Axios** for HTTP client (`lib/api.ts` instance with `withCredentials`)
- **Zod** for form/API validation (`lib/index.ts`)
- **next-themes** for dark mode support
- **sonner** for toast notifications
- **Recharts** for charts/analytics

### MUST NOT USE
- ❌ Plain CSS files — Use Tailwind utility classes or CSS modules only
- ❌ Context API for global state — Use prop drilling or server components
- ❌ Any UI library other than shadcn/ui + Radix primitives
- ❌ REST libraries other than Axios
- ❌ Class components — Use functional components with hooks
- ❌ `any` types — Use proper TypeScript types/interfaces
- ❌ Inline styles — Use Tailwind classes

---

## 2. Code Style & Structure

### Component Rules
- Always include `"use client"` directive for interactive components
- Use named exports for components (avoid default exports)
- Co-locate component types/interfaces within the component file
- Keep components under 400 lines; extract sub-components
- Use descriptive variable names; avoid abbreviations

### File Naming
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx`
- **Components**: PascalCase (e.g., `TestRunner.tsx`)
- **Libraries**: camelCase (e.g., `db.ts`, `utils.ts`)
- **Models**: PascalCase (e.g., `UserProfile.ts`)

### Imports Order
```
1. React/Next.js imports
2. Third-party libraries (axios, lucide, recharts, etc.)
3. Internal components (@/components/*)
4. Internal libraries (@/lib/*)
5. Types (@/types/*)
6. CSS (last)
```

---

## 3. Error Handling

### API Routes
```typescript
try {
  // ... operation
  return NextResponse.json({ success: true, data })
} catch (error) {
  console.error("Operation failed:", error)
  return NextResponse.json(
    { success: false, error: "Human-readable error message" },
    { status: 500 }
  )
}
```

### Client-side
```typescript
try {
  const { data } = await api.post("/endpoint", payload)
  // handle success
} catch (err: any) {
  const message = err?.response?.data?.error || "Network error"
  toast.error(message)
}
```

### Never
- ❌ Swallow errors silently
- ❌ Expose stack traces to the client
- ❌ Use `console.log` for debugging (use `console.error` for errors)

---

## 4. Database Rules

### Connection
- Always use the cached connection from `lib/db.ts`
- Never create a new connection per request
- Handle connection errors gracefully

### Models
- Always export TypeScript interfaces for documents
- Use `mongoose.models.ModelName || mongoose.model(...)` pattern to prevent Hot Module Reload (HMR) issues
- Index frequently queried fields
- Use enum validation for string fields with limited values
- Set reasonable defaults for all optional fields

### Schema Design
```typescript
const schema = new Schema({
  field: {
    type: String,
    required: [true, "Error message"],
    trim: true,
    maxlength: [100, "Cannot exceed 100 characters"],
  }
})
```

---

## 5. API Conventions

### Response Format
```typescript
// Success
{ success: true, data: {...}, meta?: { total: number } }

// Error
{ success: false, error: "Message" }
```

### Naming
- Use RESTful conventions: `GET /api/users`, `POST /api/users`, etc.
- Use kebab-case for multi-word routes: `/api/xp-history`
- Use query params for filtering: `?limit=30&offset=0&status=completed`

### Auth
- Protected routes check JWT from HTTP-only cookie
- Role-based access at the API route level
- Admin routes prefix: `/api/admin/*`
- Super admin routes prefix: `/api/super-admin/*`

---

## 6. AI Assistant Rules

### When Making Changes
1. Read the full file before editing
2. Understand the context (imports, types, existing patterns)
3. Make minimal, targeted changes
4. Never break existing functionality
5. Follow existing code patterns exactly

### When Creating Pages
1. Check if layout exists (`layout.tsx`) — reuse it
2. Check sidebar/components — reuse them
3. Follow UI patterns from existing pages
4. Use shadcn/ui components from `components/ui/`
5. Handle loading, empty, error states

### Prohibited AI Actions
- ❌ Do NOT rewrite entire files without permission
- ❌ Do NOT change dependencies in `package.json` without asking
- ❌ Do NOT modify `tailwind.config.ts` without understanding all existing config
- ❌ Do NOT remove existing features
- ❌ Do NOT use placeholder data — connect to real APIs

---

## 7. Performance Rules

- Use `useMemo` and `useCallback` for expensive computations
- Implement pagination for lists (users, questions, tests, results)
- Debounce search inputs (or use controlled inputs with client-side filtering)
- Use Next.js `<Image>` component for optimized images
- Keep bundle size small — lazy load heavy components where possible

---

## 8. UI/UX Consistency

- **Dark mode**: All pages must support dark/light theme via `next-themes`
- **Color scheme**: Use CSS variables from `globals.css` (e.g., `hsl(var(--foreground))`)
- **Gradients**: Use the `.gradient-text` class for gradient text
- **Cards**: Use the `.card-hover` class for hover effects on cards
- **Glassmorphism**: Use the `.glass` class for glass effects
- **Animations**: Use predefined Tailwind classes like `animate-fade-in`, `animate-slide-up`
- **Responsive**: All pages must work on mobile, tablet, and desktop

