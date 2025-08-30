# 🎨 Scholar-Flow UI Design System

> Comprehensive UI/UX design guidelines and component patterns for Scholar-Flow

## 📋 Overview

This document defines the UI/UX design system for Scholar-Flow, providing guidelines for consistent, accessible, and beautiful user interfaces. All design decisions should align with the phased improvements outlined in `Improvements.md`.

**Quick Links:**

- [📋 Improvements.md](../Improvements.md) - Complete improvement roadmap
- [📝 CHANGELOG.md](../CHANGELOG.md) - Implementation progress tracking
- [🗺️ Roadmap.md](../Roadmap.md) - Project roadmap

---

## 🎯 Design Principles

### 1. **Consistency First**

- Use established component patterns and variants
- Maintain consistent spacing, typography, and color usage
- Follow established interaction patterns

### 2. **Accessibility by Default**

- WCAG 2.1 AA compliance for all components
- Proper focus management and keyboard navigation
- Semantic HTML structure with ARIA labels

### 3. **Performance Conscious**

- Optimize for Core Web Vitals
- Implement lazy loading and code splitting
- Use efficient animations and transitions

### 4. **Mobile-First Responsive**

- Design for mobile devices first
- Progressive enhancement for larger screens
- Touch-friendly interactions and sizing

---

## 🎨 Color System

### Primary Colors (OKLCH)

```css
:root {
  --primary: oklch(0.623 0.214 259.815);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}
```

### Semantic Colors

```css
:root {
  /* Success */
  --success: oklch(0.837 0.162 145.27);
  --success-foreground: oklch(0.985 0 0);

  /* Warning */
  --warning: oklch(0.816 0.158 86.047);
  --warning-foreground: oklch(0.141 0.005 285.823);

  /* Error */
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(1 0 0);

  /* Info */
  --info: oklch(0.598 0.178 238.7);
  --info-foreground: oklch(0.985 0 0);
}
```

### Neutral Grays (50-950 Scale)

```css
:root {
  --gray-50: oklch(0.985 0 0);
  --gray-100: oklch(0.967 0.001 286.375);
  --gray-200: oklch(0.92 0.004 286.32);
  --gray-300: oklch(0.869 0.006 286.286);
  --gray-400: oklch(0.705 0.015 286.067);
  --gray-500: oklch(0.552 0.016 285.938);
  --gray-600: oklch(0.456 0.016 285.877);
  --gray-700: oklch(0.372 0.014 285.823);
  --gray-800: oklch(0.274 0.006 286.033);
  --gray-900: oklch(0.21 0.006 285.885);
  --gray-950: oklch(0.141 0.005 285.823);
}
```

---

## 📝 Typography System

### Heading Scale

```tsx
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
};
```

### Body Text

```tsx
export const typography = {
  p: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
};
```

### Font Weights

- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

---

## 📏 Spacing & Layout

### Container System

```tsx
// Standard page container
className = "mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8";

// Section spacing
className = "py-16 md:py-24 lg:py-32";

// Component spacing
className = "space-y-4 md:space-y-6 lg:space-y-8";
```

### Spacing Scale

```tsx
// Tailwind spacing values
spacing: {
  'xs': '0.5rem',    // 8px
  'sm': '1rem',      // 16px
  'md': '1.5rem',    // 24px
  'lg': '2rem',      // 32px
  'xl': '3rem',      // 48px
  '2xl': '4rem',     // 64px
  '18': '4.5rem',    // 72px
  '88': '22rem',     // 352px
  '128': '32rem',    // 512px
  '144': '36rem',    // 576px
}
```

### Breakpoints

```tsx
// Mobile-first responsive design
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X large devices
```

---

## 🧩 Component Patterns

### Button System

```tsx
// Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-border bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-chart-1 text-white",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4 py-2",
        lg: "h-10 px-6",
        xl: "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
  }
);
```

### Card System

```tsx
// Card variants
const cardVariants = cva("rounded-xl border transition-all duration-300", {
  variants: {
    variant: {
      default: "border-border bg-card",
      ghost: "border-transparent hover:border-border",
      elevated: "border-border shadow-lg hover:shadow-xl",
      interactive:
        "border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
});
```

### Form System

```tsx
// Form field base
const formFieldBase =
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background";

// Floating label input
const floatingInput =
  "peer w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 placeholder-transparent focus:border-primary focus:outline-none";

// Form validation states
const formStates = {
  default: "border-input focus-visible:ring-ring",
  error: "border-destructive focus-visible:ring-destructive",
  success: "border-success focus-visible:ring-success",
};
```

---

## 🎭 Animation & Transitions

### Transition Durations

```tsx
// Standard transition durations
const transitions = {
  fast: "duration-150",
  normal: "duration-300",
  slow: "duration-500",
  slower: "duration-700",
};
```

### Hover Effects

```css
/* Hover lift effect */
.hover-lift {
  @apply transition-transform duration-300 hover:-translate-y-1;
}

/* Hover glow effect */
.hover-glow {
  @apply transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20;
}

/* Hover scale effect */
.hover-scale {
  @apply transition-transform duration-300 hover:scale-105;
}
```

### Page Transitions

```tsx
// Framer Motion page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {children}
</motion.div>
```

### Loading States

