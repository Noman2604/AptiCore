# AptiCore — Design System

## 1. Color Palette

### Brand Colors (Tailwind `brand-*`)

| Token | Hex | Usage |
|-------|-----|-------|
| brand-50 | `#f0f9ff` | Light backgrounds |
| brand-100 | `#e0f2fe` | Hover states |
| brand-200 | `#bae6fd` | Borders |
| brand-300 | `#7dd3fc` | Active states |
| brand-400 | `#38bdf8` | Accent text, icons |
| brand-500 | `#0ea5e9` | **Primary brand color** |
| brand-600 | `#0284c7` | Button hover |
| brand-700 | `#0369a1` | Active pressed |
| brand-800 | `#075985` | Deep accents |
| brand-900 | `#0c4a6e` | Dark backgrounds |
| brand-950 | `#082f49` | Darkest |

### Accent Colors (Tailwind `accent-*`)

| Token | Hex | Usage |
|-------|-----|-------|
| accent-50 | `#fdf4ff` | Light backgrounds |
| accent-500 | `#d946ef` | **Secondary accent** |
| accent-600 | `#c026d3` | Hover/active |

### Semantic CSS Variables (from `globals.css`)

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Card backgrounds |
| `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Card text |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Primary UI elements |
| `--secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Secondary surfaces |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Secondary text |
| `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Accent surfaces |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Borders/dividers |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus rings |
| `--radius` | `0.625rem` | `0.625rem` | Border radius base |

### Semantic Colors

| Purpose | Light Hex | Dark Hex |
|---------|-----------|----------|
| Success/Easy | `#22c55e` (emerald-500) | Same |
| Warning/Medium | `#f59e0b` (amber-500) | Same |
| Error/Hard | `#ef4444` (red-500) | Same |
| Info | `#0ea5e9` (sky-500) | Same |
| Purple/Epic | `#a855f7` | Same |
| Gold/Legendary | `#eab308` | Same |

---

## 2. Theme

