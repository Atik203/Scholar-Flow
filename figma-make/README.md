# ScholarFlow - Figma Make UI Components

**Complete React UI Components for Figma Make AI**

All 102 pages are fully implemented and navigable. Just paste this into Figma Make and it works!

---

## 🚀 Quick Start

1. Copy the entire `figma-make` folder
2. Paste into Figma Make AI
3. All components and navigation work automatically

For the Jira Kanban flow behind the 101-page rollout, see [KANBAN.md](KANBAN.md).

---

## 📁 Folder Structure

```
figma-make/
├── App.tsx                    # Main entry point - handles all routing
├── routes.tsx                 # Route definitions and helpers
├── DashboardRouter.tsx        # Dashboard routing logic
├── PAGE_LIST.md               # Complete page reference (102 pages)
│
├── components/
│   ├── index.ts               # Component barrel exports
│   │
│   ├── context/               # React Context providers
│   │   ├── index.ts
│   │   └── RoleContext.tsx    # Role persistence (researcher/admin/etc.)
│   │
│   ├── layout/                # Layout components
│   │   ├── index.ts
│   │   ├── AppSidebar.tsx     # Role-based sidebar navigation
│   │   ├── AuthenticatedNavbar.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── PageContainer.tsx
│   │
│   ├── sections/              # Landing page sections
│   │   ├── Comparison.tsx
│   │   ├── CTA.tsx
│   │   ├── FAQ.tsx
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Integrations.tsx
│   │   ├── Newsletter.tsx
│   │   └── Testimonials.tsx
│   │
│   ├── form/                  # Form components
│   │   └── ScholarFlowForm.tsx
│   │
│   ├── figma/                 # Figma-specific components
│   │
│   └── ui/                    # ShadCN-based UI primitives
│       ├── index.ts
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── button-group.tsx
│       ├── card.tsx
│       ├── card-variants.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── loading-spinner.tsx
│       ├── loading-states.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── tooltip.tsx
│       ├── cards/             # Card variants
│       └── modal/             # Modal components
│
├── pages/
│   ├── index.ts               # Page barrel exports
│   │
│   │── Auth & Onboarding
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── OnboardingPage.tsx
│   │
│   │── Main Pages
│   ├── DashboardPage.tsx
│   ├── PaperDetailPage.tsx
│   ├── ProfilePage.tsx
│   ├── SettingsPage.tsx
│   ├── PricingPage.tsx
│   ├── FAQPage.tsx
│   │
│   │── Marketing Pages
│   ├── FeaturesPage.tsx
│   ├── HowItWorksPage.tsx
│   │
│   │── Utility Pages
│   ├── ErrorPage.tsx
│   ├── LoadingPage.tsx
│   ├── NotFoundPage.tsx
│   │
│   ├── admin/                 # Admin pages (Phase 4-7)
│   │   ├── index.ts
│   │   ├── AdminAPIKeysPage.tsx
│   │   ├── AdminAuditLogPage.tsx
│   │   ├── AdminContentModerationPage.tsx
│   │   ├── AdminPaymentsPage.tsx
│   │   ├── AdminPlansPage.tsx
│   │   ├── AdminReportsPage.tsx
│   │   └── AdminWebhooksPage.tsx
│   │
│   ├── analytics/             # Analytics pages
│   │   ├── index.ts
│   │   ├── ExportAnalyticsPage.tsx
│   │   ├── PersonalAnalyticsPage.tsx
│   │   ├── UsageReportsPage.tsx
│   │   └── WorkspaceAnalyticsPage.tsx
│   │
│   ├── company/               # Company pages
│   │   ├── index.ts
│   │   ├── AboutPage.tsx
│   │   ├── CareersPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── PressPage.tsx
│   │
│   ├── dashboard/             # Dashboard module pages
│   │   ├── index.ts
│   │   ├── ActivityLogPage.tsx
│   │   ├── AIInsightsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── BillingPage.tsx
│   │   ├── CollectionsPage.tsx
│   │   ├── DiscussionsPage.tsx
│   │   ├── EnhancedDashboardPage.tsx
│   │   ├── GlobalSearchPage.tsx
│   │   ├── HelpCenterPage.tsx
│   │   ├── KeyboardShortcutsPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── PapersPage.tsx
│   │   ├── RecentActivityPage.tsx
│   │   ├── ResearchNotesPage.tsx
│   │   ├── ResearchPage.tsx
│   │   ├── TeamMembersPage.tsx
│   │   ├── WorkspacesPage.tsx
│   │   │
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── index.ts
│   │   │   ├── AdminOverviewPage.tsx
│   │   │   ├── SubscriptionsPage.tsx
│   │   │   ├── SystemSettingsPage.tsx
│   │   │   └── UserManagementPage.tsx
│   │   │
│   │   ├── collections/       # Collections module
│   │   │   ├── index.ts
│   │   │   ├── CollectionDetailsPage.tsx
│   │   │   ├── CreateCollectionPage.tsx
│   │   │   └── SharedCollectionsPage.tsx
│   │   │
│   │   ├── papers/            # Papers module
│   │   │   ├── index.ts
│   │   │   ├── PaperDetailsPage.tsx
│   │   │   ├── SearchPapersPage.tsx
│   │   │   └── UploadPaperPage.tsx
│   │   │
│   │   ├── research/          # Research module
│   │   │   ├── index.ts
│   │   │   ├── AnnotationsPage.tsx
│   │   │   ├── CitationsPage.tsx
│   │   │   ├── PdfExtractionPage.tsx
│   │   │   └── TextEditorPage.tsx
│   │   │
│   │   └── workspaces/        # Workspaces module
│   │       ├── index.ts
│   │       ├── CreateWorkspacePage.tsx
│   │       ├── SharedWorkspacesPage.tsx
│   │       └── WorkspaceDetailsPage.tsx
│   │
│   ├── discover/              # Discover page
│   │   ├── index.ts
│   │   └── DiscoverPage.tsx
│   │
│   ├── enterprise/            # Enterprise pages
│   │   ├── index.ts
│   │   ├── EnterprisePage.tsx
│   │   ├── IntegrationsPage.tsx
│   │   ├── SupportPage.tsx
│   │   └── TeamsPage.tsx
│   │
│   ├── invitations/           # Invitation pages
│   │   ├── index.ts
│   │   └── InvitationResponsePage.tsx
│   │
│   ├── notifications/         # Notification pages
│   │   ├── index.ts
│   │   ├── NotificationCenterPage.tsx
│   │   ├── NotificationHistoryPage.tsx
│   │   └── NotificationSettingsPage.tsx
│   │
│   ├── onboarding/            # Onboarding flow
│   │   ├── index.ts
│   │   ├── OnboardingRolePage.tsx
│   │   └── OnboardingWorkspacePage.tsx
│   │
│   ├── papers/                # Paper management
│   │   ├── index.ts
│   │   ├── ImportPapersPage.tsx
│   │   └── PaperRelationsPage.tsx
│   │
│   ├── products/              # Product pages
│   │   ├── index.ts
│   │   ├── AIInsightsPage.tsx
│   │   ├── CollaboratePage.tsx
│   │   ├── CollectionsPage.tsx
│   │   └── PapersPage.tsx
│   │
│   ├── research/              # Research tools
│   │   ├── index.ts
│   │   ├── CitationGraphPage.tsx
│   │   └── ResearchMapPage.tsx
│   │
│   ├── resources/             # Resource pages
│   │   ├── index.ts
│   │   ├── APIPage.tsx
│   │   ├── CommunityPage.tsx
│   │   ├── DocsPage.tsx
│   │   └── TutorialsPage.tsx
│   │
│   ├── search/                # Search pages
│   │   ├── index.ts
│   │   └── SearchHistoryPage.tsx
│   │
│   ├── security/              # Security pages
│   │   ├── index.ts
│   │   ├── ActiveSessionsPage.tsx
│   │   ├── PrivacySettingsPage.tsx
│   │   ├── SecurityDashboardPage.tsx
│   │   └── TwoFactorSetupPage.tsx
│   │
│   ├── settings/              # Settings pages
│   │   ├── index.ts
│   │   ├── ExportDataPage.tsx
│   │   └── IntegrationsSettingsPage.tsx
│   │
│   └── team/                  # Team pages
│       ├── index.ts
│       ├── CollaboratorProfilePage.tsx
│       ├── TeamActivityPage.tsx
│       ├── TeamInvitationsPage.tsx
│       └── TeamSettingsPage.tsx
│
├── styles/
│   └── globals.css            # Tailwind + custom styles
│
└── guidelines/                # Design guidelines & docs
```