```tsx
// Skeleton loading
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-muted", className)} />
);

// Loading spinner
const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-primary border-t-transparent",
          sizeClasses[size]
        )}
      />
    </div>
  );
};
```

---

## 📱 Responsive Design Patterns

### Mobile-First Approach

```tsx
// Start with mobile styles, enhance for larger screens
<div
  className="
  p-4                    // Mobile padding
  md:p-6                 // Medium screen padding
  lg:p-8                 // Large screen padding
  xl:p-12                // Extra large screen padding
"
>
  <h1
    className="
    text-2xl             // Mobile text size
    md:text-3xl          // Medium screen text size
    lg:text-4xl          // Large screen text size
    xl:text-5xl          // Extra large screen text size
  "
  >
    Responsive Heading
  </h1>
</div>
```

### Grid Layouts

```tsx
// Responsive grid columns
<div
  className="
  grid
  grid-cols-1            // Mobile: 1 column
  sm:grid-cols-2         // Small: 2 columns
  md:grid-cols-3         // Medium: 3 columns
  lg:grid-cols-4         // Large: 4 columns
  xl:grid-cols-5         // Extra large: 5 columns
  gap-4                  // Consistent gap
"
>
  {/* Grid items */}
</div>
```

### Navigation Patterns

```tsx
// Mobile navigation
<nav className="
  lg:hidden              // Hide on large screens
  fixed                  // Fixed positioning
  inset-0                // Full screen
  z-50                   // High z-index
  bg-background/95       // Semi-transparent background
  backdrop-blur          // Backdrop blur effect
">
  {/* Mobile menu content */}
</nav>

// Desktop navigation
<nav className="
  hidden                 // Hide on mobile
  lg:flex                // Show on large screens
  items-center
  gap-6
">
  {/* Desktop menu content */}
</nav>
```

---

## ♿ Accessibility Guidelines

### Focus Management

```tsx
// Focus trap for modals
const useFocusTrap = (isActive: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Focus trap logic
  }, [isActive]);

  return ref;
};
```

### ARIA Labels

```tsx
// Proper ARIA usage
<button
  aria-label="Close modal"
  aria-expanded={isOpen}
  aria-controls="modal-content"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>

// Screen reader announcements
<div
  role="status"
  aria-live="polite"
  aria-atomic="false"
>
  {statusMessage}
</div>
```

### Keyboard Navigation

```tsx
// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
    if (event.key === "Enter" && event.ctrlKey) {
      onSubmit();
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [onClose, onSubmit]);
```

---

## 🎨 Component Examples

### Hero Section

```tsx
export const HeroSection = () => (
  <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
    <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8">
      <div className="text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Research Made Simple
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Collaborate on research papers, discover insights, and build knowledge
          together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="btn-hover-glow">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);
```

### Feature Card

```tsx
export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="group relative overflow-hidden rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
  >
    <div className="p-6 space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
);
```

---

## 📊 Design Tokens

### Shadows

```css
/* Shadow system */
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.shadow-sm {
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}
.shadow-md {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.shadow-lg {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}
.shadow-xl {
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

### Border Radius

```css
/* Radius system */
.rounded-sm {
  border-radius: calc(var(--radius) - 4px);
}
.rounded-md {
  border-radius: calc(var(--radius) - 2px);
}
.rounded-lg {
  border-radius: var(--radius);
}
.rounded-xl {
  border-radius: calc(var(--radius) + 4px);
}
```

### Z-Index Scale

```css
/* Z-index system */
.z-0 {
  z-index: 0;
}
.z-10 {
  z-index: 10;
}
.z-20 {
  z-index: 20;
}
.z-30 {
  z-index: 30;
}
.z-40 {
  z-index: 40;
}
.z-50 {
  z-index: 50;
}
.z-[60] {
  z-index: 60;
}
.z-[70] {
  z-index: 70;
}
.z-[80] {
  z-index: 80;
}
.z-[90] {
  z-index: 90;
}
.z-[100] {
  z-index: 100;
}
```

---

## 🔄 Implementation Checklist

### Before Starting Design

- [ ] Check current phase in `Improvements.md`
- [ ] Review existing component patterns
- [ ] Understand design system constraints
- [ ] Plan responsive behavior

### During Design

- [ ] Follow established color and typography systems
- [ ] Use consistent spacing and layout patterns
- [ ] Implement proper accessibility features
- [ ] Test on multiple screen sizes

### After Design

- [ ] Update component documentation
- [ ] Add to design system examples
- [ ] Update progress tracking
- [ ] Share with team for review

---

## 📚 Resources

### Design Tools

- [Figma](https://figma.com) - Design and prototyping
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Radix UI](https://radix-ui.com) - Unstyled, accessible components
- [Framer Motion](https://framer.com/motion) - Animation library

### Accessibility Tools

- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing
- [WAVE](https://wave.webaim.org) - Web accessibility evaluation
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Color contrast testing

### Performance Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [WebPageTest](https://www.webpagetest.org) - Performance testing
- [Bundlephobia](https://bundlephobia.com) - Package size analysis

---

_Last Updated: August 28, 2025_
_Maintained by: Md. Atikur Rahaman (GitHub: Atik203), Salman_
_Function Author (Email Verification, Password Reset, Forgot Password): Atik+Salman_
_Next Review: Weekly during implementation_
