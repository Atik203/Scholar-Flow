"use client";

/**
 * ScholarFlow - Complete UI Components for Figma Make AI
 *
 * This file serves as the entry point for Figma Make to render all components.
 * Features full navigation between pages without actual routing.
 *
 * See routes.tsx for complete list of available pages and routing configuration.
 */

import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// Role Context Provider
import { RoleProvider } from "./components/context";

// Landing Page Components
import { AuthenticatedNavbar } from "./components/layout/AuthenticatedNavbar";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { Comparison } from "./components/sections/Comparison";
import { CTA } from "./components/sections/CTA";
import { FAQ } from "./components/sections/FAQ";
import { Features } from "./components/sections/Features";
import { Hero } from "./components/sections/Hero";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Integrations } from "./components/sections/Integrations";
import { Newsletter } from "./components/sections/Newsletter";
import { Testimonials } from "./components/sections/Testimonials";

// Import all pages from routes
import {
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
  // Route helpers
  getRoleFromPath,
  GlobalSearchPage,
  HelpCenterPage,
  HowItWorksPage,
  // Import Pages
  ImportPapersPage,
  IntegrationsPage,
  // Settings Pages
  IntegrationsSettingsPage,
  // Phase 6 - Invitation Response
  InvitationResponsePage,
  isActiveSessionsRoute,
  isActivityRoute,
  isAdminRoute,
  isAIInsightsRoute,
  isAnalyticsRoute,
  isAuthRoute,
  isBillingRoute,
  isCitationGraphRoute,
  // Phase 8 - Collaborator Profile Route Helper
  isCollaboratorProfileRoute,
  isCollectionsRoute,
  isDashboardRoute,
  isDiscoverRoute,
  // Phase 8 - Export Analytics Route Helper
  isExportAnalyticsRoute,
  isExportRoute,
  isHelpRoute,
  // Settings Integrations Route Helper
  isIntegrationsSettingsRoute,
  // Phase 6 - Invitation Route Helper
  isInvitationRoute,
  isMarketingRoute,
  // Phase 5 - Notification Center
  isNotificationCenterRoute,
  // Phase 8 - Notification History Route Helper
  isNotificationHistoryRoute,
  isNotificationSettingsRoute,
  isNotificationsRoute,
  // Phase 5 - Onboarding Extended
  isOnboardingRoleRoute,
  isOnboardingRoute,
  isOnboardingWorkspaceRoute,
  // Phase 8 - Paper Relations Route Helper
  isPaperRelationsRoute,
  isPaperRoute,
  isPapersRoute,
  isPersonalAnalyticsRoute,
  isPrivacySettingsRoute,
  isProductsRoute,
  isProfileRoute,
  isRecentActivityRoute,
  isRecommendationsRoute,
  // Phase 8 - Research Map Route Helper
  isResearchMapRoute,
  isResearchNotesRoute,
  isResearchRoute,
  // Phase 6 - Search History Route Helper
  isSearchHistoryRoute,
  isSearchRoute,
  isSecurityRoute,
  isSettingsRoute,
  // Phase 6 - Team Extended Route Helpers
  isTeamActivityRoute,
  isTeamInvitationsRoute,
  isTeamRoute,
  isTeamSettingsRoute,
  // Phase 4 - Trending and Recommendations route helpers
  isTrendingRoute,
  isTwoFactorRoute,
  // Phase 8 - Usage Reports Route Helper
  isUsageReportsRoute,
  isUtilityRoute,
  isWorkspaceAnalyticsRoute,
  isWorkspacesRoute,
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
  // Phase 6 - Team Activity
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
} from "./routes";

import "./styles/globals.css";

// Toast types
interface Toast {
  id: number;
  message: string;
  type: "error" | "success" | "info";
}

