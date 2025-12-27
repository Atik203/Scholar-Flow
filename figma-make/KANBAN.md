# ScholarFlow UI/UX Design - Jira Kanban Plan

## Project Overview

Designing complete UI/UX for ScholarFlow research collaboration platform with 102 pages across 4 design variants (web dark, web light, mobile dark, mobile light). All designs created from scratch in Figma with full design system, component library, and interactive prototypes.

## Board structure

- Columns: Backlog → Ready for Design → In Progress → Review → Done
- Swimlanes: one per variant (web-dark, web-light, mobile-dark, mobile-light) to track design parity
- Every card references specific pages from PAGE_LIST.md (102 total pages)
- Sprint duration: 2 weeks with daily standups and design critiques

## Team assignments

- **Sourov (Web Dark Theme Designer):** creates all dark mode web designs for 102 pages, establishes dark palette and component styles
- **Rohan (Web Light Theme Designer):** creates all light mode web designs for 102 pages, ensures accessibility compliance and contrast ratios
- **Prottoy (Mobile Dark Theme Designer):** designs mobile dark version for all 102 pages with responsive layouts and touch interactions
- **Salman (Mobile Light Theme Designer):** designs mobile light version for all 102 pages with optimized brightness for outdoor viewing
- **You (Lead Designer & Project Manager):** coordinates all design work, maintains design system consistency, conducts design reviews, prepares developer handoff

## Epics & Tasks

1. **Epic: Foundation & Design System Setup**
   - **Task: Create design system foundation** _(Assignee: You)_ `[all-themes]`
     - Subtask: Define color palettes for all 4 variants `[all-themes]`
     - Subtask: Establish typography scale and font families `[all-themes]`
   - **Task: Build component library structure** _(Assignee: You)_ `[all-themes]`
     - Subtask: Create base UI components (buttons, inputs, cards) `[all-themes]`
     - Subtask: Design navigation components (sidebar, navbar, breadcrumbs) `[all-themes]`
   - **Task: Design iconography and illustration system** _(Assignee: You)_ `[all-themes]`
     - Subtask: Create custom icon set for research platform `[all-themes]`
     - Subtask: Design illustration style for empty states `[all-themes]`
   - **Task: Establish spacing and layout grids** _(Assignee: You)_ `[all-themes]`
     - Subtask: Define 8pt grid system for consistent spacing `[all-themes]`
     - Subtask: Create responsive breakpoints for mobile/tablet/desktop `[all-themes]`

2. **Epic: Authentication & Onboarding Designs (8 pages)**
   - **Task: Design login and registration flows** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create login page with email and OAuth options `[web-dark]`
     - Subtask: Design registration form with validation states `[web-dark]`
   - **Task: Design password recovery flows** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create forgot password page with email input `[web-dark]`
     - Subtask: Design reset password page with strength indicator `[web-dark]`
   - **Task: Design onboarding experience** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create role selection page for user types `[web-dark]`
     - Subtask: Design workspace setup wizard with progress indicator `[web-dark]`
   - **Task: Adapt authentication flows for light theme** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Apply light palette to all auth pages `[web-light]`
     - Subtask: Ensure WCAG AAA contrast compliance `[web-light]`

3. **Epic: Dashboard & Core Navigation (12 pages)**
   - **Task: Design main dashboard layout** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create dashboard with activity feed and quick actions `[web-dark]`
     - Subtask: Design enhanced dashboard with analytics widgets `[web-dark]`
   - **Task: Design sidebar navigation system** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create collapsible sidebar with role-based menu items `[web-dark]`
     - Subtask: Design breadcrumb navigation for deep pages `[web-dark]`
   - **Task: Design activity and logs pages** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create recent activity page with timeline view `[web-dark]`
     - Subtask: Design activity log with filtering and search `[web-dark]`
   - **Task: Create light theme dashboard variants** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Adapt dashboard layout to light mode `[web-light]`
     - Subtask: Design hover and focus states for accessibility `[web-light]`

