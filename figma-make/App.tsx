"use client";

/**
 * ScholarFlow - Complete UI Components for Figma Make AI
 *
 * This file serves as the entry point for Figma Make to render all components.
 * Features full navigation between pages without actual routing.
 *
 * PAGES AVAILABLE:
 * 1. / - Home/Landing page with all sections
 * 2. /login - Authentication login page
 * 3. /register - User registration page
 * 4. /dashboard/researcher - Researcher dashboard
 * 5. /dashboard/pro-researcher - Pro Researcher dashboard
 * 6. /dashboard/team-lead - Team Lead dashboard
 * 7. /dashboard/admin - Admin dashboard
 * 8. /paper/:id - Individual paper view with AI summary
 *
 * ROLE DETECTION:
 * - Email starting with "admin" → Admin dashboard
 * - Email starting with "lead" or "team" → Team Lead dashboard
 * - Email starting with "pro" → Pro Researcher dashboard
 * - Any other email → Researcher dashboard
 */

import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// Landing Page Components
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { CTA } from "./components/sections/CTA";
import { Features } from "./components/sections/Features";
import { Hero } from "./components/sections/Hero";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Testimonials } from "./components/sections/Testimonials";

// Full Page Components
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PaperDetailPage } from "./pages/PaperDetailPage";
import { RegisterPage } from "./pages/RegisterPage";

import "./styles/globals.css";

// Role types
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

// Page types for navigation
type PageType = string;

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
  const [currentPage, setCurrentPage] = useState<PageType>("/");
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
    setCurrentPage(path as PageType);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Determine role from dashboard path
  const getRoleFromPath = (path: string): UserRole => {
    if (path.includes("/admin")) return "admin";
    if (path.includes("/team-lead")) return "team_lead";
    if (path.includes("/pro-researcher")) return "pro_researcher";
    return "researcher";
  };

  // Render the current page based on state
  const renderPage = () => {
    // Dashboard routes
    if (currentPage.startsWith("/dashboard")) {
      const role = getRoleFromPath(currentPage);
      return (
        <DashboardPage
          role={role}
          onNavigate={handleNavigate}
          onShowToast={showToast}
        />
      );
    }

    // Paper detail route
    if (currentPage.startsWith("/paper")) {
      return (
        <PaperDetailPage onNavigate={handleNavigate} onShowToast={showToast} />
      );
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
