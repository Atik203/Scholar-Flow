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

### Dashboard Additional Pages (29-33)

| #   | Page                    | Path           | Description            |
| --- | ----------------------- | -------------- | ---------------------- |
| 29  | DashboardAIInsightsPage | `/ai-insights` | AI insights            |
| 30  | AnalyticsPage           | `/analytics`   | Analytics dashboard    |
| 31  | BillingPage             | `/billing`     | Billing & subscription |
| 32  | ProfilePage             | `/profile`     | User profile           |
| 33  | SettingsPage            | `/settings`    | User settings          |

### Admin Pages (34-37)

| #   | Page               | Path                   | Description             |
| --- | ------------------ | ---------------------- | ----------------------- |
| 34  | AdminOverviewPage  | `/admin-overview`      | Admin overview          |
| 35  | UserManagementPage | `/admin/users`         | User management         |
| 36  | SubscriptionsPage  | `/admin/subscriptions` | Subscription management |
| 37  | SystemSettingsPage | `/admin/settings`      | System settings         |

### Products Pages (38-41)

| #   | Page            | Path                    | Description              |
| --- | --------------- | ----------------------- | ------------------------ |
| 38  | PapersPage      | `/products/papers`      | Papers product page      |
| 39  | CollectionsPage | `/products/collections` | Collections product page |
| 40  | CollaboratePage | `/products/collaborate` | Collaborate product page |
| 41  | AIInsightsPage  | `/products/ai-insights` | AI Insights product page |

### Resources Pages (42-45)

| #   | Page          | Path                   | Description   |
| --- | ------------- | ---------------------- | ------------- |
| 42  | DocsPage      | `/resources/docs`      | Documentation |
| 43  | TutorialsPage | `/resources/tutorials` | Tutorials     |
| 44  | APIPage       | `/resources/api`       | API reference |
| 45  | CommunityPage | `/resources/community` | Community     |

### Company Pages (46-49)

| #   | Page        | Path               | Description |
| --- | ----------- | ------------------ | ----------- |
| 46  | AboutPage   | `/company/about`   | About us    |
| 47  | CareersPage | `/company/careers` | Careers     |
| 48  | ContactPage | `/company/contact` | Contact us  |
| 49  | PressPage   | `/company/press`   | Press       |

### Enterprise Pages (50-53)

| #   | Page             | Path                       | Description        |
| --- | ---------------- | -------------------------- | ------------------ |
| 50  | EnterprisePage   | `/enterprise`              | Enterprise landing |
| 51  | TeamsPage        | `/enterprise/teams`        | Teams              |
| 52  | IntegrationsPage | `/enterprise/integrations` | Integrations       |
| 53  | SupportPage      | `/enterprise/support`      | Support            |

### Marketing Pages (54-55)

| #   | Page           | Path            | Description       |
| --- | -------------- | --------------- | ----------------- |
| 54  | FeaturesPage   | `/features`     | Features showcase |
| 55  | HowItWorksPage | `/how-it-works` | How it works      |

### Main Pages (56-58)

| #   | Page         | Path       | Description                                      |
| --- | ------------ | ---------- | ------------------------------------------------ |
| 56  | PricingPage  | `/pricing` | Pricing plans                                    |
| 57  | FAQPage      | `/faq`     | FAQ                                              |
| 58  | Landing Page | `/`        | Home page with Hero, Features, Testimonials, CTA |

### Utility Pages (59-61)

| #   | Page         | Path         | Description   |
| --- | ------------ | ------------ | ------------- |
| 59  | NotFoundPage | `/not-found` | 404 page      |
| 60  | ErrorPage    | `/error`     | Error page    |
| 61  | LoadingPage  | `/loading`   | Loading state |

---

**Total: 61 pages/routes** across auth, dashboard, admin, products, resources, company, enterprise, marketing, and utility categories.
