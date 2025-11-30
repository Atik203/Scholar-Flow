"use client";

/**
 * ScholarFlow - Global Routes Configuration
 *
 * This file contains all route definitions and page component mappings.
 * Centralized routing makes it easier to manage navigation across the app.
 *
 * Route Categories:
 * - Auth Routes: /login, /register
 * - Dashboard Routes: /dashboard/*
 * - Papers Routes: /papers/*
 * - Collections Routes: /collections/*
 * - Workspaces Routes: /workspaces/*
 * - Research Routes: /research/*
 * - Products Routes: /products/*
 * - Resources Routes: /resources/*
 * - Company Routes: /company/*
 * - Enterprise Routes: /enterprise/*
 * - Main Routes: /pricing, /faq
 */

import type { ComponentType } from "react";

// Auth Pages
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

// Utility Pages
import { ErrorPage } from "./pages/ErrorPage";
import { LoadingPage } from "./pages/LoadingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Marketing Pages
import { FeaturesPage } from "./pages/FeaturesPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";

// Dashboard Pages
import { DashboardPage } from "./pages/DashboardPage";
import { PaperDetailPage } from "./pages/PaperDetailPage";

// User Pages
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

// Dashboard Module Pages - Papers
import {
  PapersPage as DashboardPapersPage,
  PaperDetailsPage,
  SearchPapersPage,
  UploadPaperPage,
} from "./pages/dashboard/papers";

// Dashboard Module Pages - Collections
import {
  CollectionDetailsPage,
  CreateCollectionPage,
  CollectionsPage as DashboardCollectionsPage,
  SharedCollectionsPage,
} from "./pages/dashboard/collections";

// Dashboard Module Pages - Workspaces
import {
  CreateWorkspacePage,
  WorkspacesPage as DashboardWorkspacesPage,
  SharedWorkspacesPage,
  WorkspaceDetailsPage,
} from "./pages/dashboard/workspaces";

// Dashboard Module Pages - Research
import {
  AnnotationsPage,
  CitationsPage,
  ResearchPage as DashboardResearchPage,
  PdfExtractionPage,
  TextEditorPage,
} from "./pages/dashboard/research";

// Dashboard Additional Pages
import { ActivityLogPage } from "./pages/dashboard/ActivityLogPage";
import { AIInsightsPage as DashboardAIInsightsPage } from "./pages/dashboard/AIInsightsPage";
import { AnalyticsPage } from "./pages/dashboard/AnalyticsPage";
import { BillingPage } from "./pages/dashboard/BillingPage";
import { DiscussionsPage } from "./pages/dashboard/DiscussionsPage";
import { EnhancedDashboardPage } from "./pages/dashboard/EnhancedDashboardPage";
import { GlobalSearchPage } from "./pages/dashboard/GlobalSearchPage";
import { HelpCenterPage } from "./pages/dashboard/HelpCenterPage";
import { KeyboardShortcutsPage } from "./pages/dashboard/KeyboardShortcutsPage";
import { NotificationsPage } from "./pages/dashboard/NotificationsPage";
import { RecentActivityPage } from "./pages/dashboard/RecentActivityPage";
import { ResearchNotesPage } from "./pages/dashboard/ResearchNotesPage";
import { TeamMembersPage } from "./pages/dashboard/TeamMembersPage";

// Onboarding
import { OnboardingPage } from "./pages/OnboardingPage";

// Dashboard Admin Pages
import {
  AdminOverviewPage,
  SubscriptionsPage,
  SystemSettingsPage,
  UserManagementPage,
} from "./pages/dashboard/admin";

// Admin Enhanced Pages
import { AdminAuditLogPage } from "./pages/admin/AdminAuditLogPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";

// Analytics Pages
import { ExportAnalyticsPage } from "./pages/analytics/ExportAnalyticsPage";
import { PersonalAnalyticsPage } from "./pages/analytics/PersonalAnalyticsPage";
import { UsageReportsPage } from "./pages/analytics/UsageReportsPage";
import { WorkspaceAnalyticsPage } from "./pages/analytics/WorkspaceAnalyticsPage";

// Import/Export Pages
import { ImportPapersPage } from "./pages/papers/ImportPapersPage";
import { PaperRelationsPage } from "./pages/papers/PaperRelationsPage";
import { ExportDataPage } from "./pages/settings/ExportDataPage";
import { IntegrationsSettingsPage } from "./pages/settings/IntegrationsSettingsPage";

