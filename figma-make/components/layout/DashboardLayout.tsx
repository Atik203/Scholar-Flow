"use client";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { AppSidebar } from "./AppSidebar";

// Role types
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface UserInfo {
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserInfo;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

// Role display names
const roleDisplayNames: Record<UserRole, string> = {
  researcher: "Researcher",
  pro_researcher: "Pro Researcher",
  team_lead: "Team Lead",
  admin: "Administrator",
};

// Avatar component
function Avatar({
  src,
  name,
  size = "md",
}: {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium`}
    >
      {initials}
    </div>
  );
}

// User Menu Dropdown - Matches frontend/src/components/customUI/UserMenu.tsx
export function UserMenu({
  user,
  onNavigate,
  onSignOut,
}: {
  user: UserInfo;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    // Simulate sign out delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSigningOut(false);
    setIsOpen(false);
    onSignOut?.();
  };

  // Get dashboard path based on role
  const getDashboardPath = () => {
    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "team_lead":
        return "/dashboard/team-lead";
      case "pro_researcher":
        return "/dashboard/pro-researcher";
      default:
        return "/dashboard/researcher";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-full p-0 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
      >
        <div className="h-9 w-9 aspect-square rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 overflow-hidden flex items-center justify-center bg-primary/10 flex-shrink-0">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {initials}
            </span>
          )}
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 min-w-[18rem] bg-popover dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-xl z-50"
            >
              {/* User Info */}
              <div className="flex items-center justify-start gap-3 p-3 border-b border-border dark:border-gray-700">
                <div className="h-10 w-10 aspect-square rounded-full overflow-hidden flex items-center justify-center bg-primary/10 flex-shrink-0 ring-2 ring-primary/20">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-primary font-semibold text-sm">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-primary font-medium">
                    {roleDisplayNames[user.role]}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate?.(getDashboardPath());
                  }}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-accent dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-colors duration-150"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate?.("/profile");
                  }}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-accent dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-colors duration-150"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate?.("/settings");
                  }}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-accent dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-colors duration-150"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-border dark:border-gray-700 p-1">
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-accent dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-colors duration-150 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isSigningOut ? "Signing out..." : "Log out"}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Theme Toggle
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// Breadcrumb component
function Breadcrumbs({ currentPath }: { currentPath?: string }) {
  if (!currentPath) return null;

  const segments = currentPath.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { label, href };
  });

  return (
    <nav className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium">{crumb.label}</span>
          ) : (
            <span className="text-muted-foreground hover:text-foreground cursor-pointer">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Mobile Navigation
function MobileNav({
  user,
  currentPath,
  onNavigate,
}: {
  user: UserInfo;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed left-0 top-0 z-50 h-full w-72 bg-sidebar">
            <div className="absolute right-2 top-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <AppSidebar
              userRole={user.role}
              currentPath={currentPath}
              onNavigate={(path) => {
                setIsOpen(false);
                onNavigate?.(path);
              }}
            />
          </div>
        </>
      )}
    </>
  );
}

export function DashboardLayout({
  children,
  user,
  currentPath,
  onNavigate,
  onSignOut,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile & Tablet Layout - Hidden sidebar, hamburger menu */}
      <div className="lg:hidden">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <MobileNav
                  user={user}
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                />
                <Breadcrumbs currentPath={currentPath} />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu
                  user={user}
                  onNavigate={onNavigate}
                  onSignOut={onSignOut}
                />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col gap-6 p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Desktop Layout - Fixed Sidebar with Scrollable Content */}
      <div className="hidden lg:flex min-h-screen">
        {/* Fixed Sidebar */}
        <aside className="fixed left-0 top-0 z-30 h-screen w-64 bg-sidebar border-r border-sidebar-border">
          <AppSidebar
            userRole={user.role}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        </aside>

        {/* Main Content - Offset by sidebar width */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <Breadcrumbs currentPath={currentPath} />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu
                  user={user}
                  onNavigate={onNavigate}
                  onSignOut={onSignOut}
                />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col gap-6 p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
