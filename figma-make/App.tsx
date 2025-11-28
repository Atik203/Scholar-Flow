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

// Landing Page Components
import { AuthenticatedNavbar } from "./components/layout/AuthenticatedNavbar";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { CTA } from "./components/sections/CTA";
import { Features } from "./components/sections/Features";
import { Hero } from "./components/sections/Hero";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Testimonials } from "./components/sections/Testimonials";

// Import all pages from routes
import {
  // Company
  AboutPage,
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
  // Resources
  DocsPage,
  // Enterprise
  EnterprisePage,
  FAQPage,
  // Route helpers
  getRoleFromPath,
  IntegrationsPage,
  isAIInsightsRoute,
  isAnalyticsRoute,
  isBillingRoute,
  isCollectionsRoute,
  isDashboardRoute,
  isPaperRoute,
  isPapersRoute,
  isProductsRoute,
  isProfileRoute,
  isResearchRoute,
  isSettingsRoute,
  isWorkspacesRoute,
  // Auth
  LoginPage,
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
  SearchPapersPage,
  SettingsPage,
  SharedCollectionsPage,
  SharedWorkspacesPage,
  SupportPage,
  TeamsPage,
  TextEditorPage,
  TutorialsPage,
  UploadPaperPage,
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
  const handleNavigate = useCallback((path: string) => {
    console.log("Navigating to:", path);
    setCurrentPage(path);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Render the current page based on state
  const renderPage = () => {
    // Dashboard routes
    if (isDashboardRoute(currentPage)) {
      const role = getRoleFromPath(currentPage);
      return (
        <DashboardPage
          role={role}
          onNavigate={handleNavigate}
          onShowToast={showToast}
        />
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

    // Billing route
    if (isBillingRoute(currentPage)) {
      return <BillingPage onNavigate={handleNavigate} />;
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

    switch (currentPage) {
      case "/login":
        return (
          <LoginPage onNavigate={handleNavigate} onShowToast={showToast} />
        );
      case "/register":
        return (
          <RegisterPage onNavigate={handleNavigate} onShowToast={showToast} />
        );
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
              <Testimonials />
              <CTA onNavigate={handleNavigate} />
            </main>
            <Footer onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
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
  );
}