// Security Pages
import { ActiveSessionsPage } from "./pages/security/ActiveSessionsPage";
import { SecurityDashboardPage } from "./pages/security/SecurityDashboardPage";
import { TwoFactorSetupPage } from "./pages/security/TwoFactorSetupPage";

// Research Enhanced Pages
import { CitationGraphPage } from "./pages/research/CitationGraphPage";
import { ResearchMapPage } from "./pages/research/ResearchMapPage";

// Phase 4 - Notifications Pages
import { NotificationSettingsPage } from "./pages/notifications/NotificationSettingsPage";

// Phase 4 - Team Pages
import { TeamInvitationsPage } from "./pages/team/TeamInvitationsPage";

// Phase 4 - Admin Pages
import { AdminPlansPage } from "./pages/admin/AdminPlansPage";

// Phase 5 - Admin Payments
import { AdminPaymentsPage } from "./pages/admin/AdminPaymentsPage";

// Phase 4 - Discovery Pages
import { DiscoverPage } from "./pages/discover/DiscoverPage";
import { RecommendationsPage } from "./pages/discover/RecommendationsPage";
import { TrendingPage } from "./pages/discover/TrendingPage";

// Phase 5 - Onboarding Extended
import { OnboardingRolePage } from "./pages/onboarding/OnboardingRolePage";
import { OnboardingWorkspacePage } from "./pages/onboarding/OnboardingWorkspacePage";

// Phase 5 - Notification Center
import { NotificationCenterPage } from "./pages/notifications/NotificationCenterPage";

// Phase 8 - Notification History
import { NotificationHistoryPage } from "./pages/notifications/NotificationHistoryPage";

// Phase 6 - Invitation Response
import { InvitationResponsePage } from "./pages/invitations/InvitationResponsePage";

// Phase 6 - Team Extended
import { TeamActivityPage } from "./pages/team/TeamActivityPage";
import { TeamSettingsPage } from "./pages/team/TeamSettingsPage";

// Phase 8 - Collaborator Profile
import { CollaboratorProfilePage } from "./pages/team/CollaboratorProfilePage";

// Phase 6 - Search History
import { SearchHistoryPage } from "./pages/search/SearchHistoryPage";

// Phase 7 - Admin Enhanced Pages
import { AdminAPIKeysPage } from "./pages/admin/AdminAPIKeysPage";
import { AdminContentModerationPage } from "./pages/admin/AdminContentModerationPage";
import { AdminWebhooksPage } from "./pages/admin/AdminWebhooksPage";

// Phase 7 - Privacy Settings
import { PrivacySettingsPage } from "./pages/security/PrivacySettingsPage";

// Products Pages
import {
  AIInsightsPage,
  CollaboratePage,
  CollectionsPage,
  PapersPage,
} from "./pages/products";

// Resources Pages
import {
  APIPage,
  CommunityPage,
  DocsPage,
  TutorialsPage,
} from "./pages/resources";

// Company Pages
import {
  AboutPage,
  CareersPage,
  ContactPage,
  PressPage,
} from "./pages/company";

// Enterprise Pages
import {
  EnterprisePage,
  IntegrationsPage,
  SupportPage,
  TeamsPage,
} from "./pages/enterprise";

// Main Pages
import { FAQPage } from "./pages/FAQPage";
import { PricingPage } from "./pages/PricingPage";

// Types
export type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

export interface PageProps {
  onNavigate: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
  isAuthenticated?: boolean;
}

export interface DashboardPageProps extends PageProps {
  role: UserRole;
}

export interface RouteConfig {
  path: string;
  component: ComponentType<PageProps | DashboardPageProps>;
  exact?: boolean;
  auth?: boolean;
  title?: string;
}

