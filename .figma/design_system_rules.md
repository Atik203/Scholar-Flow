# ScholarFlow Design System Rules for Figma MCP

> This document defines how Figma AI should interpret and generate designs based on the ScholarFlow codebase.

---

## 1. Token Definitions

### Location

Design tokens are defined in:

- **CSS Variables**: `apps/frontend/src/app/globals.css`
- **Tailwind Config**: `apps/frontend/tailwind.config.ts`
- **ShadCN Config**: `apps/frontend/components.json`

### Color Token Structure (OKLCH Format)

```css
/* Primary Colors */
--primary: oklch(0.623 0.214 259.815); /* #6366F1 - Indigo */
--primary-foreground: oklch(0.97 0.014 254.604);

/* Background/Foreground */
--background: oklch(1 0 0); /* #FFFFFF */
--foreground: oklch(0.141 0.005 285.823); /* #0F172A */

/* Semantic Colors */
--destructive: oklch(0.577 0.245 27.325); /* #EF4444 */
--success: oklch(0.837 0.162 145.27); /* #22C55E */
--warning: oklch(0.816 0.158 86.047); /* #F59E0B */
--info: oklch(0.598 0.178 238.7); /* #3B82F6 */

/* Gradient Accent */
--chart-1: oklch(0.646 0.222 41.116); /* #F97316 - Orange */
```

### Spacing Scale (4px Base)

```typescript
// Tailwind spacing extensions
spacing: {
  "18": "4.5rem",   // 72px
  "88": "22rem",    // 352px
  "128": "32rem",   // 512px
  "144": "36rem",   // 576px
}
```

### Border Radius

```css
--radius: 0.65rem; /* 10.4px base */
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

---

## 2. Component Library

### Location

- **ShadCN UI Components**: `apps/frontend/src/components/ui/`
- **Custom Components**: `apps/frontend/src/components/customUI/`
- **Layout Components**: `apps/frontend/src/components/layout/`

### Component Architecture

Components follow this pattern:

```typescript
// Button Example - apps/frontend/src/components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-border bg-background",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-chart-1 text-white",
      },
      size: {
        sm: "h-8 px-3",
        default: "h-9 px-4 py-2",
        lg: "h-10 px-6",
        xl: "h-12 px-8 text-base",
        icon: "size-9",
      },
    },
  }
);
```

### Key Components

| Component | Path                  | Description                           |
| --------- | --------------------- | ------------------------------------- |
| Button    | `ui/button.tsx`       | 7 variants, 5 sizes, loading state    |
| Card      | `ui/card.tsx`         | Header, Content, Footer, Action slots |
| Input     | `ui/input.tsx`        | Focus rings, error states             |
| Badge     | `ui/badge.tsx`        | 4 variants                            |
| Dialog    | `ui/dialog.tsx`       | Modal dialogs                         |
| Navbar    | `customUI/Navbar.tsx` | Main navigation                       |
| Hero      | `customUI/Hero.tsx`   | Landing page hero                     |
| Footer    | `customUI/Footer.tsx` | Site footer                           |

---

## 3. Frameworks & Libraries

### Tech Stack

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS 4.0",
  "components": "ShadCN UI (Radix primitives)",
  "animations": "Framer Motion",
  "icons": "Lucide React",
  "forms": "React Hook Form + Zod",
  "state": "Redux Toolkit Query"
}
```

### Build System

- **Bundler**: Turbopack (Next.js)
- **Monorepo**: Turborepo
- **Package Manager**: Yarn Berry v4

---

## 4. Asset Management

### Image Handling

```typescript
// Use Next.js Image component
import Image from "next/image";

<Image
  src="/path/to/image.png"
  alt="Description"
  width={400}
  height={300}
  className="rounded-lg"
/>
```

### Asset Locations

- **Static Assets**: `apps/frontend/public/`
- **Slides/Images**: `apps/frontend/public/slides/`
- **Icons**: Lucide React (no static icon files)

---

## 5. Icon System

### Library

**Lucide React** - Consistent, customizable icons

### Usage Pattern

```typescript
import { FileText, Search, Users, Zap } from "lucide-react";

// Standard sizing
<FileText className="h-4 w-4" />     // 16px - buttons, inline
<FileText className="h-5 w-5" />     // 20px - medium
<FileText className="h-6 w-6" />     // 24px - feature icons
<FileText className="h-8 w-8" />     // 32px - hero icons
```

### Common Icons

