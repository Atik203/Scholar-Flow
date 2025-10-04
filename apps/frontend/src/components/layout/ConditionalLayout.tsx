"use client";

import { Footer } from "@/components/customUI/Footer";
import { Navbar } from "@/components/customUI/Navbar";
import { usePathname } from "next/navigation";
import React from "react";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Dashboard-like pages that should not show the traditional navbar/footer
const dashboardPages = [
  "/dashboard",
  "/papers",
  "/collections",
  "/workspaces",
  "/research",
  "/collaborations",
  "/ai-insights",
  "/collaborate",
  "/teams",
  "/projects",
  "/analytics",
  "/search",
  "/trends",
  "/dashboard/researcher",
  "/dashboard/pro-researcher",
  "/dashboard/team-lead",
  "/dashboard/admin",
];

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if current page is a dashboard-style page
  const isDashboardPage = dashboardPages.some(
    (page) => pathname === page || pathname.startsWith(page + "/")
  );

  if (isDashboardPage) {
    // Dashboard pages handle their own layout with sidebar
    return <>{children}</>;
  }

  // Traditional layout for marketing/public pages
  return (
    <div className="relative overflow-x-hidden min-h-screen pt-6 flex flex-col">
      <Navbar />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </div>
  );
}