// Route Definitions
export const routes: Record<string, RouteConfig[]> = {
  // Authentication Routes
  auth: [
    {
      path: "/login",
      component: LoginPage as ComponentType<PageProps>,
      title: "Login",
    },
    {
      path: "/register",
      component: RegisterPage as ComponentType<PageProps>,
      title: "Register",
    },
    {
      path: "/forgot-password",
      component: ForgotPasswordPage as ComponentType<PageProps>,
      title: "Forgot Password",
    },
    {
      path: "/reset-password",
      component: ResetPasswordPage as ComponentType<PageProps>,
      title: "Reset Password",
    },
    {
      path: "/verify-email",
      component: VerifyEmailPage as ComponentType<PageProps>,
      title: "Verify Email",
    },
  ],

  // Utility Routes
  utility: [
    {
      path: "/not-found",
      component: NotFoundPage as ComponentType<PageProps>,
      title: "Page Not Found",
    },
    {
      path: "/error",
      component: ErrorPage as ComponentType<PageProps>,
      title: "Error",
    },
    {
      path: "/loading",
      component: LoadingPage as ComponentType<PageProps>,
      title: "Loading",
    },
  ],

  // Marketing Routes
  marketing: [
    {
      path: "/features",
      component: FeaturesPage as ComponentType<PageProps>,
      title: "Features",
    },
    {
      path: "/how-it-works",
      component: HowItWorksPage as ComponentType<PageProps>,
      title: "How It Works",
    },
  ],

  // Dashboard Routes
  dashboard: [
    {
      path: "/dashboard",
      component: EnhancedDashboardPage as ComponentType<PageProps>,
      auth: true,
      exact: true,
      title: "Dashboard",
    },
    {
      path: "/dashboard/researcher",
      component: EnhancedDashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Researcher Dashboard",
    },
    {
      path: "/dashboard/pro-researcher",
      component: EnhancedDashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Pro Researcher Dashboard",
    },
    {
      path: "/dashboard/team-lead",
      component: EnhancedDashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Team Lead Dashboard",
    },
    {
      path: "/dashboard/admin",
      component: EnhancedDashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Admin Dashboard",
    },
    {
      path: "/paper",
      component: PaperDetailPage as ComponentType<PageProps>,
      auth: true,
      title: "Paper Details",
    },
  ],

  // Papers Routes (Dashboard Module)
  papers: [
    {
      path: "/papers",
      component: DashboardPapersPage as ComponentType<PageProps>,
      auth: true,
      exact: true,
      title: "All Papers",
    },
    {
      path: "/papers/upload",
      component: UploadPaperPage as ComponentType<PageProps>,
      auth: true,
      title: "Upload Paper",
    },
    {
      path: "/papers/search",
      component: SearchPapersPage as ComponentType<PageProps>,
      auth: true,
      title: "Search Papers",
    },
    {
      path: "/papers/:id",
      component: PaperDetailsPage as ComponentType<PageProps>,
      auth: true,
      title: "Paper Details",
    },
    {
      path: "/papers/:id/relations",
      component: PaperRelationsPage as ComponentType<PageProps>,
      auth: true,
      title: "Paper Relations",
    },
  ],

  // Collections Routes (Dashboard Module)
  collections: [
    {
      path: "/collections",
      component: DashboardCollectionsPage as ComponentType<PageProps>,
      auth: true,
      exact: true,
      title: "My Collections",
    },
    {
      path: "/collections/create",
      component: CreateCollectionPage as ComponentType<PageProps>,
      auth: true,
      title: "Create Collection",
    },
    {
      path: "/collections/shared",
      component: SharedCollectionsPage as ComponentType<PageProps>,
      auth: true,
      title: "Shared Collections",
    },
    {
      path: "/collections/:id",
      component: CollectionDetailsPage as ComponentType<PageProps>,
      auth: true,
      title: "Collection Details",
    },
  ],

  // Workspaces Routes (Dashboard Module)
  workspaces: [
    {
      path: "/workspaces",
      component: DashboardWorkspacesPage as ComponentType<PageProps>,
      auth: true,
      exact: true,
      title: "My Workspaces",
    },
    {
      path: "/workspaces/create",
      component: CreateWorkspacePage as ComponentType<PageProps>,
      auth: true,
      title: "Create Workspace",
    },
    {
      path: "/workspaces/shared",
      component: SharedWorkspacesPage as ComponentType<PageProps>,
      auth: true,
      title: "Shared Workspaces",
    },
    {
      path: "/workspaces/:id",
      component: WorkspaceDetailsPage as ComponentType<PageProps>,
      auth: true,
      title: "Workspace Details",
    },
  ],

  // Research Routes (Dashboard Module)
  research: [
    {
      path: "/research",
      component: DashboardResearchPage as ComponentType<PageProps>,
      auth: true,
      exact: true,
      title: "Research Tools",
    },
    {
      path: "/research/pdf-extraction",
      component: PdfExtractionPage as ComponentType<PageProps>,
      auth: true,
      title: "PDF Text Extraction",
    },
    {
      path: "/research/editor",
      component: TextEditorPage as ComponentType<PageProps>,
      auth: true,
      title: "Text Editor",
    },
    {
      path: "/research/citations",
      component: CitationsPage as ComponentType<PageProps>,
      auth: true,
      title: "Citations",
    },
    {
      path: "/research/annotations",
      component: AnnotationsPage as ComponentType<PageProps>,
      auth: true,
      title: "Annotations",
    },
    {
      path: "/research/citation-graph",
      component: CitationGraphPage as ComponentType<PageProps>,
      auth: true,
      title: "Citation Graph",
    },
    {
      path: "/research/map",
      component: ResearchMapPage as ComponentType<PageProps>,
      auth: true,
      title: "Research Map",
    },
  ],

  // Dashboard Additional Routes
  dashboardPages: [
    {
      path: "/ai-insights",
      component: DashboardAIInsightsPage as ComponentType<PageProps>,
      auth: true,
      title: "AI Insights",
    },
    {
      path: "/analytics",
      component: AnalyticsPage as ComponentType<PageProps>,
      auth: true,
      title: "Analytics",
    },
    {
      path: "/billing",
      component: BillingPage as ComponentType<PageProps>,
      auth: true,
      title: "Billing",
    },
    {
      path: "/activity-log",
      component: ActivityLogPage as ComponentType<PageProps>,
      auth: true,
      title: "Activity Log",
    },
    {
      path: "/discussions",
      component: DiscussionsPage as ComponentType<PageProps>,
      auth: true,
      title: "Discussions",
    },
    {
      path: "/notifications",
      component: NotificationsPage as ComponentType<PageProps>,
      auth: true,
      title: "Notifications",
    },
    {
      path: "/team",
      component: TeamMembersPage as ComponentType<PageProps>,
      auth: true,
      title: "Team Members",
    },
    {
      path: "/research-notes",
      component: ResearchNotesPage as ComponentType<PageProps>,
      auth: true,
      title: "Research Notes",
    },
    {
      path: "/search",
      component: GlobalSearchPage as ComponentType<PageProps>,
      auth: true,
      title: "Global Search",
    },
    {
      path: "/help/shortcuts",
      component: KeyboardShortcutsPage as ComponentType<PageProps>,
      auth: true,
      title: "Keyboard Shortcuts",
    },
    {
      path: "/help",
      component: HelpCenterPage as ComponentType<PageProps>,
      auth: true,
      title: "Help Center",
    },
    {
      path: "/recent-activity",
      component: RecentActivityPage as ComponentType<PageProps>,
      auth: true,
      title: "Recent Activity",
    },
  ],

  // Analytics Routes
  analytics: [
    {
      path: "/analytics/personal",
      component: PersonalAnalyticsPage as ComponentType<PageProps>,
      auth: true,
      title: "Personal Analytics",
    },
    {
      path: "/analytics/workspace",
      component: WorkspaceAnalyticsPage as ComponentType<PageProps>,
      auth: true,
      title: "Workspace Analytics",
    },
    {
      path: "/analytics/usage",
      component: UsageReportsPage as ComponentType<PageProps>,
      auth: true,
      title: "Usage Reports",
    },
    {
      path: "/analytics/export",
      component: ExportAnalyticsPage as ComponentType<PageProps>,
      auth: true,
      title: "Export Analytics",
    },
  ],

  // Security Routes
  security: [
    {
      path: "/security",
      component: SecurityDashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Security Dashboard",
    },
    {
      path: "/security/2fa",
      component: TwoFactorSetupPage as ComponentType<PageProps>,
      auth: true,
      title: "Two-Factor Authentication Setup",
    },
    {
      path: "/security/sessions",
      component: ActiveSessionsPage as ComponentType<PageProps>,
      auth: true,
      title: "Active Sessions",
    },
    {
      path: "/privacy",
      component: PrivacySettingsPage as ComponentType<PageProps>,
      auth: true,
      title: "Privacy Settings",
    },
  ],

  // Import Routes
  import: [
    {
      path: "/papers/import",
      component: ImportPapersPage as ComponentType<PageProps>,
      auth: true,
      title: "Import Papers",
    },
  ],

  // Export Routes
  export: [
    {
      path: "/settings/export",
      component: ExportDataPage as ComponentType<PageProps>,
      auth: true,
      title: "Export Data",
    },
  ],

  // Settings Integrations Route
  settingsIntegrations: [
    {
      path: "/settings/integrations",
      component: IntegrationsSettingsPage as ComponentType<PageProps>,
      auth: true,
      title: "Integrations",
    },
  ],

  // Notifications Routes
  notifications: [
    {
      path: "/notifications/settings",
      component: NotificationSettingsPage as ComponentType<PageProps>,
      auth: true,
      title: "Notification Settings",
    },
    {
      path: "/notifications/center",
      component: NotificationCenterPage as ComponentType<PageProps>,
      auth: true,
      title: "Notification Center",
    },
    {
      path: "/notifications/history",
      component: NotificationHistoryPage as ComponentType<PageProps>,
      auth: true,
      title: "Notification History",
    },
  ],

  // Team Routes
  team: [
    {
      path: "/team/invitations",
      component: TeamInvitationsPage as ComponentType<PageProps>,
      auth: true,
      title: "Team Invitations",
    },
    {
      path: "/team/activity",
      component: TeamActivityPage as ComponentType<PageProps>,
      auth: true,
      title: "Team Activity",
    },
    {
      path: "/team/settings",
      component: TeamSettingsPage as ComponentType<PageProps>,
      auth: true,
      title: "Team Settings",
    },
    {
      path: "/collaborator/:id",
      component: CollaboratorProfilePage as ComponentType<PageProps>,
      auth: true,
      title: "Collaborator Profile",
    },
  ],

  // Invitation Routes
  invitation: [
    {
      path: "/invitation/:token",
      component: InvitationResponsePage as ComponentType<PageProps>,
      title: "Invitation",
    },
  ],

  // Search Routes
  search: [
    {
      path: "/search/history",
      component: SearchHistoryPage as ComponentType<PageProps>,
      auth: true,
      title: "Search History",
    },
  ],

  // Discover Routes
  discover: [
    {
      path: "/discover",
      component: DiscoverPage as ComponentType<PageProps>,
      auth: true,
      title: "Discover",
    },
    {
      path: "/discover/trending",
      component: TrendingPage as ComponentType<PageProps>,
      auth: true,
      title: "Trending Research",
    },
    {
      path: "/discover/recommendations",
      component: RecommendationsPage as ComponentType<PageProps>,
      auth: true,
      title: "AI Recommendations",
    },
  ],

  // Onboarding Routes
  onboarding: [
    {
      path: "/onboarding",
      component: OnboardingPage as ComponentType<PageProps>,
      title: "Welcome to ScholarFlow",
    },
    {
      path: "/onboarding/role",
      component: OnboardingRolePage as ComponentType<PageProps>,
      title: "Choose Your Role",
    },
    {
      path: "/onboarding/workspace",
      component: OnboardingWorkspacePage as ComponentType<PageProps>,
      title: "Create Workspace",
    },
  ],

  // Admin Routes
  admin: [
    {
      path: "/admin-overview",
      component: AdminOverviewPage as ComponentType<PageProps>,
      auth: true,
      title: "Admin Overview",
    },
    {
      path: "/admin/users",
      component: UserManagementPage as ComponentType<PageProps>,
      auth: true,
      title: "User Management",
    },
    {
      path: "/admin/subscriptions",
      component: SubscriptionsPage as ComponentType<PageProps>,
      auth: true,
      title: "Subscriptions",
    },
    {
      path: "/admin/settings",
      component: SystemSettingsPage as ComponentType<PageProps>,
      auth: true,
      title: "System Settings",
    },
    {
      path: "/admin/reports",
      component: AdminReportsPage as ComponentType<PageProps>,
      auth: true,
      title: "Admin Reports",
    },
    {
      path: "/admin/audit",
      component: AdminAuditLogPage as ComponentType<PageProps>,
      auth: true,
      title: "Audit Log",
    },
    {
      path: "/admin/plans",
      component: AdminPlansPage as ComponentType<PageProps>,
      auth: true,
      title: "Admin Plans",
    },
    {
      path: "/admin/payments",
      component: AdminPaymentsPage as ComponentType<PageProps>,
      auth: true,
      title: "Payments",
    },
    {
      path: "/admin/webhooks",
      component: AdminWebhooksPage as ComponentType<PageProps>,
      auth: true,
      title: "Webhooks",
    },
    {
      path: "/admin/api-keys",
      component: AdminAPIKeysPage as ComponentType<PageProps>,
      auth: true,
      title: "API Keys",
    },
    {
      path: "/admin/moderation",
      component: AdminContentModerationPage as ComponentType<PageProps>,
      auth: true,
      title: "Content Moderation",
    },
  ],

  // User Routes
  user: [
    {
      path: "/profile",
      component: ProfilePage as ComponentType<PageProps>,
      auth: true,
      title: "Profile",
    },
    {
      path: "/settings",
      component: SettingsPage as ComponentType<PageProps>,
      auth: true,
      title: "Settings",
    },
  ],

  // Products Routes
  products: [
    {
      path: "/products/papers",
      component: PapersPage as ComponentType<PageProps>,
      title: "Research Papers",
    },
    {
      path: "/products/collections",
      component: CollectionsPage as ComponentType<PageProps>,
      title: "Collections",
    },
    {
      path: "/products/collaborate",
      component: CollaboratePage as ComponentType<PageProps>,
      title: "Collaborate",
    },
    {
      path: "/products/ai-insights",
      component: AIInsightsPage as ComponentType<PageProps>,
      title: "AI Insights",
    },
  ],

  // Resources Routes
  resources: [
    {
      path: "/resources/docs",
      component: DocsPage as ComponentType<PageProps>,
      title: "Documentation",
    },
    {
      path: "/resources/tutorials",
      component: TutorialsPage as ComponentType<PageProps>,
      title: "Tutorials",
    },
    {
      path: "/resources/api",
      component: APIPage as ComponentType<PageProps>,
      title: "API Reference",
    },
    {
      path: "/resources/community",
      component: CommunityPage as ComponentType<PageProps>,
      title: "Community",
    },
  ],

  // Company Routes
  company: [
    {
      path: "/company/about",
      component: AboutPage as ComponentType<PageProps>,
      title: "About Us",
    },
    {
      path: "/company/careers",
      component: CareersPage as ComponentType<PageProps>,
      title: "Careers",
    },
    {
      path: "/company/contact",
      component: ContactPage as ComponentType<PageProps>,
      title: "Contact",
    },
    {
      path: "/company/press",
      component: PressPage as ComponentType<PageProps>,
      title: "Press",
    },
  ],

  // Enterprise Routes
  enterprise: [
    {
      path: "/enterprise",
      component: EnterprisePage as ComponentType<PageProps>,
      exact: true,
      title: "Enterprise",
    },
    {
      path: "/enterprise/teams",
      component: TeamsPage as ComponentType<PageProps>,
      title: "Teams",
    },
    {
      path: "/enterprise/integrations",
      component: IntegrationsPage as ComponentType<PageProps>,
      title: "Integrations",
    },
    {
      path: "/enterprise/support",
      component: SupportPage as ComponentType<PageProps>,
      title: "Support",
    },
  ],

  // Main Routes
  main: [
    {
      path: "/pricing",
      component: PricingPage as ComponentType<PageProps>,
      title: "Pricing",
    },
    {
      path: "/faq",
      component: FAQPage as ComponentType<PageProps>,
      title: "FAQ",
    },
  ],
};