4. **Epic: Papers Management Module (7 pages)**
   - **Task: Design papers listing and grid views** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create papers page with list and card view options `[web-dark]`
     - Subtask: Design paper card with metadata and preview thumbnail `[web-dark]`
   - **Task: Design paper upload interface** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create drag-and-drop upload area with progress indicator `[web-dark]`
     - Subtask: Design batch upload with file validation feedback `[web-dark]`
   - **Task: Design paper search and filters** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create advanced search with multiple filter options `[web-dark]`
     - Subtask: Design search results page with sorting controls `[web-dark]`
   - **Task: Design paper details and relations** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create paper detail page with full metadata display `[web-dark]`
     - Subtask: Design citation graph visualization for paper relations `[web-dark]`
   - **Task: Adapt papers module to light theme** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Apply light theme to all paper management pages `[web-light]`
     - Subtask: Optimize card shadows and elevation for light mode `[web-light]`

5. **Epic: Collections & Workspaces (8 pages)**
   - **Task: Design collections management** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create collections page with grid layout `[web-dark]`
     - Subtask: Design collection creation modal with folder structure `[web-dark]`
   - **Task: Design workspace interfaces** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create workspaces page with shared and private sections `[web-dark]`
     - Subtask: Design workspace detail page with member management `[web-dark]`
   - **Task: Design sharing and permissions** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create shared collections page with access indicators `[web-dark]`
     - Subtask: Design permission modal with role assignment `[web-dark]`
   - **Task: Create light theme collections variants** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Adapt all collection pages to light theme `[web-light]`
     - Subtask: Design collaboration indicators for light mode `[web-light]`

6. **Epic: Research Tools & Features (8 pages)**
   - **Task: Design PDF extraction interface** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create PDF viewer with text extraction controls `[web-dark]`
     - Subtask: Design extracted content editor with formatting `[web-dark]`
   - **Task: Design rich text editor** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create toolbar with formatting and collaboration tools `[web-dark]`
     - Subtask: Design real-time collaboration indicators `[web-dark]`
   - **Task: Design citation and annotation tools** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create citations page with automatic formatting `[web-dark]`
     - Subtask: Design annotation sidebar with highlighting tools `[web-dark]`
   - **Task: Design advanced research visualizations** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create citation graph with interactive nodes `[web-dark]`
     - Subtask: Design research map with timeline and connections `[web-dark]`
   - **Task: Adapt research tools to light theme** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Apply light theme to all research tool pages `[web-light]`
     - Subtask: Optimize visualization colors for light backgrounds `[web-light]`

7. **Epic: Admin, Analytics & Settings (25 pages)**
   - **Task: Design admin dashboard and user management** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create admin overview with system metrics `[web-dark]`
     - Subtask: Design user management table with bulk actions `[web-dark]`
   - **Task: Design analytics and reporting interfaces** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create analytics dashboard with charts and graphs `[web-dark]`
     - Subtask: Design export reports page with scheduling options `[web-dark]`
   - **Task: Design settings and security pages** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Create profile settings with avatar upload `[web-dark]`
     - Subtask: Design two-factor authentication setup wizard `[web-dark]`
   - **Task: Adapt admin modules to light theme** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Apply light theme to all admin and analytics pages `[web-light]`
     - Subtask: Optimize data visualization colors for light mode `[web-light]`

8. **Epic: Marketing & Public Pages (16 pages)**
   - **Task: Design landing and marketing pages** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Create hero section with animated illustrations `[web-light]`
     - Subtask: Design features page with icon grid layout `[web-light]`
   - **Task: Design pricing and enterprise pages** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Create pricing comparison table with toggle `[web-light]`
     - Subtask: Design enterprise page with contact form `[web-light]`
   - **Task: Design resource and company pages** _(Assignee: Rohan)_ `[web-light]`
     - Subtask: Create documentation page with sidebar navigation `[web-light]`
     - Subtask: Design about and careers pages with team grid `[web-light]`
   - **Task: Adapt marketing pages to dark theme** _(Assignee: Sourov)_ `[web-dark]`
     - Subtask: Apply dark theme to all public-facing pages `[web-dark]`
     - Subtask: Optimize hero animations for dark backgrounds `[web-dark]`