### Dark Mode
- Default: `system` (follows OS preference)
- Toggle via `next-themes` with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`
- Dark mode uses `.dark` class on `<html>` element
- All custom CSS variables have both `:root` and `.dark` overrides

### Key Dark Mode Features
- Background: `oklch(0.145 0 0)` (near-black)
- Cards: Slightly lighter (`oklch(0.205 0 0)`)
- Borders: `rgba(255,255,255,0.1)`
- Glass effects: `rgba(0,0,0,0.2)` with `backdrop-filter: blur(12px)`

---

## 3. Typography

### Font Stack

| Family | Usage | Source |
|--------|-------|--------|
| **Syne** | Headings (h1-h6) | Google Fonts |
| **DM Sans** | Body text | Google Fonts |
| **JetBrains Mono** | Code/monospace | Google Fonts |

### CSS Custom Properties

```css
--font-heading: var(--font-sans);  /* Syne */
--font-sans: "DM Sans", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;
```

### Font Sizes

| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| h1 (Hero) | `text-7xl` (4.5rem) | `text-5xl` (3rem) | 800 (extrabold) |
| h2 (Section) | `text-4xl` (2.25rem) | `text-3xl` (1.875rem) | 700 (bold) |
| h3 (Card) | `text-xl` (1.25rem) | `text-lg` (1.125rem) | 600 (semibold) |
| Body | `text-base` (1rem) | `text-sm` (0.875rem) | 400 (normal) |
| Small/Meta | `text-sm` (0.875rem) | `text-xs` (0.75rem) | 400 (normal) |
| Caption | `text-xs` (0.75rem) | `text-[10px]` | 400 (normal) |

### Special Text Styles

| Style | Implementation |
|-------|---------------|
| **Gradient Text** | `.gradient-text` class: `linear-gradient(135deg, #0ea5e9, #d946ef)` |
| **Gold Gradient** | `.gradient-text-gold` class: `linear-gradient(135deg, #f59e0b, #ef4444)` |
| **Heading Font** | `.font-display` class (Syne font family) |
| **Mono/Special** | `.font-mono` class (JetBrains Mono) |

---

## 4. Spacing & Layout

### Container Sizes
- **Max content**: `max-w-7xl` (80rem / 1280px)
- **Wide content**: `max-w-5xl` (64rem / 1024px)
- **Form containers**: `max-w-105` (26.25rem / 420px)
- **Narrow content**: `max-w-2xl` (42rem / 672px)

### Common Spacing
- Section padding: `py-20` (5rem / 80px)
- Card padding: `p-6` (1.5rem / 24px)
- Grid gaps: `gap-6` (1.5rem / 24px)
- Stack spacing: `space-y-4` (1rem / 16px)
- Page padding: `px-4 sm:px-6 lg:px-8`

### Border Radius
- Base: `--radius: 0.625rem` (10px)
- sm: `calc(var(--radius) * 0.6)` (6px)
- md: `calc(var(--radius) * 0.8)` (8px)
- lg: `var(--radius)` (10px)
- xl: `calc(var(--radius) * 1.4)` (14px)
- 2xl: `calc(var(--radius) * 1.8)` (18px)
- 3xl: `calc(var(--radius) * 2.2)` (22px)
- 4xl: `calc(var(--radius) * 2.6)` (26px)

---

## 5. Shadows & Effects

### Box Shadows
| Name | Value |
|------|-------|
| `shadow-glow-brand` | `0 0 30px rgba(14, 165, 233, 0.4)` |
| `shadow-glow-accent` | `0 0 30px rgba(217, 70, 239, 0.4)` |
| `shadow-card` | `0 4px 24px rgba(0, 0, 0, 0.15)` |
| `shadow-card-hover` | `0 8px 40px rgba(0, 0, 0, 0.25)` |
| `shadow-inner-glow` | `inset 0 1px 0 rgba(255,255,255,0.1)` |

### Glow Effects
| Class | Description |
|-------|-------------|
| `.glow-blue` | `0 0 30px rgba(14, 165, 233, 0.3)` |
| `.glow-purple` | `0 0 30px rgba(217, 70, 239, 0.3)` |
| `.glow-green` | `0 0 30px rgba(34, 197, 94, 0.3)` |

### Special Effects
- **Glassmorphism**: `.glass` class with `backdrop-filter: blur(12px)`
- **Grid background**: `.grid-bg` class with 40px grid pattern
- **Shimmer loading**: `.shimmer` class with animated gradient
- **Noise overlay**: `.noise-overlay::before` pseudo-element
- **Card hover**: `.card-hover` class with `translateY(-4px)` transform

---

## 6. Animations

### Tailwind Keyframes
| Animation | Duration | Description |
|-----------|----------|-------------|
| `animate-fade-in` | 0.5s | Fade in from opacity 0 |
| `animate-slide-up` | 0.5s | Slide up 30px |
| `animate-slide-in-right` | 0.3s | Slide from right 20px |
| `animate-pulse-slow` | 3s | Slow pulse |
| `animate-float` | 6s | Float up/down 20px |
| `animate-glow` | 2s | Glow intensity oscillation |
| `animate-shimmer` | 2s | Shimmer sweep |
| `animate-count-up` | 1s | Count-up effect |
| `animate-spin-slow` | 8s | Slow rotation |
| `animate-bounce-soft` | 2s | Subtle bounce 8px |

### Page Transitions
- Entry animation: `.page-enter` with `animate-slideUp 0.4s ease-out`

---

## 7. Badge/Status Colors

| Type | Class | Colors |
|------|-------|--------|
| Easy | `.badge-easy` | `bg-emerald-500/10 text-emerald-500 border-emerald-500/20` |
| Medium | `.badge-medium` | `bg-amber-500/10 text-amber-500 border-amber-500/20` |
| Hard | `.badge-hard` | `bg-red-500/10 text-red-500 border-red-500/20` |

### Rank Colors
| Rank | Class | Color |
|------|-------|-------|
| Gold (1st) | `.rank-gold` | `#f59e0b` |
| Silver (2nd) | `.rank-silver` | `#94a3b8` |
| Bronze (3rd) | `.rank-bronze` | `#b45309` |

### Achievement Rarity
| Rarity | Card Border | Text Color |
|--------|-------------|------------|
| Common | `from-slate-500/20 to-slate-500/5` | `text-slate-400` |
| Rare | `from-sky-500/20 to-sky-500/5` | `text-sky-400` |
| Epic | `from-purple-500/20 to-purple-500/5` | `text-purple-400` |
| Legendary | `from-yellow-500/20 to-yellow-500/5` | `text-yellow-400` |

---

## 8. Responsive Breakpoints

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large |

---

## 9. Background Gradients

| Gradient Name | Definition |
|---------------|------------|
| `hero-gradient` | `linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #7c3aed 100%)` |
| `card-gradient` | `linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(217,70,239,0.1) 100%)` |
| `shimmer-gradient` | `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)` |
| `grid-pattern` | `radial-gradient(circle, rgba(14,165,233,0.15) 1px, transparent 1px)` |