// Flatten all routes for easy lookup
export const allRoutes = Object.values(routes).flat();

// Get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return allRoutes.find((route) => {
    if (route.exact) {
      return route.path === path;
    }
    return path.startsWith(route.path);
  });
};

// Get role from dashboard path
export const getRoleFromPath = (path: string): UserRole => {
  if (path.includes("/admin")) return "admin";
  if (path.includes("/team-lead")) return "team_lead";
  if (path.includes("/pro-researcher")) return "pro_researcher";
  return "researcher";
};

// Route matching helpers
export const isProductsRoute = (path: string): boolean =>
  path.startsWith("/products");
export const isResourcesRoute = (path: string): boolean =>
  path.startsWith("/resources");
export const isCompanyRoute = (path: string): boolean =>
  path.startsWith("/company");
export const isEnterpriseRoute = (path: string): boolean =>
  path.startsWith("/enterprise");
export const isDashboardRoute = (path: string): boolean =>
  path.startsWith("/dashboard");
export const isPapersRoute = (path: string): boolean =>
  path.startsWith("/papers");
export const isCollectionsRoute = (path: string): boolean =>
  path.startsWith("/collections");
export const isWorkspacesRoute = (path: string): boolean =>
  path.startsWith("/workspaces");
export const isResearchRoute = (path: string): boolean =>
  path.startsWith("/research");
