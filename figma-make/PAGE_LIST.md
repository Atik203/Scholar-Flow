# ScholarFlow UI Pages & Navigation Guide

**Author:** Md. Atikur Rahaman (GitHub: Atik203)  
**Last Updated:** November 30, 2025  
**Status:** All 102 Pages Complete

---

## Quick Navigation Reference

### All Pages with Access Location

| #                      | Page                       | Path                        | Access From                     |
| ---------------------- | -------------------------- | --------------------------- | ------------------------------- |
| **Auth & Onboarding**  |                            |                             |                                 |
| 1                      | LoginPage                  | `/login`                    | Public route                    |
| 2                      | RegisterPage               | `/register`                 | Public route                    |
| 3                      | ForgotPasswordPage         | `/forgot-password`          | Login page                      |
| 4                      | ResetPasswordPage          | `/reset-password`           | Email link                      |
| 5                      | VerifyEmailPage            | `/verify-email`             | Email link                      |
| 6                      | OnboardingPage             | `/onboarding`               | After first login               |
| 7                      | OnboardingRolePage         | `/onboarding/role`          | Onboarding flow                 |
| 8                      | OnboardingWorkspacePage    | `/onboarding/workspace`     | Onboarding flow                 |
| **Dashboard**          |                            |                             |                                 |
| 9                      | DashboardPage              | `/dashboard`                | Sidebar: Dashboard              |
| 10                     | EnhancedDashboardPage      | `/dashboard-enhanced`       | Sidebar: Dashboard (alt)        |
| 11                     | RecentActivityPage         | `/recent-activity`          | Sidebar submenu                 |
| 12                     | ActivityLogPage            | `/activity-log`             | Sidebar submenu                 |
| **Papers**             |                            |                             |                                 |
| 13                     | PapersPage                 | `/papers`                   | Sidebar: Papers > All           |
| 14                     | UploadPaperPage            | `/papers/upload`            | Sidebar: Papers > Upload        |
| 15                     | SearchPapersPage           | `/papers/search`            | Sidebar: Papers > Search        |
| 16                     | PaperDetailsPage           | `/papers/:id`               | Click paper from list           |
| 17                     | PaperDetailPage            | `/paper/:id`                | Paper card click                |
| 18                     | ImportPapersPage           | `/papers/import`            | Sidebar: Papers > Import        |
| 19                     | PaperRelationsPage         | `/papers/:id/relations`     | Paper details page              |
| **Collections**        |                            |                             |                                 |
| 20                     | CollectionsPage            | `/collections`              | Sidebar: Collections            |
| 21                     | CreateCollectionPage       | `/collections/create`       | Collections page button         |
| 22                     | SharedCollectionsPage      | `/collections/shared`       | Sidebar submenu                 |
| 23                     | CollectionDetailsPage      | `/collections/:id`          | Click collection                |
| **Workspaces**         |                            |                             |                                 |
| 24                     | WorkspacesPage             | `/workspaces`               | Sidebar: Workspaces             |
| 25                     | CreateWorkspacePage        | `/workspaces/create`        | Workspaces page button          |
| 26                     | SharedWorkspacesPage       | `/workspaces/shared`        | Sidebar submenu                 |
| 27                     | WorkspaceDetailsPage       | `/workspaces/:id`           | Click workspace                 |
| **Research Tools**     |                            |                             |                                 |
| 28                     | ResearchPage               | `/research`                 | Sidebar: Research               |
| 29                     | PdfExtractionPage          | `/research/pdf-extraction`  | Sidebar: Research > PDF         |
| 30                     | TextEditorPage             | `/research/editor`          | Sidebar: Research > Editor      |
| 31                     | CitationsPage              | `/research/citations`       | Sidebar: Research > Citations   |
| 32                     | AnnotationsPage            | `/research/annotations`     | Sidebar: Research > Annotations |
| 33                     | CitationGraphPage          | `/research/citation-graph`  | Sidebar: Research (Pro+)        |
| 34                     | ResearchMapPage            | `/research/map`             | Sidebar: Research (Pro+)        |
| 35                     | ResearchNotesPage          | `/research-notes`           | Sidebar: Research > Notes       |
| **Notifications**      |                            |                             |                                 |
| 36                     | NotificationsPage          | `/notifications`            | Sidebar: Notifications          |
| 37                     | NotificationCenterPage     | `/notifications/center`     | Sidebar submenu                 |
| 38                     | NotificationHistoryPage    | `/notifications/history`    | Sidebar submenu                 |
| 39                     | NotificationSettingsPage   | `/notifications/settings`   | Sidebar submenu                 |
| **Team (Team Lead+)**  |                            |                             |                                 |
| 40                     | TeamMembersPage            | `/team`                     | Sidebar: Team > Members         |
| 41                     | TeamInvitationsPage        | `/team/invitations`         | Sidebar: Team > Invitations     |
| 42                     | TeamActivityPage           | `/team/activity`            | Sidebar: Team > Activity        |
| 43                     | TeamSettingsPage           | `/team/settings`            | Sidebar: Team > Settings        |
| 44                     | CollaboratorProfilePage    | `/collaborator/:id`         | Click collaborator name         |
| 45                     | InvitationResponsePage     | `/invitation/:token`        | Email invitation link           |
| **Security**           |                            |                             |                                 |
| 46                     | SecurityDashboardPage      | `/security`                 | Sidebar: Security               |
| 47                     | TwoFactorSetupPage         | `/security/2fa`             | Sidebar: Security > 2FA         |
| 48                     | ActiveSessionsPage         | `/security/sessions`        | Sidebar: Security > Sessions    |
| 49                     | PrivacySettingsPage        | `/privacy`                  | Sidebar: Security > Privacy     |
| **Analytics**          |                            |                             |                                 |
| 50                     | AnalyticsPage              | `/analytics`                | Sidebar: Analytics              |
| 51                     | PersonalAnalyticsPage      | `/analytics/personal`       | Sidebar submenu                 |
| 52                     | WorkspaceAnalyticsPage     | `/analytics/workspace`      | Sidebar (Team Lead+)            |
| 53                     | UsageReportsPage           | `/analytics/usage`          | Sidebar (Pro+)                  |
| 54                     | ExportAnalyticsPage        | `/analytics/export`         | Sidebar (Pro+)                  |
| **Search & Discovery** |                            |                             |                                 |
| 55                     | GlobalSearchPage           | `/search`                   | Header search / Cmd+K           |
| 56                     | SearchHistoryPage          | `/search/history`           | Search page submenu             |
| 57                     | DiscoverPage               | `/discover`                 | Sidebar: Discover > Explore     |
| 58                     | TrendingPage               | `/discover/trending`        | Sidebar: Discover > Trending    |
| 59                     | RecommendationsPage        | `/discover/recommendations` | Sidebar: Discover > AI Recs     |
| **Help**               |                            |                             |                                 |
| 60                     | HelpCenterPage             | `/help`                     | Sidebar: Help > Center          |
| 61                     | KeyboardShortcutsPage      | `/help/shortcuts`           | Sidebar: Help > Shortcuts       |
| **Settings**           |                            |                             |                                 |
| 62                     | ProfilePage                | `/profile`                  | User menu > Profile             |
| 63                     | SettingsPage               | `/settings`                 | User menu > Settings            |
| 64                     | BillingPage                | `/billing`                  | Sidebar: Billing                |
| 65                     | ExportDataPage             | `/settings/export`          | Settings page                   |
| 66                     | IntegrationsSettingsPage   | `/settings/integrations`    | Settings page                   |
| **AI & Insights**      |                            |                             |                                 |
| 67                     | AIInsightsPage             | `/ai-insights`              | Sidebar: AI Insights            |
| 68                     | DiscussionsPage            | `/discussions`              | Paper details page              |
| **Admin Only**         |                            |                             |                                 |
| 69                     | AdminOverviewPage          | `/admin-overview`           | Sidebar: Admin                  |
| 70                     | UserManagementPage         | `/admin/users`              | Sidebar: Admin > Users          |
| 71                     | SubscriptionsPage          | `/admin/subscriptions`      | Sidebar: Admin > Subs           |
| 72                     | SystemSettingsPage         | `/admin/settings`           | Sidebar: Admin > Settings       |
| 73                     | AdminReportsPage           | `/admin/reports`            | Sidebar: Admin > Reports        |
| 74                     | AdminAuditLogPage          | `/admin/audit`              | Sidebar: Admin > Audit          |
| 75                     | AdminPlansPage             | `/admin/plans`              | Sidebar: Admin > Plans          |
| 76                     | AdminPaymentsPage          | `/admin/payments`           | Sidebar: Admin > Payments       |
| 77                     | AdminWebhooksPage          | `/admin/webhooks`           | Sidebar: Admin > Webhooks       |
| 78                     | AdminAPIKeysPage           | `/admin/api-keys`           | Sidebar: Admin > API Keys       |
| 79                     | AdminContentModerationPage | `/admin/moderation`         | Sidebar: Admin > Moderation     |
| **Marketing/Public**   |                            |                             |                                 |
| 80                     | FeaturesPage               | `/features`                 | Public navbar                   |
| 81                     | HowItWorksPage             | `/how-it-works`             | Public navbar                   |
| 82                     | PricingPage                | `/pricing`                  | Public navbar                   |
| 83                     | FAQPage                    | `/faq`                      | Public navbar                   |
| **Products**           |                            |                             |                                 |
| 84                     | PapersProductPage          | `/products/papers`          | Footer / Marketing              |
| 85                     | CollectionsProductPage     | `/products/collections`     | Footer / Marketing              |
| 86                     | CollaborateProductPage     | `/products/collaborate`     | Footer / Marketing              |
| 87                     | AIInsightsProductPage      | `/products/ai-insights`     | Footer / Marketing              |
| **Resources**          |                            |                             |                                 |
| 88                     | DocsPage                   | `/resources/docs`           | Footer / Marketing              |
| 89                     | TutorialsPage              | `/resources/tutorials`      | Footer / Marketing              |
| 90                     | APIPage                    | `/resources/api`            | Footer / Marketing              |
| 91                     | CommunityPage              | `/resources/community`      | Footer / Marketing              |
| **Company**            |                            |                             |                                 |
| 92                     | AboutPage                  | `/company/about`            | Footer / Marketing              |
| 93                     | CareersPage                | `/company/careers`          | Footer / Marketing              |
| 94                     | ContactPage                | `/company/contact`          | Footer / Marketing              |
| 95                     | PressPage                  | `/company/press`            | Footer / Marketing              |
| **Enterprise**         |                            |                             |                                 |
| 96                     | EnterprisePage             | `/enterprise`               | Public navbar                   |
| 97                     | TeamsPage                  | `/enterprise/teams`         | Enterprise submenu              |
| 98                     | IntegrationsPage           | `/enterprise/integrations`  | Enterprise submenu              |
| 99                     | SupportPage                | `/enterprise/support`       | Enterprise submenu              |
| **Utility**            |                            |                             |                                 |
| 100                    | NotFoundPage               | `/not-found`                | 404 redirect                    |
| 101                    | ErrorPage                  | `/error`                    | Error boundary                  |
| 102                    | LoadingPage                | `/loading`                  | Loading state                   |

