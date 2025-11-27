# ScholarFlow - Figma Make Structure

This folder contains React components formatted for Figma Make AI. Copy the entire folder structure into Figma Make to generate Figma designs from the React code.

## Folder Structure

```plaintext
figma-make/
├── App.tsx                    # Main app entry with role routing & toasts
├── routes.tsx                 # Centralized route configuration
├── README.md                  # This file
├── styles/
│   └── globals.css            # Global CSS with design tokens & sidebar vars
├── guidelines/
│   └── design-system.md       # Design system reference
├── components/
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   ├── ui/                    # ShadCN-style components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── card-variants.tsx  # CVA-based card variant system
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   ├── switch.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   ├── tooltip.tsx
│   │   ├── cards/             # Specialized card components
│   │   │   ├── PricingCard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── layout/
│   │   ├── Navbar.tsx         # Site navigation bar
│   │   ├── Footer.tsx         # Site footer
│   │   ├── PageContainer.tsx  # Page wrapper with Navbar/Footer + Section/Container
│   │   ├── AppSidebar.tsx     # Dashboard sidebar with collapsible sections
│   │   ├── DashboardLayout.tsx # Dashboard layout with UserMenu & ThemeToggle
│   │   └── index.ts
│   └── sections/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── HowItWorks.tsx
│       ├── Testimonials.tsx
│       ├── CTA.tsx
│       └── index.ts
└── pages/
    ├── LoginPage.tsx          # Auth login with role detection
    ├── RegisterPage.tsx       # Registration with role detection
    ├── DashboardPage.tsx      # Role-based dashboard (4 variants)
    ├── PaperDetailPage.tsx    # Individual paper view
    ├── PricingPage.tsx        # Pricing plans display
    ├── FAQPage.tsx            # Frequently asked questions
    ├── PapersPage.tsx         # Paper library display
    ├── CollectionsPage.tsx    # Collections management
    ├── SearchPage.tsx         # Search functionality
    ├── APIDocsPage.tsx        # API documentation
    ├── IntegrationsPage.tsx   # Third-party integrations
    ├── BlogPage.tsx           # Blog articles
    ├── HelpCenterPage.tsx     # Help and support
    ├── AboutPage.tsx          # About us
    ├── CareersPage.tsx        # Job listings
    ├── ContactPage.tsx        # Contact form
    ├── PrivacyPage.tsx        # Privacy policy
    ├── TermsPage.tsx          # Terms of service
    ├── EnterprisePage.tsx     # Enterprise features
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

In `App.tsx`, you can switch between different page layouts by changing the `currentPath` state. Routes are defined in `routes.tsx` for easy management.

### Main Routes

1. **Landing Page** (`/`): Full marketing page with Hero, Features, HowItWorks, Testimonials, and CTA
2. **Login Page** (`/login`): Authentication with OAuth buttons, email-based role detection
3. **Register Page** (`/register`): User registration with form validation, role detection

### Products Routes

- `/pricing` - Pricing plans with features comparison
- `/papers` - Paper library with search and filters
- `/collections` - Collections management interface
- `/search` - Advanced search functionality

### Resources Routes

- `/api-docs` - API documentation
- `/integrations` - Third-party integrations
- `/blog` - Blog articles and updates
- `/help-center` - Help and support center

### Company Routes

- `/about` - About ScholarFlow
- `/careers` - Career opportunities
- `/contact` - Contact form and information
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Enterprise Routes

- `/enterprise` - Enterprise features and pricing

### Dashboard Routes

- `/dashboard/researcher` - Standard researcher dashboard
- `/dashboard/pro-researcher` - Pro researcher dashboard
- `/dashboard/team-lead` - Team lead dashboard with team overview
- `/dashboard/admin` - Admin dashboard with system alerts

### Paper Routes

- `/paper/[id]` - Individual paper view with AI summary

## Role-Based Dashboard System

The dashboard system supports **4 user roles** with different views:

| Role             | Email Pattern            | Dashboard Path              | Special Features                           |
| ---------------- | ------------------------ | --------------------------- | ------------------------------------------ |
| `researcher`     | Default                  | `/dashboard/researcher`     | Papers, Collections, AI Summaries          |
| `pro_researcher` | `pro@...`                | `/dashboard/pro-researcher` | + Advanced Analytics                       |
| `team_lead`      | `lead@...` or `team@...` | `/dashboard/team-lead`      | + Team Overview, Project Management        |
| `admin`          | `admin@...`              | `/dashboard/admin`          | + User Management, System Settings, Alerts |

### Role Detection from Email

When logging in or registering, the email prefix determines which dashboard:

- `admin@example.com` → Admin Dashboard
- `lead@example.com` or `team@example.com` → Team Lead Dashboard
- `pro@example.com` → Pro Researcher Dashboard
- Any other email → Researcher Dashboard

## Dashboard Components

### AppSidebar

- Collapsible navigation sections (Papers, Collections, Workspaces, Research)
- WorkspaceSwitcher dropdown
- Role-based navigation items (Admin features only visible to admins)
- Light/dark mode compatible with CSS variables

### DashboardLayout

- **UserMenu**: Dropdown on avatar click with Profile, Settings, Log out
- **ThemeToggle**: Switch between light/dark mode
- **Breadcrumbs**: Auto-generated from current path
- **MobileNav**: Hamburger menu with Sheet sidebar for mobile

### Toast Notifications

Built-in toast system with three types:

- `error` (red) - Validation errors, failures
- `success` (green) - Successful actions
- `info` (blue) - General information

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
