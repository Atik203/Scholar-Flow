# ScholarFlow - Figma Make Structure

This folder contains React components formatted for Figma Make AI. Copy the entire folder structure into Figma Make to generate Figma designs from the React code.

## Folder Structure

```
figma-make/
├── App.tsx                    # Main app entry (switch pages here)
├── README.md                  # This file
├── styles/
│   └── globals.css            # Global CSS with design tokens
├── guidelines/
│   └── design-system.md       # Design system reference
├── components/
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   ├── ui/                    # ShadCN-style components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PageContainer.tsx
│   │   └── index.ts
│   └── sections/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── HowItWorks.tsx
│       ├── Testimonials.tsx
│       ├── CTA.tsx
│       └── index.ts
└── pages/
    ├── LoginPage.tsx          # Auth login page
    ├── RegisterPage.tsx       # User registration page
    ├── DashboardPage.tsx      # Main dashboard with stats
    ├── PaperDetailPage.tsx    # Individual paper view
    └── index.ts
```

## How to Use in Figma Make

### Method 1: Full Folder Import

1. Create the same folder structure in Figma Make
2. Copy each file's content into the corresponding file
3. Figma Make will render the React components as Figma designs

### Method 2: Individual Components

1. Copy just the component you need (e.g., `Hero.tsx`)
2. Paste into Figma Make
3. It will render that specific component

## Switching Between Pages

In `App.tsx`, you can switch between different page layouts:

1. **Landing Page (Default)**: Full marketing page with Hero, Features, HowItWorks, Testimonials, and CTA
2. **Login Page**: Authentication page with OAuth buttons and email form
3. **Register Page**: User registration with form validation
4. **Dashboard Page**: Main app dashboard with stats, papers, and collections
5. **Paper Detail Page**: Individual paper view with AI summary

To switch pages, uncomment the desired import and JSX in `App.tsx`.

## Design System

### Colors (OKLCH format in CSS, Hex for reference)

- **Primary**: `#6366F1` (Indigo)
- **Accent/Chart-1**: `#F97316` (Orange)
- **Chart-2**: `#22C55E` (Green)
- **Chart-3**: `#3B82F6` (Blue)
- **Chart-4**: `#8B5CF6` (Purple)
- **Chart-5**: `#F43F5E` (Rose)
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Destructive**: `#EF4444`

### Signature Gradient

```css
bg-gradient-to-r from-primary to-chart-1
/* #6366F1 → #F97316 */
```

### Typography

- **Font Family**: Inter, system-ui
- **Headings**: Bold, tight tracking (-0.02em to -0.05em)
- **Body**: Regular weight, relaxed leading

### Spacing Scale

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Components Used

- **Icons**: Lucide React
- **Animations**: Framer Motion (`motion/react`)
- **Styling**: Tailwind CSS
- **UI Base**: ShadCN-style components with CVA variants

## Notes

- All components are self-contained (no external `@/lib/utils` imports)
- Each component includes its own `cn()` utility function
- CSS variables are defined in `globals.css`
- All pages support dark mode (uses CSS variables)
- Responsive breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
