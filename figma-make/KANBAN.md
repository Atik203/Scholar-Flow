# Jira Kanban Plan

## Board structure

- Columns: Backlog → Ready for Design → In Progress → Review → Done.
- Swimlanes: one per version (web-dark, web-light, mobile-dark, mobile-light) so parity between themes is always visible.
- Every card links back to PAGE_LIST.md so stakeholders can trace the work to one of the 101 documented screens.

## Team assignments

- **Aria (Web Dark):** owns the dark web experience, the core dashboard/paper/collection journeys, and ensures the shared palette matches the brand spec.
- **Bruno (Web Light):** owns the light web experience, tuning brightness, contrast, and marketing page variants while capturing accessibility parity with Aria’s work.
- **Camille (Mobile Dark):** owns the dark mobile experience, translating the desktop journeys into gesture-friendly flows and modal behaviors.
- **Dara (Mobile Light):** owns the light mobile experience, brightening CTAs and tab bars while keeping interaction parity with Camille.
- **You (Team Lead & Multi-role Designer):** orchestrate the epics, coach the four designers, review every deliverable, and serve as shared visual QA across all versions.

## Epics & Tasks

1. **Epic: Web Theme Duality**
   - **Task: Deliver Web Dark Experience** _(Assignee: Aria)_
     - Subtask: Audit all dashboard, paper, and workspace pages in PAGE_LIST for component coverage and note any environment additions.
     - Subtask: Refresh the dark palette tokens, dropout overlays, and gradient streaks to match the master design system.
     - Subtask: Validate the hero, section, and drawer states on `/dashboard`, `/papers`, and `/collections` so behaviors stay consistent.
   - **Task: Deliver Web Light Experience** _(Assignee: Bruno)_
     - Subtask: Align the light palette, link hovers, and elevated cards with the shared token library.
     - Subtask: Rework CTA, badge, and accordion states on `/features`, `/how-it-works`, and `/pricing`.
     - Subtask: Capture and apply feedback from Aria to keep both web themes in sync.

2. **Epic: Mobile Theme Parity**
   - **Task: Assemble Mobile Dark Journey** _(Assignee: Camille)_
     - Subtask: Map the navigation flow for the first 30 pages (dashboard, papers, collections) into gesture-friendly cards.
     - Subtask: Reconcile spacing between mobile-only components (bottom sheets, floating action buttons) and the dark palette.
     - Subtask: Run the prototype through PAGE_LIST to confirm every research tool and notification screen remains reachable.
   - **Task: Assemble Mobile Light Journey** _(Assignee: Dara)_
     - Subtask: Mirror the same navigation path while brightening CTA states, icons, and tab bars for daylight viewing.
     - Subtask: Coordinate with Bruno on branded gradients so the light mobile feeling matches the web-light experience.
     - Subtask: Pair with Camille on pinch/scroll thresholds so toggling between light and dark mockups is smooth for QA.

3. **Epic: Cross-Version Quality & Delivery**
   - **Task: Kanban Orchestration & Documentation** _(Assignee: You)_
     - Subtask: Create and maintain the Jira board, ensuring each story has Epic, Task, and Subtask labels consistent with this plan.
     - Subtask: Facilitate sprint reviews, capture blockers, and shepherd cards through Review once tokens sync across versions.
     - Subtask: Draft final handoff notes, log discrepancies against PAGE_LIST expectations, and signal readiness for implementation.
   - **Task: Quality Review & Visual QA** _(Assignee: You with paired designers)_
     - Subtask: Run comparative checklists (web dark vs. web light, mobile dark vs. mobile light) and surface any per-page gaps.
     - Subtask: Share annotated visual QA snapshots with developers to highlight deviations from the design system.
     - Subtask: Confirm the Jira board reflects status changes (e.g., Review → Done) once paired QA is signed off.

## Delivery notes

- Label every Jira card with its theme tag (`web-dark`, `web-light`, `mobile-dark`, `mobile-light`) so filters show progress per version.
- Track blockers in the Review column and document decisions in the ticket comments for transparency.
- Use this Kanban plan as the source of truth for sprint planning, blockers, and QA signoff readiness.