---

## 🎯 All 102 Pages

### Auth & Onboarding (8 pages)

| Page                    | Path                    | Access      |
| ----------------------- | ----------------------- | ----------- |
| LoginPage               | `/login`                | Public      |
| RegisterPage            | `/register`             | Public      |
| ForgotPasswordPage      | `/forgot-password`      | Public      |
| ResetPasswordPage       | `/reset-password`       | Email link  |
| VerifyEmailPage         | `/verify-email`         | Email link  |
| OnboardingPage          | `/onboarding`           | After login |
| OnboardingRolePage      | `/onboarding/role`      | Onboarding  |
| OnboardingWorkspacePage | `/onboarding/workspace` | Onboarding  |

### Dashboard (4 pages)

| Page                  | Path                  | Access  |
| --------------------- | --------------------- | ------- |
| DashboardPage         | `/dashboard`          | Sidebar |
| EnhancedDashboardPage | `/dashboard-enhanced` | Sidebar |
| RecentActivityPage    | `/recent-activity`    | Sidebar |
| ActivityLogPage       | `/activity-log`       | Sidebar |

### Papers (7 pages)

| Page               | Path                    | Access        |
| ------------------ | ----------------------- | ------------- |
| PapersPage         | `/papers`               | Sidebar       |
| UploadPaperPage    | `/papers/upload`        | Sidebar       |
| SearchPapersPage   | `/papers/search`        | Sidebar       |
| PaperDetailsPage   | `/papers/:id`           | Click paper   |
| PaperDetailPage    | `/paper/:id`            | Paper card    |
| ImportPapersPage   | `/papers/import`        | Sidebar       |
| PaperRelationsPage | `/papers/:id/relations` | Paper details |

