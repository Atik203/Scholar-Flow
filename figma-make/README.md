# ScholarFlow - Figma Make UI Components

A complete standalone React UI component library for ScholarFlow, built for Figma Make AI.

## Page Name List

### Auth Pages (1-5)

| #   | Page               | Path               | Description                  |
| --- | ------------------ | ------------------ | ---------------------------- |
| 1   | LoginPage          | `/login`           | User login form              |
| 2   | RegisterPage       | `/register`        | User registration form       |
| 3   | ForgotPasswordPage | `/forgot-password` | Password recovery email form |
| 4   | ResetPasswordPage  | `/reset-password`  | New password creation form   |
| 5   | VerifyEmailPage    | `/verify-email`    | Email verification page      |

### Dashboard Pages (6-10)

| #   | Page          | Path                        | Description                 |
| --- | ------------- | --------------------------- | --------------------------- |
| 6   | DashboardPage | `/dashboard`                | Main dashboard (role-based) |
| 7   | DashboardPage | `/dashboard/researcher`     | Researcher dashboard        |
| 8   | DashboardPage | `/dashboard/pro-researcher` | Pro Researcher dashboard    |
| 9   | DashboardPage | `/dashboard/team-lead`      | Team Lead dashboard         |
| 10  | DashboardPage | `/dashboard/admin`          | Admin dashboard             |

### Dashboard Module - Papers (11-15)

| #   | Page                | Path             | Description       |
| --- | ------------------- | ---------------- | ----------------- |
| 11  | DashboardPapersPage | `/papers`        | All papers list   |
| 12  | UploadPaperPage     | `/papers/upload` | Upload new paper  |
| 13  | SearchPapersPage    | `/papers/search` | Search papers     |
| 14  | PaperDetailsPage    | `/papers/:id`    | Paper details     |
| 15  | PaperDetailPage     | `/paper`         | Paper detail view |

### Dashboard Module - Collections (16-19)

| #   | Page                     | Path                  | Description           |
| --- | ------------------------ | --------------------- | --------------------- |
| 16  | DashboardCollectionsPage | `/collections`        | My collections        |
| 17  | CreateCollectionPage     | `/collections/create` | Create new collection |
| 18  | SharedCollectionsPage    | `/collections/shared` | Shared collections    |
| 19  | CollectionDetailsPage    | `/collections/:id`    | Collection details    |

### Dashboard Module - Workspaces (20-23)

| #   | Page                    | Path                 | Description          |
| --- | ----------------------- | -------------------- | -------------------- |
| 20  | DashboardWorkspacesPage | `/workspaces`        | My workspaces        |
| 21  | CreateWorkspacePage     | `/workspaces/create` | Create new workspace |
| 22  | SharedWorkspacesPage    | `/workspaces/shared` | Shared workspaces    |
| 23  | WorkspaceDetailsPage    | `/workspaces/:id`    | Workspace details    |

### Dashboard Module - Research (24-28)

| #   | Page                  | Path                       | Description       |
| --- | --------------------- | -------------------------- | ----------------- |
| 24  | DashboardResearchPage | `/research`                | Research tools    |
| 25  | PdfExtractionPage     | `/research/pdf-extraction` | PDF extraction    |
| 26  | TextEditorPage        | `/research/editor`         | Text editor       |
| 27  | CitationsPage         | `/research/citations`      | Citations manager |
| 28  | AnnotationsPage       | `/research/annotations`    | Annotations       |

### Dashboard Additional Pages (29-36)

| #   | Page                    | Path            | Description                                        |
| --- | ----------------------- | --------------- | -------------------------------------------------- |
| 29  | DashboardAIInsightsPage | `/ai-insights`  | AI insights                                        |
| 30  | AnalyticsPage           | `/analytics`    | Analytics dashboard                                |
| 31  | BillingPage             | `/billing`      | Billing & subscription                             |
| 32  | ProfilePage             | `/profile`      | User profile                                       |
| 33  | SettingsPage            | `/settings`     | User settings                                      |
| 34  | ActivityLogPage         | `/activity-log` | System activity tracking with filters & pagination |
| 35  | DiscussionsPage         | `/discussions`  | Research discussions and collaboration threads     |
| 36  | KnowledgePagesPage      | `/pages`        | Researcher curated knowledge pages and tools       |

### Admin Pages (37-40)

| #   | Page               | Path                   | Description             |
| --- | ------------------ | ---------------------- | ----------------------- |
| 37  | AdminOverviewPage  | `/admin-overview`      | Admin overview          |
| 38  | UserManagementPage | `/admin/users`         | User management         |
| 39  | SubscriptionsPage  | `/admin/subscriptions` | Subscription management |
| 40  | SystemSettingsPage | `/admin/settings`      | System settings         |

### Products Pages (41-44)

| #   | Page            | Path                    | Description              |
| --- | --------------- | ----------------------- | ------------------------ |
| 41  | PapersPage      | `/products/papers`      | Papers product page      |
| 42  | CollectionsPage | `/products/collections` | Collections product page |
| 43  | CollaboratePage | `/products/collaborate` | Collaborate product page |
| 44  | AIInsightsPage  | `/products/ai-insights` | AI Insights product page |

### Resources Pages (45-48)

| #   | Page          | Path                   | Description   |
| --- | ------------- | ---------------------- | ------------- |
| 45  | DocsPage      | `/resources/docs`      | Documentation |
| 46  | TutorialsPage | `/resources/tutorials` | Tutorials     |
| 47  | APIPage       | `/resources/api`       | API reference |
| 48  | CommunityPage | `/resources/community` | Community     |

### Company Pages (49-52)

| #   | Page        | Path               | Description |
| --- | ----------- | ------------------ | ----------- |
| 49  | AboutPage   | `/company/about`   | About us    |
| 50  | CareersPage | `/company/careers` | Careers     |
| 51  | ContactPage | `/company/contact` | Contact us  |
| 52  | PressPage   | `/company/press`   | Press       |

### Enterprise Pages (53-56)

| #   | Page             | Path                       | Description        |
| --- | ---------------- | -------------------------- | ------------------ |
| 53  | EnterprisePage   | `/enterprise`              | Enterprise landing |
| 54  | TeamsPage        | `/enterprise/teams`        | Teams              |
| 55  | IntegrationsPage | `/enterprise/integrations` | Integrations       |
| 56  | SupportPage      | `/enterprise/support`      | Support            |

### Marketing Pages (57-58)

| #   | Page           | Path            | Description       |
| --- | -------------- | --------------- | ----------------- |
| 57  | FeaturesPage   | `/features`     | Features showcase |
| 58  | HowItWorksPage | `/how-it-works` | How it works      |

### Main Pages (59-61)

| #   | Page         | Path       | Description                                      |
| --- | ------------ | ---------- | ------------------------------------------------ |
| 59  | PricingPage  | `/pricing` | Pricing plans                                    |
| 60  | FAQPage      | `/faq`     | FAQ                                              |
| 61  | Landing Page | `/`        | Home page with Hero, Features, Testimonials, CTA |

### Utility Pages (62-64)

| #   | Page         | Path         | Description   |
| --- | ------------ | ------------ | ------------- |
| 62  | NotFoundPage | `/not-found` | 404 page      |
| 63  | ErrorPage    | `/error`     | Error page    |
| 64  | LoadingPage  | `/loading`   | Loading state |

---

**Total: 64 pages/routes** across auth, dashboard, admin, products, resources, company, enterprise, marketing, and utility categories.