export const isPaperRoute = (path: string): boolean =>
  path.startsWith("/paper");
export const isAuthRoute = (path: string): boolean =>
  path === "/login" ||
  path === "/register" ||
  path === "/forgot-password" ||
  path === "/reset-password" ||
  path === "/verify-email";
export const isMarketingRoute = (path: string): boolean =>
  path === "/features" || path === "/how-it-works";
export const isUtilityRoute = (path: string): boolean =>
  path === "/not-found" || path === "/error" || path === "/loading";
export const isProfileRoute = (path: string): boolean => path === "/profile";
export const isSettingsRoute = (path: string): boolean => path === "/settings";
export const isAIInsightsRoute = (path: string): boolean =>
  path === "/ai-insights";
export const isAnalyticsRoute = (path: string): boolean =>
  path === "/analytics";
export const isBillingRoute = (path: string): boolean => path === "/billing";
export const isActivityLogRoute = (path: string): boolean =>
  path === "/activity-log";
export const isDiscussionsRoute = (path: string): boolean =>
  path === "/discussions";
export const isNotificationsRoute = (path: string): boolean =>
  path === "/notifications";
export const isTeamRoute = (path: string): boolean => path === "/team";
export const isResearchNotesRoute = (path: string): boolean =>
  path === "/research-notes";