---

## Role-Based Access Summary

### Researcher

- Dashboard, Papers, Collections, Workspaces
- Research (PDF, Editor, Citations, Annotations)
- Notifications, Security, Help, Billing
- Basic Analytics, Discover (Explore, Trending, Recommendations)
- NO: Citation Graph, Research Map, Team, Admin

### Pro Researcher

- All Researcher features +
- Citation Graph, Research Map
- Usage Reports, Export Analytics
- NO: Team Management, Admin

### Team Lead

- All Pro Researcher features +
- Team (Members, Invitations, Activity, Settings)
- Workspace Analytics
- NO: Admin

### Admin

- All features +
- Admin Overview, User Management
- Reports, Audit Log, Plans, Payments
- Webhooks, API Keys, Content Moderation

---

## Sidebar Navigation Structure

- Dashboard
- Papers (All Papers, Upload, Search, Import)
- Collections
- Workspaces
- Research (PDF Extraction, Text Editor, Citations, Annotations, Citation Graph Pro+, Research Map Pro+)
- Discover (Explore, Trending, Recommendations)
- Notifications (Center, History, Settings)
- Team - Team Lead+ (Members, Invitations, Activity, Settings)
- Security (Dashboard, 2FA, Sessions, Privacy)
- Analytics (Personal, Workspace Team Lead+, Usage Pro+, Export Pro+)
- Help (Center, Shortcuts)
- Billing
- Admin - Admin only (Overview, Users, Subscriptions, Settings, Reports, Audit Log, Plans, Payments, Webhooks, API Keys, Moderation)

---

## All 101 Pages Complete & Navigable

Last Updated: November 30, 2025
