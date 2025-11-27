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
 * - Products Routes: /products/*
 * - Resources Routes: /resources/*
 * - Company Routes: /company/*
 * - Enterprise Routes: /enterprise/*
 * - Main Routes: /pricing, /faq
 */

import type { ComponentType } from "react";

// Auth Pages
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// Dashboard Pages
import { DashboardPage } from "./pages/DashboardPage";
import { PaperDetailPage } from "./pages/PaperDetailPage";

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
  ],

  // Dashboard Routes
  dashboard: [
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
export const isPaperRoute = (path: string): boolean =>
  path.startsWith("/paper");
export const isAuthRoute = (path: string): boolean =>
  path === "/login" || path === "/register";

// Export page components for direct imports
export {
  // Company
  AboutPage,
  AIInsightsPage,
  APIPage,
  CareersPage,
  CollaboratePage,
  CollectionsPage,
  CommunityPage,
  ContactPage,
  // Dashboard
  DashboardPage,
  // Resources
  DocsPage,
  // Enterprise
  EnterprisePage,
  FAQPage,
  IntegrationsPage,
  // Auth
  LoginPage,
  PaperDetailPage,
  // Products
  PapersPage,
  PressPage,
  // Main
  PricingPage,
  RegisterPage,
  SupportPage,
  TeamsPage,
  TutorialsPage,
};