export const isSearchRoute = (path: string): boolean => path === "/search";
export const isOnboardingRoute = (path: string): boolean =>
  path === "/onboarding";
export const isHelpRoute = (path: string): boolean =>
  path === "/help" || path.startsWith("/help/");
export const isRecentActivityRoute = (path: string): boolean =>
  path === "/recent-activity";
export const isPersonalAnalyticsRoute = (path: string): boolean =>
  path === "/analytics/personal";
export const isWorkspaceAnalyticsRoute = (path: string): boolean =>
  path === "/analytics/workspace" || path.startsWith("/analytics/workspace/");
export const isSecurityRoute = (path: string): boolean =>
  path === "/security" || path.startsWith("/security/");
export const isTwoFactorRoute = (path: string): boolean =>
  path === "/security/2fa";
export const isActiveSessionsRoute = (path: string): boolean =>
  path === "/security/sessions";
export const isImportRoute = (path: string): boolean =>
  path === "/papers/import";
export const isExportRoute = (path: string): boolean =>
  path === "/settings/export";
export const isIntegrationsSettingsRoute = (path: string): boolean =>
  path === "/settings/integrations";
export const isCitationGraphRoute = (path: string): boolean =>
  path === "/research/citation-graph";
export const isAdminReportsRoute = (path: string): boolean =>
  path === "/admin/reports";
