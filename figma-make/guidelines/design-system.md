# ScholarFlow Design System Guidelines

## Brand Identity

**Name:** ScholarFlow  
**Tagline:** AI-Powered Research Paper Collaboration Hub  
**Style:** Modern, clean, professional with gradient accents

---

## Color Palette

### Primary Colors

- **Primary (Indigo):** #6366F1
- **Accent (Orange):** #F97316
- **Gradient:** Linear from Primary to Accent

### Semantic Colors

- **Success (Green):** #22C55E
- **Warning (Amber):** #F59E0B
- **Info (Blue):** #3B82F6
- **Destructive (Red):** #EF4444

### Neutrals

- **Background:** #FFFFFF (light) / #0F172A (dark)
- **Foreground:** #0F172A (light) / #F8FAFC (dark)
- **Muted:** #64748B
- **Border:** #E2E8F0

---

## Typography

### Font Family

System UI stack: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

### Scale

| Style | Size    | Weight | Usage          |
| ----- | ------- | ------ | -------------- |
| H1    | 48-72px | 800    | Hero headlines |
| H2    | 36-48px | 600    | Section titles |
| H3    | 24px    | 600    | Card titles    |
| Body  | 16px    | 400    | Paragraphs     |
| Small | 14px    | 500    | Captions       |

---

## Spacing

Base unit: 4px

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

---

## Border Radius

- sm: 6px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px

---

## Shadows

- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- xl: 0 20px 25px rgba(0,0,0,0.1)
- 2xl: 0 25px 50px rgba(0,0,0,0.25)

---

## Components

### Buttons

- **Primary:** Gradient background, white text, shadow
- **Secondary:** Gray background, dark text
- **Outline:** Transparent, border, hover fill
- **Ghost:** Transparent, hover background
- **Sizes:** sm (32px), md (36px), lg (40px), xl (48px)

### Cards

- Background: white/card
- Border: 1px border with low opacity
- Radius: 16px (rounded-2xl)
- Padding: 24px
- Hover: Elevated shadow

### Inputs

- Height: 36px
- Border: 1px solid border
- Radius: 6px
- Focus: Ring with primary color

---

## Patterns

### Hero Section

- Full-width with gradient background overlay
- Centered text with gradient headline
- Two CTA buttons (primary gradient + outline)
- Feature cards in 4-column grid
- Stats section with colored numbers

### Navigation

- Fixed top, blur background
- Logo left, links center, CTA right
- Dropdown menus for categories

### Footer

- Dark background (slate-900)
- 4-column link grid
- Social icons
- Copyright bar

---

## Animations

### Transitions

- Default: 300ms ease
- Quick: 200ms ease
- Slow: 500ms ease

### Effects

- Hover lift: translateY(-4px)
- Hover scale: scale(1.05)
- Fade in: opacity 0 → 1
- Slide up: translateY(20px) → 0