// Toast Component
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border ${
              toast.type === "error"
                ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                : toast.type === "success"
                  ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                  : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
            }`}
          >
            {toast.type === "error" && (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            {toast.type === "success" && (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("/");
  const [currentRole, setCurrentRole] = useState<
    "researcher" | "pro_researcher" | "team_lead" | "admin"
  >("researcher");
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastId = 0;

  // Show toast function
  const showToast = useCallback(
    (message: string, type: "error" | "success" | "info") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  // Dismiss toast
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Navigation handler - simulates routing without actual router
  // IMPORTANT: Role is persisted across navigation. Only update role when:
  // 1. Explicitly navigating to a role-specific dashboard route (e.g., /dashboard/admin)
  // 2. Navigating to admin routes (automatically sets admin role)
  // 3. Navigating to public/auth routes (resets to researcher)
  const handleNavigate = useCallback((path: string) => {
    console.log("Navigating to:", path);
    setCurrentPage(path);

    // Only update role for explicit role-specific dashboard routes
    if (
      path === "/dashboard/admin" ||
      path === "/dashboard/team-lead" ||
      path === "/dashboard/pro-researcher" ||
      path === "/dashboard/researcher"
    ) {
      const role = getRoleFromPath(path);
      setCurrentRole(role);
    }

    // Admin routes always require admin role
    if (path.startsWith("/admin") || path === "/admin-overview") {
      setCurrentRole("admin");
    }

    // Reset to researcher when going to public/auth routes
    if (
      isAuthRoute(path) ||
      isMarketingRoute(path) ||
      path === "/" ||
      path === "/pricing" ||
      path === "/faq"
    ) {
      setCurrentRole("researcher");
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Render the current page based on state
  const renderPage = () => {
    // Dashboard routes - use currentRole state instead of extracting from path
    // This ensures role persists when navigating to /dashboard without role suffix
    if (isDashboardRoute(currentPage)) {
      return (
        <EnhancedDashboardPage role={currentRole} onNavigate={handleNavigate} />
      );
    }

    // AI Insights route
    if (isAIInsightsRoute(currentPage)) {
      return <DashboardAIInsightsPage onNavigate={handleNavigate} />;
    }

    // Analytics route
    if (isAnalyticsRoute(currentPage)) {
      return <AnalyticsPage onNavigate={handleNavigate} />;
    }

    // Personal Analytics route
    if (isPersonalAnalyticsRoute(currentPage)) {
      return <PersonalAnalyticsPage onNavigate={handleNavigate} />;
    }

    // Workspace Analytics route
    if (isWorkspaceAnalyticsRoute(currentPage)) {
      return <WorkspaceAnalyticsPage onNavigate={handleNavigate} />;
    }

    // Citation Graph route (Research)
    if (isCitationGraphRoute(currentPage)) {
      return <CitationGraphPage onNavigate={handleNavigate} />;
    }

    // Active Sessions route (Security)
    if (isActiveSessionsRoute(currentPage)) {
      return <ActiveSessionsPage onNavigate={handleNavigate} />;
    }

    // Export Data route (Settings)
    if (isExportRoute(currentPage)) {
      return <ExportDataPage onNavigate={handleNavigate} />;
    }

    // Integrations Settings route
    if (isIntegrationsSettingsRoute(currentPage)) {
      return <IntegrationsSettingsPage onNavigate={handleNavigate} />;
    }

    // Billing route
    if (isBillingRoute(currentPage)) {
      return <BillingPage onNavigate={handleNavigate} />;
    }

    // Notifications route
    if (isNotificationsRoute(currentPage)) {
      return <NotificationsPage onNavigate={handleNavigate} />;
    }

    // Notification Settings route (Phase 4)
    if (isNotificationSettingsRoute(currentPage)) {
      return <NotificationSettingsPage onNavigate={handleNavigate} />;
    }

    // Team Invitations route (Phase 4)
    if (isTeamInvitationsRoute(currentPage)) {
      return <TeamInvitationsPage onNavigate={handleNavigate} />;
    }

    // Discover route (Phase 4)
    if (isDiscoverRoute(currentPage)) {
      return <DiscoverPage onNavigate={handleNavigate} />;
    }

    // Trending route (Phase 4)
    if (isTrendingRoute(currentPage)) {
      return <TrendingPage onNavigate={handleNavigate} />;
    }

    // Recommendations route (Phase 4)
    if (isRecommendationsRoute(currentPage)) {
      return <RecommendationsPage onNavigate={handleNavigate} />;
    }

    // Team Members route
    if (isTeamRoute(currentPage)) {
      return <TeamMembersPage onNavigate={handleNavigate} />;
    }

    // Research Notes route
    if (isResearchNotesRoute(currentPage)) {
      return <ResearchNotesPage onNavigate={handleNavigate} />;
    }

    // Global Search route
    if (isSearchRoute(currentPage)) {
      return <GlobalSearchPage onNavigate={handleNavigate} />;
    }

    // Onboarding route
    if (isOnboardingRoute(currentPage)) {
      return <OnboardingPage onNavigate={handleNavigate} />;
    }

    // Phase 5 - Onboarding Extended routes
    if (isOnboardingRoleRoute(currentPage)) {
      return <OnboardingRolePage onNavigate={handleNavigate} />;
    }

    if (isOnboardingWorkspaceRoute(currentPage)) {
      return <OnboardingWorkspacePage onNavigate={handleNavigate} />;
    }

    // Phase 5 - Notification Center route
    if (isNotificationCenterRoute(currentPage)) {
      return <NotificationCenterPage onNavigate={handleNavigate} />;
    }

    // Phase 6 - Invitation Response route
    if (isInvitationRoute(currentPage)) {
      return <InvitationResponsePage onNavigate={handleNavigate} />;
    }

    // Phase 6 - Team Activity route
    if (isTeamActivityRoute(currentPage)) {
      return <TeamActivityPage onNavigate={handleNavigate} />;
    }

    // Phase 6 - Team Settings route
    if (isTeamSettingsRoute(currentPage)) {
      return <TeamSettingsPage onNavigate={handleNavigate} />;
    }

    // Phase 6 - Search History route
    if (isSearchHistoryRoute(currentPage)) {
      return <SearchHistoryPage onNavigate={handleNavigate} />;
    }

    // Help routes (Help Center, Keyboard Shortcuts)
    if (isHelpRoute(currentPage)) {
      switch (currentPage) {
        case "/help/shortcuts":
          return <KeyboardShortcutsPage onNavigate={handleNavigate} />;
        case "/help":
        default:
          return <HelpCenterPage onNavigate={handleNavigate} />;
      }
    }

    // Recent Activity route
    if (isRecentActivityRoute(currentPage)) {
      return <RecentActivityPage onNavigate={handleNavigate} />;
    }

    // Activity routes (Activity Log, Discussions)
    if (isActivityRoute(currentPage)) {
      switch (currentPage) {
        case "/activity-log":
          return (
            <ActivityLogPage onNavigate={handleNavigate} role={currentRole} />
          );
        case "/discussions":
          return (
            <DiscussionsPage onNavigate={handleNavigate} role={currentRole} />
          );
        default:
          return (
            <ActivityLogPage onNavigate={handleNavigate} role={currentRole} />
          );
      }
    }

    // Admin routes
    if (isAdminRoute(currentPage)) {
      switch (currentPage) {
        case "/admin-overview":
          return <AdminOverviewPage onNavigate={handleNavigate} />;
        case "/admin/users":
          return <UserManagementPage onNavigate={handleNavigate} />;
        case "/admin/subscriptions":
          return <SubscriptionsPage onNavigate={handleNavigate} />;
        case "/admin/settings":
          return <SystemSettingsPage onNavigate={handleNavigate} />;
        case "/admin/reports":
          return <AdminReportsPage onNavigate={handleNavigate} />;
        case "/admin/audit":
          return <AdminAuditLogPage onNavigate={handleNavigate} />;
        case "/admin/plans":
          return <AdminPlansPage onNavigate={handleNavigate} />;
        case "/admin/payments":
          return <AdminPaymentsPage onNavigate={handleNavigate} />;
        case "/admin/webhooks":
          return <AdminWebhooksPage onNavigate={handleNavigate} />;
        case "/admin/api-keys":
          return <AdminAPIKeysPage onNavigate={handleNavigate} />;
        case "/admin/moderation":
          return <AdminContentModerationPage onNavigate={handleNavigate} />;
        default:
          return <AdminOverviewPage onNavigate={handleNavigate} />;
      }
    }

    // Privacy settings route
    if (isPrivacySettingsRoute(currentPage)) {
      return <PrivacySettingsPage onNavigate={handleNavigate} />;
    }

    // Phase 8 - Usage Reports route
    if (isUsageReportsRoute(currentPage)) {
      return <UsageReportsPage onNavigate={handleNavigate} />;
    }

    // Phase 8 - Paper Relations route
    if (isPaperRelationsRoute(currentPage)) {
      return <PaperRelationsPage onNavigate={handleNavigate} />;
    }

    // Phase 8 - Research Map route
    if (isResearchMapRoute(currentPage)) {
      return <ResearchMapPage onNavigate={handleNavigate} />;
    }

    // Phase 8 - Notification History route
    if (isNotificationHistoryRoute(currentPage)) {
      return <NotificationHistoryPage onNavigate={handleNavigate} />;
    }

    // Phase 8 - Collaborator Profile route
    if (isCollaboratorProfileRoute(currentPage)) {
      return <CollaboratorProfilePage onNavigate={handleNavigate} />;
    }

    // Phase 8 - Export Analytics route
    if (isExportAnalyticsRoute(currentPage)) {
      return <ExportAnalyticsPage onNavigate={handleNavigate} />;
    }

    // Papers module routes (dashboard)
    if (isPapersRoute(currentPage)) {
      switch (currentPage) {
        case "/papers":
          return <DashboardPapersPage onNavigate={handleNavigate} />;
        case "/papers/upload":
          return <UploadPaperPage onNavigate={handleNavigate} />;
        case "/papers/search":
          return <SearchPapersPage onNavigate={handleNavigate} />;
        case "/papers/import":
          return <ImportPapersPage onNavigate={handleNavigate} />;
        default:
          // Handle /papers/:id pattern for paper details
          if (currentPage.startsWith("/papers/")) {
            return <PaperDetailsPage onNavigate={handleNavigate} />;
          }
          return <DashboardPapersPage onNavigate={handleNavigate} />;
      }
    }

    // Collections module routes (dashboard)
    if (isCollectionsRoute(currentPage)) {
      switch (currentPage) {
        case "/collections":
          return <DashboardCollectionsPage onNavigate={handleNavigate} />;
        case "/collections/create":
          return <CreateCollectionPage onNavigate={handleNavigate} />;
        case "/collections/shared":
          return <SharedCollectionsPage onNavigate={handleNavigate} />;
        default:
          // Handle /collections/:id pattern for collection details
          if (currentPage.startsWith("/collections/")) {
            return <CollectionDetailsPage onNavigate={handleNavigate} />;
          }
          return <DashboardCollectionsPage onNavigate={handleNavigate} />;
      }
    }

    // Workspaces module routes (dashboard)
    if (isWorkspacesRoute(currentPage)) {
      switch (currentPage) {
        case "/workspaces":
          return <DashboardWorkspacesPage onNavigate={handleNavigate} />;
        case "/workspaces/create":
          return <CreateWorkspacePage onNavigate={handleNavigate} />;
        case "/workspaces/shared":
          return <SharedWorkspacesPage onNavigate={handleNavigate} />;
        default:
          // Handle /workspaces/:id pattern for workspace details
          if (currentPage.startsWith("/workspaces/")) {
            return <WorkspaceDetailsPage onNavigate={handleNavigate} />;
          }
          return <DashboardWorkspacesPage onNavigate={handleNavigate} />;
      }
    }

    // Research module routes (dashboard)
    if (isResearchRoute(currentPage)) {
      switch (currentPage) {
        case "/research":
          return <DashboardResearchPage onNavigate={handleNavigate} />;
        case "/research/pdf-extraction":
          return <PdfExtractionPage onNavigate={handleNavigate} />;
        case "/research/editor":
          return <TextEditorPage onNavigate={handleNavigate} />;
        case "/research/citations":
          return <CitationsPage onNavigate={handleNavigate} />;
        case "/research/annotations":
          return <AnnotationsPage onNavigate={handleNavigate} />;
        default:
          return <DashboardResearchPage onNavigate={handleNavigate} />;
      }
    }

    // Paper detail route
    if (isPaperRoute(currentPage)) {
      return (
        <PaperDetailPage onNavigate={handleNavigate} onShowToast={showToast} />
      );
    }

    // Profile route
    if (isProfileRoute(currentPage)) {
      return (
        <>
          <AuthenticatedNavbar onNavigate={handleNavigate} />
          <ProfilePage onNavigate={handleNavigate} onShowToast={showToast} />
          <Footer onNavigate={handleNavigate} />
        </>
      );
    }

    // Settings route
    if (isSettingsRoute(currentPage)) {
      return (
        <>
          <AuthenticatedNavbar onNavigate={handleNavigate} />
          <SettingsPage onNavigate={handleNavigate} onShowToast={showToast} />
          <Footer onNavigate={handleNavigate} />
        </>
      );
    }

    // Security routes
    if (isSecurityRoute(currentPage)) {
      if (isTwoFactorRoute(currentPage)) {
        return <TwoFactorSetupPage onNavigate={handleNavigate} />;
      }
      return <SecurityDashboardPage onNavigate={handleNavigate} />;
    }

    // Products routes
    if (isProductsRoute(currentPage)) {
      switch (currentPage) {
        case "/products/papers":
          return <PapersPage onNavigate={handleNavigate} />;
        case "/products/collections":
          return <CollectionsPage onNavigate={handleNavigate} />;
        case "/products/collaborate":
          return <CollaboratePage onNavigate={handleNavigate} />;
        case "/products/ai-insights":
          return <AIInsightsPage onNavigate={handleNavigate} />;
        default:
          return <PapersPage onNavigate={handleNavigate} />;
      }
    }

    // Resources routes
    if (currentPage.startsWith("/resources")) {
      switch (currentPage) {
        case "/resources/docs":
          return <DocsPage onNavigate={handleNavigate} />;
        case "/resources/tutorials":
          return <TutorialsPage onNavigate={handleNavigate} />;
        case "/resources/api":
          return <APIPage onNavigate={handleNavigate} />;
        case "/resources/community":
          return <CommunityPage onNavigate={handleNavigate} />;
        default:
          return <DocsPage onNavigate={handleNavigate} />;
      }
    }

    // Company routes
    if (currentPage.startsWith("/company")) {
      switch (currentPage) {
        case "/company/about":
          return <AboutPage onNavigate={handleNavigate} />;
        case "/company/careers":
          return <CareersPage onNavigate={handleNavigate} />;
        case "/company/contact":
          return <ContactPage onNavigate={handleNavigate} />;
        case "/company/press":
          return <PressPage onNavigate={handleNavigate} />;
        default:
          return <AboutPage onNavigate={handleNavigate} />;
      }
    }

    // Enterprise routes
    if (currentPage.startsWith("/enterprise")) {
      switch (currentPage) {
        case "/enterprise":
          return <EnterprisePage onNavigate={handleNavigate} />;
        case "/enterprise/teams":
          return <TeamsPage onNavigate={handleNavigate} />;
        case "/enterprise/integrations":
          return <IntegrationsPage onNavigate={handleNavigate} />;
        case "/enterprise/support":
          return <SupportPage onNavigate={handleNavigate} />;
        default:
          return <EnterprisePage onNavigate={handleNavigate} />;
      }
    }

    // Auth routes (forgot password, reset password, verify email)
    if (isAuthRoute(currentPage)) {
      switch (currentPage) {
        case "/login":
          return (
            <LoginPage onNavigate={handleNavigate} onShowToast={showToast} />
          );
        case "/register":
          return (
            <RegisterPage onNavigate={handleNavigate} onShowToast={showToast} />
          );
        case "/forgot-password":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <ForgotPasswordPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        case "/reset-password":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <ResetPasswordPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        case "/verify-email":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <VerifyEmailPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        default:
          return (
            <LoginPage onNavigate={handleNavigate} onShowToast={showToast} />
          );
      }
    }

    // Utility routes (404, error, loading)
    if (isUtilityRoute(currentPage)) {
      switch (currentPage) {
        case "/not-found":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <NotFoundPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        case "/error":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <ErrorPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        case "/loading":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <LoadingPage />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        default:
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <NotFoundPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
      }
    }

    // Marketing routes (features, how-it-works)
    if (isMarketingRoute(currentPage)) {
      switch (currentPage) {
        case "/features":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <FeaturesPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        case "/how-it-works":
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <HowItWorksPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
        default:
          return (
            <>
              <Navbar onNavigate={handleNavigate} />
              <FeaturesPage onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          );
      }
    }

    switch (currentPage) {
      case "/pricing":
        return <PricingPage onNavigate={handleNavigate} />;
      case "/faq":
        return <FAQPage onNavigate={handleNavigate} />;
      case "/":
      default:
        // Landing page with all sections
        return (
          <>
            <Navbar onNavigate={handleNavigate} />
            <main>
              <Hero onNavigate={handleNavigate} />
              <Features />
              <HowItWorks />
              <Integrations />
              <Comparison />
              <Testimonials />
              <FAQ />
              <Newsletter />
              <CTA onNavigate={handleNavigate} />
            </main>
            <Footer onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <RoleProvider role={currentRole} onRoleChange={setCurrentRole}>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </RoleProvider>
  );
}
