# ScholarFlow - Figma AI Design Guideline

> **Purpose**: This document provides comprehensive design specifications for recreating the ScholarFlow UI in Figma. Use this as a reference when generating designs with Figma AI or any design tool.

---

## 📋 Table of Contents

1. [Brand Overview](#brand-overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Page Templates](#page-templates)
7. [Icons & Imagery](#icons--imagery)
8. [Animation & Interaction](#animation--interaction)
9. [Dark Mode](#dark-mode)
10. [Responsive Breakpoints](#responsive-breakpoints)

---

## 🎨 Brand Overview

**Product Name**: ScholarFlow  
**Tagline**: "AI-Powered Research Paper Collaboration Hub"  
**Design Style**: Modern, clean, professional with subtle gradients and glass-morphism effects  
**Primary Audience**: Researchers, academics, PhD students, research teams

### Brand Personality

- **Professional**: Clean layouts, generous whitespace
- **Innovative**: Gradient accents, subtle animations
- **Trustworthy**: Consistent patterns, accessible design
- **Intelligent**: AI-themed visual elements, data-driven aesthetics

---

## 🎨 Color System

### Primary Colors (Light Mode)

| Token                  | OKLCH Value                  | Hex Equivalent     | Usage                                |
| ---------------------- | ---------------------------- | ------------------ | ------------------------------------ |
| `--primary`            | `oklch(0.623 0.214 259.815)` | `#6366F1` (Indigo) | Primary actions, links, focus states |
| `--primary-foreground` | `oklch(0.97 0.014 254.604)`  | `#F8FAFC`          | Text on primary backgrounds          |
| `--background`         | `oklch(1 0 0)`               | `#FFFFFF`          | Page background                      |
| `--foreground`         | `oklch(0.141 0.005 285.823)` | `#0F172A`          | Primary text                         |

### Secondary & Accent Colors (Light Mode)

| Token                    | OKLCH Value                  | Hex Equivalent | Usage                          |
| ------------------------ | ---------------------------- | -------------- | ------------------------------ |
| `--secondary`            | `oklch(0.967 0.001 286.375)` | `#F1F5F9`      | Secondary buttons, backgrounds |
| `--secondary-foreground` | `oklch(0.21 0.006 285.885)`  | `#1E293B`      | Text on secondary              |
| `--muted`                | `oklch(0.967 0.001 286.375)` | `#F1F5F9`      | Muted backgrounds              |
| `--muted-foreground`     | `oklch(0.552 0.016 285.938)` | `#64748B`      | Secondary text                 |
| `--accent`               | `oklch(0.967 0.001 286.375)` | `#F1F5F9`      | Hover states                   |

### Semantic Colors

| Token           | OKLCH Value                 | Hex Equivalent | Usage                  |
| --------------- | --------------------------- | -------------- | ---------------------- |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `#EF4444`      | Errors, delete actions |
| `--success`     | `oklch(0.837 0.162 145.27)` | `#22C55E`      | Success states         |
| `--warning`     | `oklch(0.816 0.158 86.047)` | `#F59E0B`      | Warning states         |
| `--info`        | `oklch(0.598 0.178 238.7)`  | `#3B82F6`      | Information states     |

### Chart Colors (Gradient Endpoints)

| Token       | OKLCH Value                 | Hex Equivalent     | Usage                           |
| ----------- | --------------------------- | ------------------ | ------------------------------- |
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `#F97316` (Orange) | Gradient end, accent highlights |
| `--chart-2` | `oklch(0.6 0.118 184.704)`  | `#14B8A6`          | Chart color 2                   |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `#6366F1`          | Chart color 3                   |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `#FBBF24`          | Chart color 4                   |
| `--chart-5` | `oklch(0.769 0.188 70.08)`  | `#F59E0B`          | Chart color 5                   |

### Border & Input Colors

| Token      | OKLCH Value                  | Hex Equivalent | Usage             |
| ---------- | ---------------------------- | -------------- | ----------------- |
| `--border` | `oklch(0.92 0.004 286.32)`   | `#E2E8F0`      | Borders, dividers |
| `--input`  | `oklch(0.92 0.004 286.32)`   | `#E2E8F0`      | Input borders     |
| `--ring`   | `oklch(0.623 0.214 259.815)` | `#6366F1`      | Focus rings       |

### Gray Scale

```
gray-50:  #F8FAFC | oklch(0.985 0 0)
gray-100: #F1F5F9 | oklch(0.967 0.001 286.375)
gray-200: #E2E8F0 | oklch(0.92 0.004 286.32)
gray-300: #CBD5E1 | oklch(0.869 0.006 286.286)
gray-400: #94A3B8 | oklch(0.705 0.015 286.067)
gray-500: #64748B | oklch(0.552 0.016 285.938)
gray-600: #475569 | oklch(0.456 0.016 285.877)
gray-700: #334155 | oklch(0.372 0.014 285.823)
gray-800: #1E293B | oklch(0.274 0.006 286.033)
gray-900: #0F172A | oklch(0.21 0.006 285.885)
gray-950: #020617 | oklch(0.141 0.005 285.823)
```

### Signature Gradient

```css
/* Primary Gradient - Used on CTAs, Hero elements */
background: linear-gradient(to right, var(--primary), var(--chart-1));
/* Translates to: #6366F1 → #F97316 (Indigo to Orange) */
```

---

## 📝 Typography

### Font Family

- **Primary Font**: System font stack (Inter, -apple-system, BlinkMacSystemFont, Segoe UI)
- **Monospace**: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas

### Type Scale

| Style        | Size            | Weight          | Line Height | Letter Spacing | Usage            |
| ------------ | --------------- | --------------- | ----------- | -------------- | ---------------- |
| **H1**       | 48px (lg: 60px) | 800 (extrabold) | 1.1         | -0.025em       | Hero headlines   |
| **H2**       | 36px            | 600 (semibold)  | 1.2         | -0.02em        | Section titles   |
| **H3**       | 24px            | 600 (semibold)  | 1.3         | -0.015em       | Card titles      |
| **H4**       | 20px            | 600 (semibold)  | 1.4         | -0.01em        | Subsections      |
| **H5**       | 18px            | 600 (semibold)  | 1.4         | normal         | Small headers    |
| **H6**       | 16px            | 600 (semibold)  | 1.4         | normal         | Micro headers    |
| **Lead**     | 20px            | 400 (normal)    | 1.6         | normal         | Intro paragraphs |
| **Body (P)** | 16px            | 400 (normal)    | 1.75        | normal         | Body text        |
| **Small**    | 14px            | 500 (medium)    | 1.4         | normal         | Captions, labels |
| **Muted**    | 14px            | 400 (normal)    | 1.4         | normal         | Secondary info   |
| **Code**     | 14px (mono)     | 600 (semibold)  | 1.4         | normal         | Code snippets    |

### Typography Hierarchy Example

```
Hero: "Collaborate Smarter on Research"
├── H1: 48-60px, extrabold, tight tracking
├── Lead: 20px, normal weight, muted-foreground color
├── Body: 16px, normal weight
└── Small: 14px, medium weight
```

---

## 📐 Spacing & Layout

### Spacing Scale (4px base unit)

```
0:   0px
1:   4px    (0.25rem)
2:   8px    (0.5rem)
3:   12px   (0.75rem)
4:   16px   (1rem)
5:   20px   (1.25rem)
6:   24px   (1.5rem)
8:   32px   (2rem)
10:  40px   (2.5rem)
12:  48px   (3rem)
16:  64px   (4rem)
18:  72px   (4.5rem) - Custom
20:  80px   (5rem)
24:  96px   (6rem)
32:  128px  (8rem)
```

### Container Widths

| Container          | Max Width    | Padding                   |
| ------------------ | ------------ | ------------------------- |
| **Page (Default)** | 1440px       | 12px (sm: 20px, lg: 32px) |
| **Small**          | 896px (4xl)  | 12px (sm: 20px, lg: 32px) |
| **Large**          | 1280px (7xl) | 12px (sm: 20px, lg: 32px) |

### Section Spacing

```
Section vertical padding:
- Mobile: 64px (py-16)
- Tablet: 96px (md:py-24)
- Desktop: 128px (lg:py-32)
```

### Border Radius

| Token          | Value            | Usage            |
| -------------- | ---------------- | ---------------- |
| `--radius`     | 10.4px (0.65rem) | Base radius      |
| `--radius-sm`  | 6.4px            | Small elements   |
| `--radius-md`  | 8.4px            | Medium elements  |
| `--radius-lg`  | 10.4px           | Cards, dialogs   |
| `--radius-xl`  | 14.4px           | Large containers |
| `rounded-2xl`  | 16px             | Feature cards    |
| `rounded-full` | 9999px           | Avatars, pills   |

---

## 🧩 Component Library

### Buttons

#### Variants

| Variant         | Background      | Text                   | Border   | Shadow                | Hover Effect       |
| --------------- | --------------- | ---------------------- | -------- | --------------------- | ------------------ |
| **Default**     | `primary`       | `primary-foreground`   | none     | lg, shadow-primary/25 | Lift + glow        |
| **Destructive** | `destructive`   | white                  | none     | lg                    | Lift + red glow    |
| **Outline**     | transparent     | `foreground`           | `border` | sm                    | bg-accent on hover |
| **Secondary**   | `secondary`     | `secondary-foreground` | none     | md                    | Darker bg          |
| **Ghost**       | transparent     | `foreground`           | none     | none                  | bg-accent on hover |
| **Link**        | transparent     | `primary`              | none     | none                  | Underline          |
| **Gradient**    | primary→chart-1 | white                  | none     | xl                    | Glow effect        |

#### Button Sizes

| Size        | Height  | Padding | Font Size |
| ----------- | ------- | ------- | --------- |
| **sm**      | 32px    | 12px    | 14px      |
| **default** | 36px    | 16px    | 14px      |
| **lg**      | 40px    | 24px    | 14px      |
| **xl**      | 48px    | 32px    | 16px      |
| **icon**    | 36x36px | -       | -         |

#### Button Effects (Dark Mode Enhanced)

- **Shine Effect**: Animated white gradient sweep on hover
- **Glow Effect**: Box-shadow with primary/25 opacity
- **Inner Glow**: Radial gradient overlay
- **Scale**: `hover:scale-[1.02] active:scale-[0.98]`

### Cards

#### Base Card

```
Background: card (white in light, gray-800 in dark)
Border: 1px solid border
Border Radius: 12px (rounded-xl)
Shadow: shadow-sm (0 1px 2px rgba(0,0,0,0.05))
Padding: 24px (p-6)
Gap between children: 24px
```

#### Feature Card (Enhanced)

```
Background: gradient from muted/50 via background/80 to background
Border: 1px solid primary/20
Border Radius: 16px (rounded-2xl)
Hover: border-success/40, shadow-lg, shadow-success/10
Transition: 300ms
Icon Container: 48x48px, rounded-xl, bg-success/10
```

### Form Inputs

```
Height: 36px (h-9)
Background: transparent (dark: input/30)
Border: 1px solid input
Border Radius: 6px (rounded-md)
Padding: 12px horizontal, 4px vertical
Font Size: 16px (mobile), 14px (desktop)
Focus: 3px ring in ring/50 color, border changes to ring color
```

### Badges

| Variant         | Background    | Text                   | Border           |
| --------------- | ------------- | ---------------------- | ---------------- |
| **Default**     | `primary`     | `primary-foreground`   | none             |
| **Secondary**   | `secondary`   | `secondary-foreground` | none             |
| **Destructive** | `destructive` | white                  | none             |
| **Outline**     | transparent   | `foreground`           | 1px solid border |

Badge Size: Height auto, padding 8px horizontal, 2px vertical, font-size 12px

### Navigation

#### Top Navbar

```
Height: 64-80px
Background: transparent with backdrop-blur (header-blur)
Border: none (uses gradient/glass effect)
Logo: Shield icon + "ScholarFlow" text with gradient
Navigation Items: Dropdown menus with icons
CTA Buttons: "Login" (outline) + "Get Started" (gradient)
```

#### Dropdown Menu

```
Background: popover
Border: 1px solid border
Border Radius: 8px
Shadow: lg
Item Padding: 8px 12px
Item Hover: bg-accent
Icon Size: 16x16px
```

### Sidebar (Dashboard)

```
Width: 256px (w-64)
Collapsed Width: 48px
Background: sidebar (slightly off-white/dark)
Border Right: 1px solid sidebar-border
Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 📄 Page Templates

### 1. Landing Page / Home

**Sections:**

1. **Hero Section**
   - Full-width, pt-128px pb-128px
   - Background: Radial gradients (primary/12, chart-1/8)
   - Grid pattern overlay (100x100px cells, border/10)
   - H1 with gradient text ("Research" word)
   - Lead paragraph (max-w-2xl, centered)
   - CTA buttons: Gradient "Get Started" + Outline "How it Works"

2. **Features Grid**
   - 4-column grid (responsive: 1 → 2 → 4)
   - Feature cards with icon, title, description
   - Green accent color for icons (success)

3. **Stats Section**
   - Centered card with border primary/20
   - 4-column stats: "10K+ Research Papers", "5K+ Active Users", etc.

4. **Logos Marquee** (optional)
   - Infinite scroll animation
   - Grayscale logos, hover → color

5. **How It Works**
   - 3-step process with numbered indicators
   - Alternating layout or horizontal timeline

6. **Testimonials**
   - Avatar + quote + name/role
   - Card-based or minimal layout

7. **CTA Section**
   - Full-width gradient background
   - Large heading + subtext
   - Single CTA button

### 2. Login / Register Pages

**Layout: Split Screen**

- **Left (50%)**: Form container
  - Max-width 448px, centered
  - Back to home link (top)
  - Icon + "Welcome back" heading
  - OAuth buttons (Google, GitHub)
  - Divider "OR"
  - Email/Password form
  - "Forgot password?" link
  - "Don't have account? Sign up" link

- **Right (50%)**: Decorative panel
  - Gradient background (primary → chart-1)
  - Abstract patterns or illustration
  - Feature highlights list
  - Hidden on mobile

### 3. Dashboard

**Layout: Sidebar + Main Content**

- **Sidebar (256px fixed)**
  - Logo header
  - Navigation menu with icons
  - Collapsible sub-menus
  - User avatar at bottom
  - Theme toggle

- **Main Content Area**
  - Header with breadcrumbs, search, notifications
  - Page title + description
  - Content grid/cards
  - Responsive: sidebar collapses on mobile

### 4. Paper/Document Pages

- Header with back button, title, metadata
- Tabs for different views (Overview, PDF, Notes, Comments)
- Content area with proper spacing
- Action buttons (Download, Share, Add to Collection)

---

## 🖼️ Icons & Imagery

### Icon Library

**Primary**: Lucide Icons (lucide-react)

**Commonly Used Icons:**

| Icon           | Usage                         |
| -------------- | ----------------------------- |
| `Shield`       | Brand logo, security          |
| `FileText`     | Papers, documents             |
| `Search`       | Search functionality          |
| `Users`        | Collaboration, teams          |
| `Zap`          | AI features, quick actions    |
| `BookOpen`     | Collections, library          |
| `Lightbulb`    | Insights, AI suggestions      |
| `ArrowRight`   | CTAs, navigation              |
| `CheckCircle2` | Success, completed items      |
| `Sun/Moon`     | Theme toggle                  |
| `Menu/X`       | Mobile navigation             |
| `ChevronDown`  | Dropdowns                     |
| `Loader2`      | Loading states (animate-spin) |
| `Github`       | OAuth, social links           |
| `Mail`         | Email, contact                |
| `Eye/EyeOff`   | Password visibility           |

### Icon Sizing

```
xs: 12x12px (h-3 w-3)
sm: 16x16px (h-4 w-4) - Default in buttons
md: 20x20px (h-5 w-5)
lg: 24x24px (h-6 w-6) - Feature icons
xl: 32x32px (h-8 w-8) - Hero icons
```

### Icon Containers

```
Feature Icon Container:
- Size: 48x48px
- Background: success/10 (or primary/10)
- Border Radius: 12px (rounded-xl)
- Icon Color: success (or primary)
```

---

## ✨ Animation & Interaction

### Transition Defaults

```css
/* Standard transition */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Quick interactions */
transition: all 200ms ease-in-out;

/* Smooth movements */
transition: all 500ms ease-out;
```

### Motion Patterns (Framer Motion)

```javascript
// Fade in + slide up
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.7, ease: "easeOut" }

// Stagger children (delay each by 0.1s)
transition: { delay: 0.1 * index, duration: 0.5 }

// Scale in
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
```

### Hover Effects

```css
/* Lift effect */
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Scale effect */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Glow effect */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}
```

### Loading States

- **Spinner**: Loader2 icon with `animate-spin` class
- **Skeleton**: Pulsing gray rectangles
- **Button Loading**: Icon + "Loading..." text, disabled state

---

## 🌙 Dark Mode

### Color Overrides

| Token               | Light Mode                 | Dark Mode                  |
| ------------------- | -------------------------- | -------------------------- |
| `--background`      | #FFFFFF                    | #0F172A                    |
| `--foreground`      | #0F172A                    | #F8FAFC                    |
| `--card`            | #FFFFFF                    | #1E293B                    |
| `--card-foreground` | #0F172A                    | #F8FAFC                    |
| `--primary`         | oklch(0.623 0.214 259.815) | oklch(0.546 0.245 262.881) |
| `--border`          | #E2E8F0                    | rgba(255,255,255,0.1)      |
| `--input`           | #E2E8F0                    | rgba(255,255,255,0.15)     |

### Dark Mode Enhancements

- **Button text**: Force white text in dark mode
- **Shadows**: Use colored glows (primary/30) instead of black shadows
- **Borders**: Slightly more visible (primary/50 hover states)
- **Glass effects**: backdrop-blur with rgba overlays

### Footer (Dark by Default)

```
Background: slate-900 → slate-950 → black gradient
Text: slate-300 (links), slate-400 (body)
Accent: primary color for headings and icons
```

---

## 📱 Responsive Breakpoints

| Breakpoint    | Width       | Tailwind Prefix |
| ------------- | ----------- | --------------- |
| Mobile        | 0-639px     | (default)       |
| Tablet        | 640-767px   | `sm:`           |
| Small Desktop | 768-1023px  | `md:`           |
| Desktop       | 1024-1279px | `lg:`           |
| Large Desktop | 1280-1535px | `xl:`           |
| Extra Large   | 1536px+     | `2xl:`          |

### Responsive Patterns

```
Container padding:
- Mobile: 12px (px-3)
- Tablet: 20px (sm:px-5)
- Desktop: 32px (lg:px-8)

Section padding:
- Mobile: 64px vertical (py-16)
- Tablet: 96px vertical (md:py-24)
- Desktop: 128px vertical (lg:py-32)

Grid columns:
- Mobile: 1 column
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 4 columns (lg:grid-cols-4)

Typography scaling:
- H1: 36px → 48px → 60px
- Lead: 18px → 20px
```

---

## 🧭 Design Tokens Summary (Figma Variables)

Create these as Figma Variables for easy theming:

### Colors Collection

```
primitives/
├── slate/ (gray scale 50-950)
├── indigo/ (primary shades)
├── orange/ (accent shades)
├── red/ (destructive)
├── green/ (success)
├── amber/ (warning)
└── blue/ (info)

semantic/
├── background
├── foreground
├── primary (+ foreground)
├── secondary (+ foreground)
├── muted (+ foreground)
├── accent (+ foreground)
├── destructive (+ foreground)
├── border
├── input
├── ring
├── card (+ foreground)
└── popover (+ foreground)
```

### Spacing Collection

```
spacing/
├── 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32
└── gap-sm (4px), gap-md (8px), gap-lg (16px), gap-xl (24px)
```

### Typography Collection

```
typography/
├── font-family-sans
├── font-family-mono
├── font-size-xs through font-size-9xl
├── font-weight-normal through font-weight-black
├── line-height-none through line-height-loose
└── letter-spacing-tighter through letter-spacing-widest
```

### Effects Collection

```
effects/
├── shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl
├── radius-sm, radius-md, radius-lg, radius-xl, radius-2xl, radius-full
└── blur-sm, blur, blur-md, blur-lg
```

---

## ✅ Design Checklist

When creating Figma designs, ensure:

- [ ] All colors use the defined token system
- [ ] Typography follows the established scale
- [ ] Spacing uses the 4px base grid
- [ ] Components match the defined variants
- [ ] Both light and dark modes are designed
- [ ] Responsive layouts for mobile, tablet, desktop
- [ ] Hover/focus/active states are defined
- [ ] Loading states are included
- [ ] Error states use destructive colors
- [ ] Success states use success colors
- [ ] Icons are consistently sized (16px default)
- [ ] Border radius is consistent (10.4px base)
- [ ] Shadows follow the defined scale
- [ ] Gradients use primary → chart-1 direction

---

## 📚 Reference Components to Design

1. **Buttons** (all 7 variants × 5 sizes)
2. **Input Fields** (default, focused, error, disabled)
3. **Cards** (basic, feature, stats)
4. **Navigation** (navbar, sidebar, mobile menu)
5. **Modals/Dialogs**
6. **Dropdowns**
7. **Forms** (login, register, profile)
8. **Tables** (data display)
9. **Badges/Tags**
10. **Avatars**
11. **Alerts/Toasts**
12. **Skeleton Loaders**
13. **Progress Indicators**
14. **Tabs**
15. **Breadcrumbs**

---

_Last Updated: November 2025_  
_Design System Version: 1.0 (Phase 1 MVP)_
