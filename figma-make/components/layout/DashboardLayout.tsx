"use client";
import {
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
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

// User Menu Dropdown
function UserMenu({
  user,
  onNavigate,
  onSignOut,
}: {
  user: UserInfo;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 rounded-full p-0"
      >
        <Avatar src={user.image} name={user.name} size="md" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {roleDisplayNames[user.role]}
              </span>
            </div>

            {/* Menu Items */}
            <div className="p-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.("/profile");
                }}
                className="w-full px-3 py-2 text-left text-sm rounded hover:bg-muted flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.("/settings");
                }}
                className="w-full px-3 py-2 text-left text-sm rounded hover:bg-muted flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>

            <div className="border-t border-border p-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSignOut?.();
                }}
                className="w-full px-3 py-2 text-left text-sm rounded hover:bg-muted flex items-center gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
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
