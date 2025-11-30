"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// Import all dashboard pages
import {
  AnnotationsPage,
  CitationsPage,
  CollectionsPage,
  CreateCollectionPage,
  CreateWorkspacePage,
  PapersPage,
  PdfExtractionPage,
  ResearchPage,
  SearchPapersPage,
  SharedCollectionsPage,
  SharedWorkspacesPage,
  TextEditorPage,
  UploadPaperPage,
  WorkspacesPage,
} from "../pages/dashboard";

// Import layout components
import { AppHeader } from "../components/layout/AppHeader";
import { AppSidebar } from "../components/layout/AppSidebar";

type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface DashboardRouterProps {
  initialPath?: string;
  userRole?: UserRole;
}

// Route configuration
const routes: Record<
  string,
  React.ComponentType<{ onNavigate: (path: string) => void }>
> = {
  "/dashboard": ({ onNavigate }) => <DashboardHome onNavigate={onNavigate} />,
  "/papers": PapersPage,
  "/papers/upload": UploadPaperPage,
  "/papers/search": SearchPapersPage,
  "/collections": CollectionsPage,
  "/collections/create": CreateCollectionPage,
  "/collections/shared": SharedCollectionsPage,
  "/workspaces": WorkspacesPage,
  "/workspaces/create": CreateWorkspacePage,
  "/workspaces/shared": SharedWorkspacesPage,
  "/research": ResearchPage,
  "/research/pdf-extraction": PdfExtractionPage,
  "/research/editor": TextEditorPage,
  "/research/citations": CitationsPage,
  "/research/annotations": AnnotationsPage,
};

// Dashboard Home Page
function DashboardHome({ onNavigate }: { onNavigate: (path: string) => void }) {
  const quickStats = [
    { label: "Total Papers", value: "24", change: "+3 this week" },
    { label: "Collections", value: "8", change: "+1 this week" },
    { label: "Workspaces", value: "3", change: "Active" },
    { label: "Annotations", value: "156", change: "+12 today" },
  ];

  const recentActivity = [
    {
      action: "Uploaded",
      item: "Machine Learning Basics.pdf",
      time: "2 hours ago",
    },
    { action: "Created", item: "AI Research Collection", time: "5 hours ago" },
    { action: "Annotated", item: "Neural Networks Paper", time: "Yesterday" },
    { action: "Shared", item: "Data Science Workspace", time: "2 days ago" },
  ];

  const quickActions = [
    { label: "Upload Paper", path: "/papers/upload", icon: "📄" },
    { label: "Create Collection", path: "/collections/create", icon: "📚" },
    { label: "Create Workspace", path: "/workspaces/create", icon: "🗂️" },
    { label: "Search Papers", path: "/papers/search", icon: "🔍" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-xl p-6 border border-primary/20"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, Researcher! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your research today.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {stat.value}
            </p>
            <p className="text-xs text-primary mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.path)}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-primary/10 dark:hover:bg-primary/20 border border-gray-200 dark:border-gray-600 transition-colors"
            >
              <span className="text-2xl mb-2">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.action}
                </span>{" "}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.item}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Getting Started Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 Tips for Getting Started
        </h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Upload your research papers to start building your library
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Create collections to organize papers by topic or project
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Use workspaces to collaborate with your research team</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Try the AI-powered features to extract insights from your papers
            </span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

// Placeholder pages for unimplemented routes
function PlaceholderPage({
  title,
  onNavigate,
}: {
  title: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This page is under construction. Check back soon!
        </p>
        <button
          onClick={() => onNavigate("/dashboard")}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

// Additional placeholder routes
const additionalRoutes: Record<string, string> = {
  "/ai-insights": "AI Insights",
  "/analytics": "Analytics",
  "/billing": "Billing",
  "/admin-overview": "Admin Overview",
  "/users": "User Management",
  "/subscriptions": "Subscriptions",
  "/settings": "System Settings",
};

export function DashboardRouter({
  initialPath = "/dashboard",
  userRole = "researcher",
}: DashboardRouterProps) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  // Get the component for the current route
  const getPageComponent = () => {
    // Check main routes first
    const RouteComponent = routes[currentPath];
    if (RouteComponent) {
      return <RouteComponent onNavigate={handleNavigate} />;
    }

    // Check for dynamic routes (e.g., /papers/[id])
    // For now, redirect to parent route
    const parentPath =
      currentPath.split("/").slice(0, -1).join("/") || "/dashboard";
    const ParentComponent = routes[parentPath];
    if (ParentComponent && currentPath !== parentPath) {
      // If there's an ID segment, show the parent component
      return <ParentComponent onNavigate={handleNavigate} />;
    }

    // Check placeholder routes
    const placeholderTitle = additionalRoutes[currentPath];
    if (placeholderTitle) {
      return (
        <PlaceholderPage title={placeholderTitle} onNavigate={handleNavigate} />
      );
    }

    // Default to dashboard home
    return <DashboardHome onNavigate={handleNavigate} />;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden`}
      >
        <AppSidebar
          userRole={userRole}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AppHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSearch={(query) => {
            console.log("Search:", query);
            handleNavigate("/papers/search");
          }}
          notifications={[
            {
              id: "1",
              type: "info",
              title: "Paper processed",
              message: "Your paper has been processed successfully",
              createdAt: new Date(),
              read: false,
            },
          ]}
          onNotificationClick={(id) => console.log("Notification:", id)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {getPageComponent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default DashboardRouter;