### Collections (4 pages)

| Page                  | Path                  | Access  |
| --------------------- | --------------------- | ------- |
| CollectionsPage       | `/collections`        | Sidebar |
| CreateCollectionPage  | `/collections/create` | Button  |
| SharedCollectionsPage | `/collections/shared` | Sidebar |
| CollectionDetailsPage | `/collections/:id`    | Click   |

### Workspaces (4 pages)

| Page                 | Path                 | Access  |
| -------------------- | -------------------- | ------- |
| WorkspacesPage       | `/workspaces`        | Sidebar |
| CreateWorkspacePage  | `/workspaces/create` | Button  |
| SharedWorkspacesPage | `/workspaces/shared` | Sidebar |
| WorkspaceDetailsPage | `/workspaces/:id`    | Click   |

### Research (8 pages)

| Page              | Path                       | Access  |
| ----------------- | -------------------------- | ------- |
| ResearchPage      | `/research`                | Sidebar |
| PdfExtractionPage | `/research/pdf-extraction` | Sidebar |
| TextEditorPage    | `/research/editor`         | Sidebar |
| CitationsPage     | `/research/citations`      | Sidebar |
| AnnotationsPage   | `/research/annotations`    | Sidebar |
| CitationGraphPage | `/research/citation-graph` | Pro+    |
| ResearchMapPage   | `/research/map`            | Pro+    |
| ResearchNotesPage | `/research-notes`          | Sidebar |

### Notifications (4 pages)

| Page                     | Path                      | Access  |
| ------------------------ | ------------------------- | ------- |
| NotificationsPage        | `/notifications`          | Sidebar |
| NotificationCenterPage   | `/notifications/center`   | Sidebar |
| NotificationHistoryPage  | `/notifications/history`  | Sidebar |
| NotificationSettingsPage | `/notifications/settings` | Sidebar |

### Team (6 pages) - Team Lead+

| Page                    | Path                 | Access     |
| ----------------------- | -------------------- | ---------- |
| TeamMembersPage         | `/team`              | Sidebar    |
| TeamInvitationsPage     | `/team/invitations`  | Sidebar    |
| TeamActivityPage        | `/team/activity`     | Sidebar    |
| TeamSettingsPage        | `/team/settings`     | Sidebar    |
| CollaboratorProfilePage | `/collaborator/:id`  | Click name |
| InvitationResponsePage  | `/invitation/:token` | Email      |

### Security (4 pages)

| Page                  | Path                 | Access  |
| --------------------- | -------------------- | ------- |
| SecurityDashboardPage | `/security`          | Sidebar |
| TwoFactorSetupPage    | `/security/2fa`      | Sidebar |
| ActiveSessionsPage    | `/security/sessions` | Sidebar |
| PrivacySettingsPage   | `/privacy`           | Sidebar |

### Analytics (5 pages)

| Page                   | Path                   | Access     |
| ---------------------- | ---------------------- | ---------- |
| AnalyticsPage          | `/analytics`           | Sidebar    |
| PersonalAnalyticsPage  | `/analytics/personal`  | Sidebar    |
| WorkspaceAnalyticsPage | `/analytics/workspace` | Team Lead+ |
| UsageReportsPage       | `/analytics/usage`     | Pro+       |
| ExportAnalyticsPage    | `/analytics/export`    | Pro+       |

### Search & Discovery (3 pages)

| Page              | Path              | Access       |
| ----------------- | ----------------- | ------------ |
| GlobalSearchPage  | `/search`         | Header/Cmd+K |
| SearchHistoryPage | `/search/history` | Search menu  |
| DiscoverPage      | `/discover`       | Sidebar      |

### Help & Settings (6 pages)

