# AptiCore - Design System

## 1. Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| brand-50 | `#f0f9ff` | Light backgrounds |
| brand-100 | `#e0f2fe` | Hover states |
| brand-200 | `#bae6fd` | Borders |
| brand-300 | `#7dd3fc` | Active states |
| brand-400 | `#38bdf8` | Accent text and icons |
| brand-500 | `#0ea5e9` | Primary brand color |
| brand-600 | `#0284c7` | Button hover |
| brand-700 | `#0369a1` | Active pressed |
| brand-800 | `#075985` | Deep accents |
| brand-900 | `#0c4a6e` | Dark backgrounds |
| brand-950 | `#082f49` | Darkest |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| accent-50 | `#fdf4ff` | Light backgrounds |
| accent-500 | `#d946ef` | Secondary accent |
| accent-600 | `#c026d3` | Hover or active |

### Semantic CSS Variables

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
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Borders and dividers |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus rings |
| `--radius` | `0.625rem` | `0.625rem` | Border radius base |

### Semantic Colors

| Purpose | Light Hex | Dark Hex |
|---------|-----------|----------|
| Success / Easy | `#22c55e` | Same |
| Warning / Medium | `#f59e0b` | Same |
| Error / Hard | `#ef4444` | Same |
| Info | `#0ea5e9` | Same |
| Purple / Epic | `#a855f7` | Same |
| Gold / Legendary | `#eab308` | Same |

## 2. Theme

### Dark Mode
- Default: `system`
- Toggle via `next-themes` with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`
- Dark mode uses the `.dark` class on `<html>`
- Custom CSS variables have both `:root` and `.dark` overrides

### Key Dark Mode Features
- Background: `oklch(0.145 0 0)`
- Cards: `oklch(0.205 0 0)`
- Borders: `rgba(255,255,255,0.1)`
- Glass effects: `rgba(0,0,0,0.2)` with `backdrop-filter: blur(12px)`

## 3. Typography

### Font Stack

| Family | Usage | Source |
|--------|-------|--------|
| Syne | Headings | Google Fonts |
| DM Sans | Body text | Google Fonts |
| JetBrains Mono | Code and monospace | Google Fonts |

### CSS Custom Properties

```css
--font-heading: var(--font-sans);
--font-sans: "DM Sans", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;
```

### Font Sizes

| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| h1 | `text-7xl` | `text-5xl` | 800 |
| h2 | `text-4xl` | `text-3xl` | 700 |
| h3 | `text-xl` | `text-lg` | 600 |
| Body | `text-base` | `text-sm` | 400 |
| Small / Meta | `text-sm` | `text-xs` | 400 |
| Caption | `text-xs` | `text-[10px]` | 400 |

### Special Text Styles

| Style | Implementation |
|-------|----------------|
| Gradient Text | `.gradient-text` class with `linear-gradient(135deg, #0ea5e9, #d946ef)` |
| Gold Gradient | `.gradient-text-gold` class |
| Heading Font | `.font-display` class |
| Mono / Special | `.font-mono` class |

## 4. Spacing and Layout

### Container Sizes
- Max content: `max-w-7xl`
- Wide content: `max-w-5xl`
- Form containers: `max-w-105`
- Narrow content: `max-w-2xl`

### Common Spacing
- Section padding: `py-20`
- Card padding: `p-6`
- Grid gaps: `gap-6`
- Stack spacing: `space-y-4`
- Page padding: `px-4 sm:px-6 lg:px-8`

### Border Radius
- Base: `--radius: 0.625rem`
- sm: `calc(var(--radius) * 0.6)`
- md: `calc(var(--radius) * 0.8)`
- lg: `var(--radius)`
- xl: `calc(var(--radius) * 1.4)`
- 2xl: `calc(var(--radius) * 1.8)`
- 3xl: `calc(var(--radius) * 2.2)`
- 4xl: `calc(var(--radius) * 2.6)`

## 5. Shadows and Effects

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
| `.glow-blue` | Blue glow |
| `.glow-purple` | Purple glow |
| `.glow-green` | Green glow |

### Special Effects
- Glassmorphism via `.glass`
- Grid background via `.grid-bg`
- Shimmer loading via `.shimmer`
- Noise overlay via `.noise-overlay::before`
- Card hover via `.card-hover`

## 6. Animations

### Tailwind Keyframes
| Animation | Duration | Description |
|-----------|----------|-------------|
| `animate-fade-in` | 0.5s | Fade in from opacity 0 |
| `animate-slide-up` | 0.5s | Slide up 30px |
| `animate-slide-in-right` | 0.3s | Slide from right 20px |
| `animate-pulse-slow` | 3s | Slow pulse |
| `animate-float` | 6s | Float up and down |
| `animate-glow` | 2s | Glow intensity oscillation |
| `animate-shimmer` | 2s | Shimmer sweep |
| `animate-count-up` | 1s | Count-up effect |
| `animate-spin-slow` | 8s | Slow rotation |
| `animate-bounce-soft` | 2s | Subtle bounce |

### Page Transitions
- Entry animation uses `.page-enter` with `animate-slideUp 0.4s ease-out`

## 7. Badge and Status Colors

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

## 8. Responsive Breakpoints

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large |

## 9. Background Gradients

| Gradient Name | Definition |
|---------------|------------|
| `hero-gradient` | `linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #7c3aed 100%)` |
| `card-gradient` | `linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(217,70,239,0.1) 100%)` |
| `shimmer-gradient` | `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)` |
| `grid-pattern` | `radial-gradient(circle, rgba(14,165,233,0.15) 1px, transparent 1px)` |