export const isAdminAuditRoute = (path: string): boolean =>
  path === "/admin/audit";
export const isActivityRoute = (path: string): boolean =>
  isActivityLogRoute(path) || isDiscussionsRoute(path);
export const isAdminRoute = (path: string): boolean =>
  path === "/admin-overview" || path.startsWith("/admin/");

// Phase 4 Route Helpers
export const isNotificationSettingsRoute = (path: string): boolean =>
  path === "/notifications/settings";
export const isTeamInvitationsRoute = (path: string): boolean =>
  path === "/team/invitations";
export const isAdminPlansRoute = (path: string): boolean =>
  path === "/admin/plans";
export const isDiscoverRoute = (path: string): boolean => path === "/discover";
export const isTrendingRoute = (path: string): boolean =>
  path === "/discover/trending";
export const isRecommendationsRoute = (path: string): boolean =>
  path === "/discover/recommendations";

// Phase 5 Route Helpers
export const isOnboardingRoleRoute = (path: string): boolean =>
  path === "/onboarding/role";
export const isOnboardingWorkspaceRoute = (path: string): boolean =>
  path === "/onboarding/workspace";
export const isAdminPaymentsRoute = (path: string): boolean =>
  path === "/admin/payments";
export const isNotificationCenterRoute = (path: string): boolean =>
  path === "/notifications/center";

// Phase 6 Route Helpers
export const isInvitationRoute = (path: string): boolean =>
  path.startsWith("/invitation/");
export const isTeamActivityRoute = (path: string): boolean =>
  path === "/team/activity";
export const isTeamSettingsRoute = (path: string): boolean =>
  path === "/team/settings";
export const isSearchHistoryRoute = (path: string): boolean =>
  path === "/search/history";

// Phase 7 Route Helpers
export const isAdminWebhooksRoute = (path: string): boolean =>
  path === "/admin/webhooks";
export const isAdminAPIKeysRoute = (path: string): boolean =>
  path === "/admin/api-keys";
export const isAdminContentModerationRoute = (path: string): boolean =>
  path === "/admin/moderation";
export const isPrivacySettingsRoute = (path: string): boolean =>
  path === "/privacy";

// Phase 8 Route Helpers
export const isUsageReportsRoute = (path: string): boolean =>
  path === "/analytics/usage";
export const isPaperRelationsRoute = (path: string): boolean =>
  path.startsWith("/papers/") && path.endsWith("/relations");
export const isResearchMapRoute = (path: string): boolean =>
  path === "/research/map";
export const isNotificationHistoryRoute = (path: string): boolean =>
  path === "/notifications/history";
export const isCollaboratorProfileRoute = (path: string): boolean =>
  path.startsWith("/collaborator/");