| Page                  | Path               | Access    |
| --------------------- | ------------------ | --------- |
| HelpCenterPage        | `/help`            | Sidebar   |
| KeyboardShortcutsPage | `/help/shortcuts`  | Sidebar   |
| ProfilePage           | `/profile`         | User menu |
| SettingsPage          | `/settings`        | User menu |
| BillingPage           | `/billing`         | Sidebar   |
| ExportDataPage        | `/settings/export` | Settings  |

---

| IntegrationsSettingsPage | `/settings/integrations` | Settings |

---

### AI & Insights (2 pages)

| Page            | Path           | Access        |
| --------------- | -------------- | ------------- |
| AIInsightsPage  | `/ai-insights` | Sidebar       |
| DiscussionsPage | `/discussions` | Paper details |

### Admin (11 pages) - Admin Only

| Page                       | Path                   | Access  |
| -------------------------- | ---------------------- | ------- |
| AdminOverviewPage          | `/admin-overview`      | Sidebar |
| UserManagementPage         | `/admin/users`         | Sidebar |
| SubscriptionsPage          | `/admin/subscriptions` | Sidebar |
| SystemSettingsPage         | `/admin/settings`      | Sidebar |
| AdminReportsPage           | `/admin/reports`       | Sidebar |
| AdminAuditLogPage          | `/admin/audit`         | Sidebar |
| AdminPlansPage             | `/admin/plans`         | Sidebar |
| AdminPaymentsPage          | `/admin/payments`      | Sidebar |
| AdminWebhooksPage          | `/admin/webhooks`      | Sidebar |
| AdminAPIKeysPage           | `/admin/api-keys`      | Sidebar |
| AdminContentModerationPage | `/admin/moderation`    | Sidebar |

### Marketing/Public (4 pages)

| Page           | Path            | Access        |
| -------------- | --------------- | ------------- |
| FeaturesPage   | `/features`     | Public navbar |
| HowItWorksPage | `/how-it-works` | Public navbar |
| PricingPage    | `/pricing`      | Public navbar |
| FAQPage        | `/faq`          | Public navbar |

### Products (4 pages)

| Page                   | Path                    | Access |
| ---------------------- | ----------------------- | ------ |
| PapersProductPage      | `/products/papers`      | Footer |
| CollectionsProductPage | `/products/collections` | Footer |
| CollaborateProductPage | `/products/collaborate` | Footer |
| AIInsightsProductPage  | `/products/ai-insights` | Footer |

### Resources (4 pages)

| Page          | Path                   | Access |
| ------------- | ---------------------- | ------ |
| DocsPage      | `/resources/docs`      | Footer |
| TutorialsPage | `/resources/tutorials` | Footer |
| APIPage       | `/resources/api`       | Footer |
| CommunityPage | `/resources/community` | Footer |

### Company (4 pages)

| Page        | Path               | Access |
| ----------- | ------------------ | ------ |
| AboutPage   | `/company/about`   | Footer |
| CareersPage | `/company/careers` | Footer |
| ContactPage | `/company/contact` | Footer |
| PressPage   | `/company/press`   | Footer |

### Enterprise (4 pages)

| Page             | Path                       | Access        |
| ---------------- | -------------------------- | ------------- |
| EnterprisePage   | `/enterprise`              | Public navbar |
| TeamsPage        | `/enterprise/teams`        | Enterprise    |
| IntegrationsPage | `/enterprise/integrations` | Enterprise    |
| SupportPage      | `/enterprise/support`      | Enterprise    |

### Utility (3 pages)

| Page         | Path         | Access        |
| ------------ | ------------ | ------------- |
| NotFoundPage | `/not-found` | 404           |
| ErrorPage    | `/error`     | Error         |
| LoadingPage  | `/loading`   | Loading state |

---

## 🔐 Role-Based Access

### Roles

- **Researcher** - Basic access
- **Pro Researcher** - + Citation Graph, Research Map, Usage Reports
- **Team Lead** - + Team Management, Workspace Analytics
- **Admin** - Full access including Admin panel

### Role Persistence

The `RoleContext` ensures role persists when navigating between pages:

- Login as admin → navigate to `/papers` → still shows admin layout
- Role only changes when explicitly visiting `/dashboard/admin`, `/dashboard/researcher`, etc.

---

## 🎨 Design System

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI (customized)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

---

## 📱 Navigation

### Sidebar Navigation

All authenticated pages use `DashboardLayout` with `AppSidebar`:

- Role-based menu items
- Collapsible sections
- Active state highlighting
- Quick actions

### Navigation Handler

```tsx
// All pages accept onNavigate prop
interface PageProps {
  onNavigate: (path: string) => void;
}

// Usage in any page
<Button onClick={() => onNavigate("/papers")}>Go to Papers</Button>;
```

---

## ✅ All 99 Pages Complete

**Last Updated:** November 30, 2025  
**Author:** Md. Atikur Rahaman (GitHub: Atik203)
