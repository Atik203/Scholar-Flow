"use client";

import { handleSignOutWithLoading } from "@/lib/auth/signout";
import { useAuth } from "@/redux/auth/useAuth";
import { useGetUnreadCountQuery } from "@/redux/api/notificationApi";
import {
  Bell,
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
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./AppSidebar";
import { USER_ROLES } from "@/lib/auth/roles";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Role display names
const roleDisplayNames: Record<string, string> = {
  [USER_ROLES.RESEARCHER]: "Researcher",
  [USER_ROLES.PRO_RESEARCHER]: "Pro Researcher",
  [USER_ROLES.TEAM_LEAD]: "Team Lead",
  [USER_ROLES.ADMIN]: "Administrator",
};

// Use actual user info from Redux Auth state
function UserMenu() {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const user = session?.user;
  const role = user?.role || USER_ROLES.RESEARCHER;
  const name = user?.name || "User";
  const email = user?.email || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    setIsOpen(false);
    void handleSignOutWithLoading(setIsSigningOut);
  };

  const getDashboardPath = () => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "/dashboard/admin";
      case USER_ROLES.TEAM_LEAD:
        return "/dashboard/team-lead";
      case USER_ROLES.PRO_RESEARCHER:
        return "/dashboard/pro-researcher";
      default:
        return "/dashboard"; // Fallback/default is just researcher, which is under /dashboard or /dashboard/researcher based on App layout. Usually it's /dashboard
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
          {user?.image ? (
            <img
              src={user.image}
              alt={name}
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
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 min-w-[18rem] bg-popover dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-xl z-50"
            >
              <div className="flex items-center justify-start gap-3 p-3 border-b border-border dark:border-gray-700">
                <div className="h-10 w-10 aspect-square rounded-full overflow-hidden flex items-center justify-center bg-primary/10 flex-shrink-0 ring-2 ring-primary/20">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={name}
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
                    {name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground dark:text-gray-400 truncate">
                    {email}
                  </p>
                  <p className="text-xs leading-none text-primary font-medium">
                    {roleDisplayNames[role] || "User"}
                  </p>
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push(getDashboardPath());
                  }}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-accent dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-colors duration-150"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/profile");
                  }}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-accent dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-colors duration-150"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/settings");
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
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-accent dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-colors duration-150 text-red-600 dark:text-red-400 disabled:opacity-50"
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

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function NotificationBell() {
  const { data } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });
  const unreadCount = data?.data?.count || 0;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative hidden md:flex text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-1" 
      asChild
    >
      <Link href="/dashboard/notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-900" />
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  );
}

// Breadcrumb component auto-generating from Next.js pathname
function Breadcrumbs({ currentPath }: { currentPath?: string }) {
  if (!currentPath) return null;

  const segments = currentPath.split("/").filter(Boolean);
  const breadcrumbs = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");

    if (segment === "dashboard") continue;

    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({ label, href });
  }

  if (breadcrumbs.length === 0) {
    return <span className="font-medium">Dashboard</span>;
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href}>
                <span className="text-muted-foreground hover:text-foreground transition-colors">
                  {crumb.label}
                </span>
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

// Mobile Navigation
function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sidebarContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 99999, isolation: "isolate" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute left-0 top-0 h-full w-[280px] sm:w-[320px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="absolute right-3 top-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>

            <div className="h-full overflow-hidden">
              <AppSidebar onNavigate={() => setIsOpen(false)} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden h-9 w-9 border-border bg-background hover:bg-accent dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5 text-foreground dark:text-white" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {mounted && createPortal(sidebarContent, document.body)}
    </>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-foreground">
      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
            <div className="flex w-full items-center justify-between px-3 sm:px-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <MobileNav />
                <Breadcrumbs currentPath={pathname} />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <NotificationBell />
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col gap-4 p-3 sm:p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <aside className="fixed left-0 top-0 z-30 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm">
          <AppSidebar />
        </aside>

        <div className="flex-1 ml-72 flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-sm">
            <div className="flex w-full items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <Breadcrumbs currentPath={pathname} />
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 flex justify-center">
            <div className="flex flex-col gap-6 p-6 w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
