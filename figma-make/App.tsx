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
 * 4. /dashboard - Main dashboard with stats and papers
 * 5. /paper/:id - Individual paper view with AI summary
 */

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

// Page types for navigation
type PageType =
  | "/"
  | "/login"
  | "/register"
  | "/dashboard"
  | "/paper"
  | "/faq"
  | "/pricing"
  | string;

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("/");

  // Navigation handler - simulates routing without actual router
  const handleNavigate = useCallback((path: string) => {
    console.log("Navigating to:", path);
    setCurrentPage(path as PageType);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case "/login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "/register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "/dashboard":
        return <DashboardPage onNavigate={handleNavigate} />;
      case "/paper":
        return <PaperDetailPage onNavigate={handleNavigate} />;
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
    </div>
  );
}