9. **Epic: Mobile Responsive Design (102 pages)**
   - **Task: Design mobile navigation patterns** _(Assignee: Prottoy)_ `[mobile-dark]`
     - Subtask: Create bottom tab bar navigation for main sections `[mobile-dark]`
     - Subtask: Design hamburger menu for secondary navigation `[mobile-dark]`
   - **Task: Design mobile authentication flows** _(Assignee: Prottoy)_ `[mobile-dark]`
     - Subtask: Adapt all 8 auth pages for mobile viewports `[mobile-dark]`
     - Subtask: Design touch-optimized input fields and buttons `[mobile-dark]`
   - **Task: Design mobile dashboard and papers** _(Assignee: Prottoy)_ `[mobile-dark]`
     - Subtask: Create mobile dashboard with swipeable cards `[mobile-dark]`
     - Subtask: Design mobile paper list with infinite scroll `[mobile-dark]`
   - **Task: Design mobile research tools** _(Assignee: Prottoy)_ `[mobile-dark]`
     - Subtask: Create mobile PDF viewer with gesture controls `[mobile-dark]`
     - Subtask: Design mobile annotation tools with touch drawing `[mobile-dark]`
   - **Task: Design mobile admin and settings** _(Assignee: Prottoy)_ `[mobile-dark]`
     - Subtask: Adapt complex admin tables for mobile screens `[mobile-dark]`
     - Subtask: Design mobile-optimized settings forms `[mobile-dark]`
   - **Task: Create mobile light theme variants** _(Assignee: Salman)_ `[mobile-light]`
     - Subtask: Apply light theme to all mobile auth pages `[mobile-light]`
     - Subtask: Adapt mobile dashboard and papers to light mode `[mobile-light]`
   - **Task: Optimize mobile light for readability** _(Assignee: Salman)_ `[mobile-light]`
     - Subtask: Enhance mobile light contrast for outdoor viewing `[mobile-light]`
     - Subtask: Design mobile light CTAs with sufficient touch targets `[mobile-light]`

10. **Epic: Prototyping & User Testing**
    - **Task: Create interactive prototypes** _(Assignee: You)_ `[all-themes]`
      - Subtask: Build clickable prototype for main user flows `[all-themes]`
      - Subtask: Add micro-interactions and transitions `[all-themes]`
    - **Task: Conduct usability testing sessions** _(Assignee: You)_ `[all-themes]`
      - Subtask: Test authentication and onboarding flows with users `[all-themes]`
      - Subtask: Gather feedback on paper management workflows `[all-themes]`
    - **Task: Iterate designs based on feedback** _(Assignee: You)_ `[all-themes]`
      - Subtask: Update designs with usability improvements `[all-themes]`
      - Subtask: Refine navigation patterns based on user testing `[all-themes]`

11. **Epic: Design QA & Developer Handoff**
    - **Task: Conduct design consistency review** _(Assignee: You)_ `[all-themes]`
      - Subtask: Verify all 102 pages follow design system guidelines `[all-themes]`
      - Subtask: Check typography and spacing consistency across variants `[all-themes]`
    - **Task: Prepare component documentation** _(Assignee: You)_ `[all-themes]`
      - Subtask: Document all components with usage guidelines `[all-themes]`
      - Subtask: Create interaction specs for animations and transitions `[all-themes]`
    - **Task: Export design assets** _(Assignee: You)_ `[all-themes]`
      - Subtask: Generate icon assets in multiple sizes and formats `[all-themes]`
      - Subtask: Export image assets with proper naming conventions `[all-themes]`
    - **Task: Create developer handoff package** _(Assignee: You)_ `[all-themes]`
      - Subtask: Prepare design specs with measurements and colors `[all-themes]`
      - Subtask: Document responsive breakpoints and grid system `[all-themes]`
    - **Task: Conduct design walkthrough with developers** _(Assignee: You)_ `[all-themes]`
      - Subtask: Present designs and answer technical questions `[all-themes]`
      - Subtask: Clarify interaction behaviors and edge cases `[all-themes]`

## Delivery notes

- Label every Jira card with its theme tag (`web-dark`, `web-light`, `mobile-dark`, `mobile-light`) so filters show progress per version.
- Track blockers in the Review column and document decisions in the ticket comments for transparency.
- Use this Kanban plan as the source of truth for sprint planning, blockers, and QA signoff readiness.