| Icon         | Usage                  |
| ------------ | ---------------------- |
| `Shield`     | Brand logo             |
| `FileText`   | Papers, documents      |
| `Search`     | Search functionality   |
| `Users`      | Collaboration          |
| `Zap`        | AI features            |
| `BookOpen`   | Collections            |
| `ArrowRight` | CTAs                   |
| `Loader2`    | Loading (animate-spin) |

---

## 6. Styling Approach

### Methodology

**Tailwind CSS** with CSS Variables for theming

### Global Styles Location

`apps/frontend/src/app/globals.css`

### Component Styling Pattern

```typescript
// Use cn() utility for conditional classes
import { cn } from "@/lib/utils";

function Component({ className, ...props }) {
  return (
    <div
      className={cn(
        "base-classes here",
        "hover:hover-classes",
        "dark:dark-mode-classes",
        className
      )}
      {...props}
    />
  );
}
```

### Responsive Design

```css
/* Breakpoints */
sm: 640px   /* Tablet */
md: 768px   /* Small desktop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */

/* Pattern */
<div className="px-3 sm:px-5 lg:px-8">
  {/* Mobile-first responsive padding */}
</div>
```

### Dark Mode

```typescript
// Toggle via class on <html>
<html className="dark">

// Component usage
<div className="bg-white dark:bg-gray-900">
```

---

## 7. Project Structure

```
apps/frontend/src/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Global styles & tokens
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/              # Auth pages
│   ├── dashboard/          # Dashboard pages
│   └── papers/             # Paper management
├── components/
│   ├── ui/                 # ShadCN base components
│   ├── customUI/           # Custom components (Hero, Navbar, etc.)
│   ├── layout/             # Layout components
│   └── providers/          # Context providers
├── lib/
│   ├── utils.ts            # cn() and utilities
│   ├── typography.ts       # Typography system
│   └── validators.ts       # Zod schemas
├── hooks/                  # Custom React hooks
├── redux/                  # State management
└── styles/                 # Additional styles
    ├── _variables.scss
    └── _keyframe-animations.scss
```

---

## 8. Key Design Patterns for Figma

### Signature Gradient

```css
/* Primary CTA gradient */
background: linear-gradient(to right, #6366f1, #f97316);
/* Tailwind: bg-gradient-to-r from-primary to-chart-1 */
```

### Card Pattern

```typescript
<Card className="border-primary/20 bg-gradient-to-b from-muted/50 via-background/80 to-background">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Button with Effects

```typescript
<Button
  variant="gradient"
  className="btn-hover-glow btn-shine shadow-xl hover:shadow-2xl"
>
  Get Started
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
```

### Feature Card

```typescript
<div className="group relative p-6 rounded-2xl border border-primary/20
                bg-gradient-to-b from-muted/50 via-background/80 to-background
                hover:border-success/40 transition-all duration-300
                hover:shadow-lg hover:shadow-success/10">
  <div className="w-12 h-12 rounded-xl bg-success/10 text-success mb-4">
    <Icon className="h-6 w-6" />
  </div>
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-muted-foreground text-sm">Description</p>
</div>
```

---

## 9. Animation Tokens

### Transitions

```css
/* Standard */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Quick */
transition: all 200ms ease-in-out;

/* Smooth */
transition: all 500ms ease-out;
```

### Framer Motion Defaults

```typescript
// Fade + slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, ease: "easeOut" }}

// Stagger children
transition={{ delay: 0.1 * index, duration: 0.5 }}
```

---

## 10. Mapping Code to Figma

When generating Figma designs from this codebase:

| Code Element            | Figma Equivalent                         |
| ----------------------- | ---------------------------------------- |
| `bg-primary`            | Fill: #6366F1                            |
| `text-muted-foreground` | Text: #64748B                            |
| `rounded-xl`            | Corner Radius: 12px                      |
| `shadow-lg`             | Drop Shadow: 0 10px 15px rgba(0,0,0,0.1) |
| `border border-border`  | Stroke: 1px #E2E8F0                      |
| `p-6`                   | Padding: 24px                            |
| `gap-4`                 | Auto Layout Gap: 16px                    |
| `h-9`                   | Height: 36px                             |

### Auto Layout Mappings

| Tailwind          | Figma Auto Layout           |
| ----------------- | --------------------------- |
| `flex flex-col`   | Vertical, Packed            |
| `flex flex-row`   | Horizontal, Packed          |
| `items-center`    | Cross-axis: Center          |
| `justify-between` | Primary axis: Space Between |
| `gap-4`           | Spacing: 16px               |

---

_This document enables Figma MCP to understand ScholarFlow's design system and generate consistent designs._
