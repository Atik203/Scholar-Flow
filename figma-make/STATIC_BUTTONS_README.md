# Static Buttons Analysis & Dynamic Animation Plan

> **Project:** figma-make (ScholarFlow)  
> **Date:** January 2026  
> **Purpose:** Identify all static/non-functional buttons and plan dynamic implementations with animations.

---

## Summary

Analyzed **102 pages** across the figma-make project. Found **35 static buttons** across **8 files** that either:

- Have **no `onClick` handler** (completely non-functional)
- Have **incorrect navigation paths**
- Have **incomplete state logic** (e.g., "Save" buttons that don't persist)

---

## 📋 Static Buttons by File

### 1. `pages/dashboard/EnhancedDashboardPage.tsx`

| Line | Button Text                        | Issue                                              | Suggested Fix                                               |
| ---- | ---------------------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| 428  | **Add Goal**                       | No `onClick` handler                               | Open a goal creation modal with slide-up animation          |
| 607  | **Get Recommendations**            | No `onClick` handler                               | Navigate to `/ai-insights` or open AI recommendations panel |
| 611  | **View Analysis**                  | No `onClick` handler                               | Navigate to `/analytics`                                    |
| 731  | **Save Changes** (Customize modal) | Only closes modal, doesn't save widget preferences | Persist widget visibility state to localStorage/context     |
| ~500 | Quick Action: "Upload Paper"       | Path `/upload` is incorrect                        | Change to `/papers/upload`                                  |
| ~500 | Quick Action: "AI Assistant"       | Path `/ai` is incorrect                            | Change to `/ai-insights`                                    |

**Animation Plan:**

- Add `motion.button` with `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}` to all action buttons
- Goal modal: `AnimatePresence` with slide-up (`y: 100 → 0`) and fade-in
- "Save Changes": Add success toast animation with checkmark icon after save

---

### 2. `pages/PaperDetailPage.tsx`

| Line    | Button Text                  | Issue                        | Suggested Fix                                        |
| ------- | ---------------------------- | ---------------------------- | ---------------------------------------------------- |
| 154     | **Share** (icon)             | No `onClick` handler         | Open share modal or copy link with tooltip animation |
| 157     | **Download** (icon)          | No `onClick` handler         | Trigger PDF download with progress animation         |
| 170     | **More Options** (icon)      | No `onClick` handler         | Open dropdown menu with `motion.div` fade-in         |
| 238     | **View PDF**                 | No `onClick` handler         | Open PDF viewer or external link                     |
| 242     | **Add Annotation**           | No `onClick` handler         | Open annotation sidebar with slide-in animation      |
| 362-377 | **Related Papers** (3 items) | `<button>` with no `onClick` | Navigate to respective paper detail pages            |
| 432     | **Add Collaborator** (+)     | No `onClick` handler         | Open collaborator invite modal                       |

**Animation Plan:**

- Share button: `whileTap` scale + tooltip "Link copied!" with fade-out
- Download: Animate download icon rotation during download, then checkmark morph
- Related papers: `whileHover={{ x: 4 }}` nudge animation + background highlight
- Annotation sidebar: `AnimatePresence` with `x: 300 → 0` slide-in

---

### 3. `pages/ProfilePage.tsx`

| Line | Button Text                  | Issue                | Suggested Fix                                   |
| ---- | ---------------------------- | -------------------- | ----------------------------------------------- |
| 817  | **View Full Analytics**      | No `onClick` handler | Navigate to `/analytics`                        |
| 1036 | **View All** (Collaborators) | No `onClick` handler | Navigate to `/team` or expand collaborator list |
| 1152 | **Connect** (ResearchGate)   | No `onClick` handler | Open OAuth connection flow or modal             |

**Animation Plan:**

- "View Full Analytics": Gradient shimmer effect on hover + `whileHover={{ scale: 1.02 }}`
- "View All": Expand animation with `AnimatePresence` to show full collaborator grid
- "Connect": Pulse animation on the button + loading spinner during OAuth flow

---

### 4. `pages/company/PressPage.tsx`

| Line    | Button Text                          | Issue                | Suggested Fix                                               |
| ------- | ------------------------------------ | -------------------- | ----------------------------------------------------------- |
| 53-59   | **Contact Press Team**               | No `onClick` handler | Navigate to `/company/contact` or open mailto link          |
| 142     | **Read More** (×4 press releases)    | No `onClick` handler | Navigate to individual press release pages or expand inline |
| 212     | **Read Article** (×3 media coverage) | No `onClick` handler | Open external article links                                 |
| 310-316 | **Download Press Kit**               | No `onClick` handler | Trigger file download                                       |
| 317-320 | **Brand Guidelines**                 | No `onClick` handler | Navigate to brand guidelines page or download PDF           |

**Animation Plan:**

- "Read More": Arrow icon `whileHover={{ x: 4 }}` + card border color transition
- "Download Press Kit": Download icon bounce animation + progress indicator
- "Contact Press Team": `whileHover` glow effect with gradient pulse

---

### 5. `pages/resources/CommunityPage.tsx`

| Line  | Button Text              | Issue                | Suggested Fix                                 |
| ----- | ------------------------ | -------------------- | --------------------------------------------- |
| 50-56 | **Join Community**       | No `onClick` handler | Navigate to `/register` or `/login`           |
| 299   | **View All Discussions** | No `onClick` handler | Navigate to `/discussions` or community forum |

**Animation Plan:**

- "Join Community": Gradient button with `btn-shine` CSS animation + scale on hover
- "View All Discussions": Arrow slide animation + subtle underline expand effect

---

### 6. `pages/dashboard/TeamMembersPage.tsx`

| Line | Button Text                          | Issue                | Suggested Fix                                   |
| ---- | ------------------------------------ | -------------------- | ----------------------------------------------- |
| 602  | **Resend Invitation** (icon)         | No `onClick` handler | Resend invitation with success toast            |
| 609  | **Delete Invitation** (icon)         | No `onClick` handler | Delete with confirmation modal + exit animation |
| 773  | **View Profile** (modal action)      | No `onClick` handler | Navigate to member's profile page               |
| 777  | **Change Role** (modal action)       | No `onClick` handler | Open role selection dropdown with animation     |
| 781  | **Manage Workspaces** (modal action) | No `onClick` handler | Open workspace assignment panel                 |
| 785  | **Remove from Team** (modal action)  | No `onClick` handler | Confirmation dialog with destructive styling    |

**Animation Plan:**

- Modal action buttons: `whileHover={{ x: 4 }}` nudge + icon color transition
- "Remove from Team": Red highlight pulse animation on hover as a warning
- Resend: Refresh icon `animate={{ rotate: 360 }}` spin on click
- Delete confirmation: `AnimatePresence` with scale-down exit animation

---

### 7. `pages/resources/APIPage.tsx`

| Line    | Button Text                 | Issue                | Suggested Fix                                         |
| ------- | --------------------------- | -------------------- | ----------------------------------------------------- |
| 51-57   | **Get API Key**             | No `onClick` handler | Navigate to `/login` or open API key generation modal |
| 81      | **Copy** (code snippet)     | No `onClick` handler | Copy code to clipboard with "Copied!" tooltip         |
| 273-279 | **View SDK** (×4 languages) | No `onClick` handler | Open external GitHub links or SDK documentation       |

**Animation Plan:**

- "Get API Key": Key icon rotation animation on hover
- "Copy": Icon morph from Copy → Check with color transition (green flash)
- "View SDK": Card lift + arrow slide animation

---

### 8. `pages/products/PapersPage.tsx`

| Line | Button Text          | Issue                | Suggested Fix                                        |
| ---- | -------------------- | -------------------- | ---------------------------------------------------- |
| 60   | **See it in action** | No `onClick` handler | Navigate to `/how-it-works` or open demo video modal |

**Animation Plan:**

- Play icon with pulse animation + modal with video player slide-up

---

## 🎨 Global Animation Patterns to Apply

### Recommended Animation Library

The project already uses `motion` from `"motion/react"`. All animations should use this library for consistency.

### Standard Button Interactions

```tsx
// Apply to ALL clickable buttons
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
```

### Modal Animations

```tsx
// Backdrop
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  {/* Content */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 20 }}
    transition={{ type: "spring", duration: 0.3 }}
  >
```

### Toast / Feedback Animations

```tsx
// Success feedback after action
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 50 }}
  transition={{ type: "spring", stiffness: 300 }}
>
```

### Tooltip Animations

```tsx
// "Copied!" / "Link shared!" tooltips
<motion.span
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
```

---

## 🔧 Implementation Priority

### 🔴 High Priority (User-facing, core functionality)

1. **PaperDetailPage** – Share, Download, View PDF, Add Annotation
2. **EnhancedDashboardPage** – Fix Quick Action paths, Add Goal, Get Recommendations
3. **TeamMembersPage** – All modal actions (View Profile, Change Role, Remove)

### 🟡 Medium Priority (Important but non-blocking)

4. **ProfilePage** – View Full Analytics, Connect ResearchGate
5. **CommunityPage** – Join Community, View All Discussions
6. **APIPage** – Copy code, Get API Key

### 🟢 Low Priority (Marketing/informational pages)

7. **PressPage** – All press action buttons
8. **products/PapersPage** – See it in action

---

## ✅ Pages Confirmed Fully Dynamic (No Issues Found)

The following pages have all buttons properly connected to `onClick` handlers:

- `DashboardPage.tsx` – All buttons use `onNavigate` callbacks
- `Hero.tsx` – "Get Started" and "How It Works" properly wired
- `CTA.tsx` – "Start Free Trial" and "View FAQs" properly wired
- `Navbar.tsx` – All nav items and auth buttons properly wired
- `Footer.tsx` – All links use `onNavigate`
- `OnboardingPage.tsx` – Back, Skip, and Next buttons all wired
- `ErrorPage.tsx` – Reset and Go Home buttons all wired
- `PricingPage.tsx` – Plan selection buttons use `onNavigate`
- `FeaturesPage.tsx` – CTA buttons use `onNavigate`
- `HowItWorksPage.tsx` – CTA buttons use `onNavigate`
- `ActivityLogPage.tsx` – Export button has handler
- `DiscussionsPage.tsx` – Create discussion buttons wired
