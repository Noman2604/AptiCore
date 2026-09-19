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

## 6. Animations & Interactive Motion
 
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

### ScrollReveal Component Specifications
The `ScrollReveal` component (`components/ScrollReveal.tsx`) provides 60fps GPU-accelerated reveals using native `IntersectionObserver`:
- **Animations Supported**: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`, `fade`
- **Transforms Used**: `translate3d(x, y, 0)`, `scale(...)`, `opacity`, `filter: blur(...)`
- **Stagger Delays**: Configurable `delay` prop (e.g. `0ms`, `100ms`, `200ms`, `300ms`) for staggered grid card entrances.
- **Threshold & Margin**: `threshold: 0.1` and `rootMargin: '0px 0px -40px 0px'` to trigger smoothly before entering user view.

### 3D Interactive Card Tilt
Applied to the Hero mock test card:
- **Perspective**: `perspective(1000px)`
- **Dynamic Rotation**: `rotateX((y - 0.5) * -16deg)` and `rotateY((x - 0.5) * 16deg)` calculated from mouse bounding rectangle.
- **Glare / Reflection**: Dynamic subtle specular highlight following cursor coordinates.
- **Restoration**: Smooth transition back to neutral `rotateX(0deg) rotateY(0deg)` on `onMouseLeave`.

### Reading Scroll Progress Bar
Sticky 3px gradient line anchored at `top: 0, zIndex: 60`:
- **Gradient**: `linear-gradient(90deg, #0ea5e9, #6366f1, #d946ef)`
- **Formula**: `(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100%`

### Company Recruiter Ticker
Continuous horizontal marquee loop:
- **Implementation**: Two identical sequences flexed in a row with `animate-[marquee_28s_linear_infinite]`.
- **Mask**: Left and right linear alpha masks (`mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent)`).

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

## 8. Responsive Breakpoints & Navigation

| Breakpoint | Min Width | Target | Behavior |
|------------|-----------|--------|----------|
| `sm` | 640px | Large phones | Stacked layouts, sticky mobile CTA active |
| `md` | 768px | Tablets (iPad Mini / Portrait) | Sidebar collapses into off-canvas drawer (`<1024px`) |
| `lg` | 1024px | Small desktops / iPad Pro Landscape | Full desktop sidebar expands, sticky CTA hidden |
| `xl` | 1280px | Standard desktops | Max container margins |
| `2xl` | 1536px | Large monitors | 7xl centered max-width container |

### Tablet & Drawer Navigation Rules
- **Sidebar Drawer**: `hooks/use-mobile.ts` treats all viewports `< 1024px` as mobile drawer viewports to protect tablet ergonomics.
- **Touch Target**: Minimum button and nav item touch area is 44x44px.

## 9. Background Gradients

| Gradient Name | Definition |
|---------------|------------|
| `hero-gradient` | `linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #7c3aed 100%)` |
| `card-gradient` | `linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(217,70,239,0.1) 100%)` |
| `shimmer-gradient` | `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)` |
| `grid-pattern` | `radial-gradient(circle, rgba(14,165,233,0.15) 1px, transparent 1px)` |

## 10. Floating UI & Conversion Micro-Components

### Sticky Mobile CTA Sheet
- **Component**: `components/StickyMobileCTA.tsx`
- **Placement**: Fixed bottom (`bottom-0 left-0 right-0 z-40`), active on mobile viewports (`sm:hidden`).
- **Styling**: Frosted glassmorphic surface (`bg-background/90 backdrop-blur-md border-t border-border/60`).
- **Interaction**: Features primary "Start Free Test" action button with pulsing indicator and direct test route navigation.

### Cookie Consent Banner
- **Component**: `components/CookieBanner.tsx`
- **Placement**: Fixed bottom floating toast (`bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50`).
- **Styling**: `bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl`.
- **Preferences**: Dual "Accept All" vs "Necessary Only" buttons with instant `localStorage` memory and settings modal integration.

## 11. Avatar Border Gamification System

The platform features 10 stylized, animated avatar borders rendered via `components/ui/game-avatar.tsx`:

| ID | Name | Category | Rarity | Min Level | Glow Color | Visual Aesthetic |
|---|---|---|---|---|---|---|
| `basic` | Standard | All | Common | 1 | `#94a3b8` | Clean, minimalist rounded frame |
| `elemental_fire_ice`| Frostfire Harmony | Streak | Epic | 3 | `#f97316` | Blazing crimson flame + glacial blue ice aura |
| `valkyrie_wings` | Valkyrie Wings | Challenges | Epic | 5 | `#38bdf8` | Ethereal celestial wings with radiant auroral shimmer |
| `cyber_lotus` | Cyber Lotus | Streak | Rare | 7 | `#ec4899` | Holographic neon lotus petals with synthwave scanlines |
| `abyssal_shallows`| Abyssal Shallows | Challenges | Rare | 10 | `#06b6d4` | Deep-ocean cyan bioluminescence & coral ripples |
| `solar_phoenix` | Solar Phoenix | Challenges | Legendary | 12 | `#eab308` | Molten coronal flares & immortal golden embers |
| `mecha_sentinel` | Mecha Sentinel | Level | Legendary | 15 | `#10b981` | Armored emerald hyper-alloy vanguard with tactical visors |
| `gladiator_legion`| Gladiator Legion | Challenges | Legendary | 18 | `#d97706` | Battle-worn auric laurels commemorating championship |
| `prismatic_crystal`| Prismatic Crystal| Challenges | Mythic | 20 | `#a855f7` | Hyper-dimensional diamond refracting rainbow spectrums |
| `golden_lion` | Golden Lion | Level | Mythic | 25 | `#f59e0b` | Sovereign imperial gold crest with diamond crown |

### Avatar Customization UI & Rules
- **Category Filter Tabs**: `all`, `streak`, `challenges`, `level`.
- **Lock State**: Locked borders display a padlock badge, level requirement indicator, and an explicit unlock description tooltip.
- **Preview Modal**: Interactive real-time preview allowing students to try on borders before applying them to their live profile.

## 12. Modular Proctored Test Runner UI

The test interface (`components/tests/runner/`) uses a focused, distraction-free proctoring design system:

| Component | Responsibility | Visual Style |
|---|---|---|
| `ProctorStrip` | Sticky top status HUD | Dark slate backdrop with high-contrast countdown clock, tab-switch violation counter badge, and full-screen trigger button |
| `TestSectionRail`| Section tabs | Horizontal tabbed pill selector with subject titles and progress checkmarks |
| `QuestionPalette`| Question grid navigation | 4-state visual indicators: **Answered** (emerald green), **Marked for Review** (violet purple), **Answered & Flagged** (violet with dot), **Unanswered** (muted slate border) |
| `QuestionCard` | Question content | High legibility typography, syntax-highlighted code blocks for technical items, and accessible radio/checkbox pill targets |
| `WarningModal` | Anti-cheat violation alert | Warning alert overlay triggered on tab-switch/window-blur with countdown acknowledgment |
| `SubmitConfirmModal`| Final submission verification | Modal with visual completion statistics (total answered, flagged, skipped) before final score calculation |
| `MobileBottomBar`| Phone viewport controls | Sticky bottom bar with Prev, Next, Flag, and Submit actions for touch ergonomics |

## 13. Question Bookmarks & Revision Interface

The bookmark center (`app/dashboard/bookmark/page.tsx`) provides an integrated revision workspace:
- **Filtering System**: Subject pills (Quantitative, Logical, Verbal, Technical), Difficulty badges (Easy, Medium, Hard), and custom revision tags.
- **Practice Mode**: One-click toggling into self-assessment mode where answers are concealed until clicked, accompanied by detailed step-by-step solutions.
- **Annotation Drawer**: Allows students to attach personal notes, mnemonic tips, or formula reminders directly to any question.