export const isExportAnalyticsRoute = (path: string): boolean =>
  path === "/analytics/export";

// Export page components for direct imports
export {
  // Company
  AboutPage,
  ActiveSessionsPage,
  // Additional Dashboard Pages
  ActivityLogPage,
  // Phase 7 - Admin API Keys
  AdminAPIKeysPage,
  AdminAuditLogPage,
  // Phase 7 - Admin Content Moderation
  AdminContentModerationPage,
  // Admin Pages
  AdminOverviewPage,
  // Phase 5 - Admin Payments
  AdminPaymentsPage,
  // Phase 4 - Admin Plans
  AdminPlansPage,
  AdminReportsPage,
  // Phase 7 - Admin Webhooks
  AdminWebhooksPage,
  AIInsightsPage,
  AnalyticsPage,
  AnnotationsPage,
  APIPage,
  BillingPage,
  CareersPage,
  CitationGraphPage,
  CitationsPage,
  CollaboratePage,
  // Phase 8 - Collaborator Profile
  CollaboratorProfilePage,
  CollectionDetailsPage,
  CollectionsPage,
  CommunityPage,
  ContactPage,
  CreateCollectionPage,
  CreateWorkspacePage,
  // Dashboard Additional Pages
  DashboardAIInsightsPage,
  // Dashboard Module - Collections
  DashboardCollectionsPage,
  // Dashboard
  DashboardPage,
  // Dashboard Module - Papers
  DashboardPapersPage,
  // Dashboard Module - Research
  DashboardResearchPage,
  // Dashboard Module - Workspaces
  DashboardWorkspacesPage,
  // Phase 4 - Discover
  DiscoverPage,
  DiscussionsPage,
  // Resources
  DocsPage,
  // New Pages
  EnhancedDashboardPage,
  // Enterprise
  EnterprisePage,
  // Utility Pages
  ErrorPage,
  // Phase 8 - Export Analytics
  ExportAnalyticsPage,
  ExportDataPage,
  FAQPage,
  // Marketing Pages
  FeaturesPage,
  // Auth Pages
  ForgotPasswordPage,
  GlobalSearchPage,
  // Help & Utilities
  HelpCenterPage,
  HowItWorksPage,
  // Import Pages
  ImportPapersPage,
  IntegrationsPage,
  // Settings Pages
  IntegrationsSettingsPage,
  // Phase 6 - Invitation Response
  InvitationResponsePage,
  KeyboardShortcutsPage,
  LoadingPage,
  // Auth
  LoginPage,
  NotFoundPage,
  // Phase 5 - Notification Center
  NotificationCenterPage,
  // Phase 8 - Notification History
  NotificationHistoryPage,
  // Phase 4 - Notification Settings
  NotificationSettingsPage,
  NotificationsPage,
  OnboardingPage,
  // Phase 5 - Onboarding Extended
  OnboardingRolePage,
  OnboardingWorkspacePage,
  PaperDetailPage,
  PaperDetailsPage,
  // Phase 8 - Paper Relations
  PaperRelationsPage,
  // Products
  PapersPage,
  PdfExtractionPage,
  // Analytics Pages
  PersonalAnalyticsPage,
  PressPage,
  // Main
  PricingPage,
  // Phase 7 - Privacy Settings
  PrivacySettingsPage,
  // User
  ProfilePage,
  RecentActivityPage,
  RecommendationsPage,
  RegisterPage,
  // Phase 8 - Research Map
  ResearchMapPage,
  ResearchNotesPage,
  ResetPasswordPage,
  // Phase 6 - Search History
  SearchHistoryPage,
  SearchPapersPage,
  // Security Pages
  SecurityDashboardPage,
  SettingsPage,
  SharedCollectionsPage,
  SharedWorkspacesPage,
  SubscriptionsPage,
  SupportPage,
  SystemSettingsPage,
  // Phase 6 - Team Extended
  TeamActivityPage,
  // Phase 4 - Team Invitations
  TeamInvitationsPage,
  TeamMembersPage,
  // Phase 6 - Team Settings
  TeamSettingsPage,
  TeamsPage,
  TextEditorPage,
  // Phase 4 - Trending and Recommendations
  TrendingPage,
  TutorialsPage,
  // 2FA
  TwoFactorSetupPage,
  UploadPaperPage,
  // Phase 8 - Usage Reports
  UsageReportsPage,
  UserManagementPage,
  VerifyEmailPage,
  // Phase 3 Pages
  WorkspaceAnalyticsPage,
  WorkspaceDetailsPage,
};
