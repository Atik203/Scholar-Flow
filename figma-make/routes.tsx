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

// Dashboard Admin Pages
import {
  AdminOverviewPage,
  SubscriptionsPage,
  SystemSettingsPage,
  UserManagementPage,
} from "./pages/dashboard/admin";

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
      component: DashboardPage as ComponentType<PageProps>,
      auth: true,
      exact: true,
      title: "Dashboard",
    },
    {
      path: "/dashboard/researcher",
      component: DashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Researcher Dashboard",
    },
    {
      path: "/dashboard/pro-researcher",
      component: DashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Pro Researcher Dashboard",
    },
    {
      path: "/dashboard/team-lead",
      component: DashboardPage as ComponentType<PageProps>,
      auth: true,
      title: "Team Lead Dashboard",
    },
    {
      path: "/dashboard/admin",
      component: DashboardPage as ComponentType<PageProps>,
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
export const isActivityRoute = (path: string): boolean =>
  isActivityLogRoute(path) || isDiscussionsRoute(path);
export const isAdminRoute = (path: string): boolean =>
  path === "/admin-overview" || path.startsWith("/admin/");

// Export page components for direct imports
export {
  // Company
  AboutPage,
  // Additional Dashboard Pages
  ActivityLogPage,
  // Admin Pages
  AdminOverviewPage,
  AIInsightsPage,
  AnalyticsPage,
  AnnotationsPage,
  APIPage,
  BillingPage,
  CareersPage,
  CitationsPage,
  CollaboratePage,
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
  DiscussionsPage,
  // Resources
  DocsPage,
  // Enterprise
  EnterprisePage,
  // Utility Pages
  ErrorPage,
  FAQPage,
  // Marketing Pages
  FeaturesPage,
  // Auth Pages
  ForgotPasswordPage,
  HowItWorksPage,
  IntegrationsPage,
  LoadingPage,
  // Auth
  LoginPage,
  NotFoundPage,
  PaperDetailPage,
  PaperDetailsPage,
  // Products
  PapersPage,
  PdfExtractionPage,
  PressPage,
  // Main
  PricingPage,
  // User
  ProfilePage,
  RegisterPage,
  ResetPasswordPage,
  SearchPapersPage,
  SettingsPage,
  SharedCollectionsPage,
  SharedWorkspacesPage,
  SubscriptionsPage,
  SupportPage,
  SystemSettingsPage,
  TeamsPage,
  TextEditorPage,
  TutorialsPage,
  UploadPaperPage,
  UserManagementPage,
  VerifyEmailPage,
  WorkspaceDetailsPage,
};
