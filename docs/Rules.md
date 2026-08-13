# AptiCore - Development Rules & Guidelines

## 1. Technology Constraints

### Must use
- Next.js 16 (App Router); do not use the Pages Router
- TypeScript in strict mode
- Tailwind CSS v4 with `@import "tailwindcss"`
- shadcn/ui components from `components/ui/`
- Lucide React for icons
- Mongoose 9.x for MongoDB ODM
- Axios for HTTP client (`lib/api.ts` instance with `withCredentials`)
- Zod for form and API validation (`lib/index.ts`)
- `next-themes` for dark mode support
- `sonner` for toast notifications
- Recharts for charts and analytics

### Must not use
- Plain CSS files for app styling; use Tailwind utility classes or CSS modules only
- Context API for global state
- Any UI library other than shadcn/ui + Radix primitives
- REST libraries other than Axios
- Class components
- `any` types unless a very narrow escape hatch is unavoidable and documented
- Inline styles

## 2. Code Style and Structure

### Component rules
- Include `"use client"` only for interactive components that need it
- Prefer named exports for components
- Co-locate component types and interfaces with the component file
- Keep components under 400 lines when practical; extract subcomponents when needed
- Use descriptive variable names and avoid abbreviations

### File naming
- Pages: `page.tsx`
- Layouts: `layout.tsx`
- Components: PascalCase, for example `TestRunner.tsx`
- Libraries: camelCase, for example `db.ts`, `utils.ts`
- Models: PascalCase, for example `UserProfile.ts`

### Import order
1. React and Next.js imports
2. Third-party libraries
3. Internal components
4. Internal libraries
5. Types
6. CSS last

## 3. Error Handling

### API routes
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
} catch (err: unknown) {
  const message =
    err && typeof err === "object" && "response" in err
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error || "Network error"
      : "Network error"
  toast.error(message)
}
```

### Never
- Swallow errors silently
- Expose stack traces to the client
- Use `console.log` for debugging; use `console.error` for errors

## 4. Database Rules

### Connection
- Always use the cached connection from `lib/db.ts`
- Never create a new connection per request
- Handle connection errors gracefully

### Models
- Export TypeScript interfaces for documents
- Use `mongoose.models.ModelName || mongoose.model(...)` to prevent HMR issues
- Index frequently queried fields
- Use enum validation for string fields with limited values
- Set reasonable defaults for optional fields

### Schema design
```typescript
const schema = new Schema({
  field: {
    type: String,
    required: [true, "Error message"],
    trim: true,
    maxlength: [100, "Cannot exceed 100 characters"],
  },
})
```

## 5. API Conventions

### Response format
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

## 6. AI Assistant Rules

### When making changes
1. Read the full file before editing
2. Understand the context: imports, types, and existing patterns
3. Make minimal, targeted changes
4. Never break existing functionality
5. Follow existing code patterns exactly

### When creating pages
1. Check if layout exists (`layout.tsx`) and reuse it
2. Check sidebar/components and reuse them
3. Follow UI patterns from existing pages
4. Use shadcn/ui components from `components/ui/`
5. Handle loading, empty, and error states

### Prohibited AI actions
- Do not rewrite entire files without permission
- Do not change dependencies in `package.json` without asking
- Do not modify `tailwind.config.ts` without understanding the existing config
- Do not remove existing features
- Do not use placeholder data; connect to real APIs

## 7. Performance Rules

- Use `useMemo` and `useCallback` for expensive computations
- Implement pagination for lists such as users, questions, tests, and results
- Debounce search inputs or use controlled inputs with client-side filtering
- Use Next.js `<Image>` for optimized images
- Keep bundle size small; lazy load heavy components where possible

## 8. UI and UX Consistency

- Dark mode: all pages must support dark/light theme via `next-themes`
- Color scheme: use CSS variables from `globals.css`
- Gradients: use the `.gradient-text` class for gradient text
- Cards: use the `.card-hover` class for hover effects on cards
- Glassmorphism: use the `.glass` class for glass effects
- Animations: use predefined Tailwind classes like `animate-fade-in` and `animate-slide-up`
- Responsive: all pages must work on mobile, tablet, and desktop
