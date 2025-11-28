// Core pages
export { DashboardPage } from "./DashboardPage";
export { LoginPage } from "./LoginPage";
export { PaperDetailPage } from "./PaperDetailPage";
export { ProfilePage } from "./ProfilePage";
export { RegisterPage } from "./RegisterPage";
export { SettingsPage } from "./SettingsPage";

// Auth pages
export { ForgotPasswordPage } from "./ForgotPasswordPage";
export { ResetPasswordPage } from "./ResetPasswordPage";
export { VerifyEmailPage } from "./VerifyEmailPage";

// Utility pages
export { ErrorPage } from "./ErrorPage";
export { LoadingPage } from "./LoadingPage";
export { NotFoundPage } from "./NotFoundPage";

// Marketing pages
export { FeaturesPage } from "./FeaturesPage";
export { HowItWorksPage } from "./HowItWorksPage";

// Main pages
export { FAQPage } from "./FAQPage";
export { PricingPage } from "./PricingPage";

// Product pages
export {
  AIInsightsPage,
  CollaboratePage,
  CollectionsPage,
  PapersPage,
} from "./products";

// Resource pages
export { APIPage, CommunityPage, DocsPage, TutorialsPage } from "./resources";

// Company pages
export { AboutPage, CareersPage, ContactPage, PressPage } from "./company";

// Enterprise pages
export {
  EnterprisePage,
  IntegrationsPage,
  SupportPage,
  TeamsPage,
} from "./enterprise";

// Dashboard module pages (with role-based views)
export {
  AnnotationsPage,
  CitationsPage,
  // Collections subpages
  CreateCollectionPage,
  // Workspaces subpages
  CreateWorkspacePage,
  CollectionsPage as DashboardCollectionsPage,
  // Main pages
  PapersPage as DashboardPapersPage,
  ResearchPage as DashboardResearchPage,
  WorkspacesPage as DashboardWorkspacesPage,
  // Research subpages
  PdfExtractionPage,
  SearchPapersPage,
  SharedCollectionsPage,
  SharedWorkspacesPage,
  TextEditorPage,
  // Papers subpages
  UploadPaperPage,
} from "./dashboard";

// Dashboard Router (for navigation demo)
export { DashboardRouter } from "../DashboardRouter";
