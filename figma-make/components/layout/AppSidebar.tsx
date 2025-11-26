"use client";
import {
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  Highlighter,
  Home,
  Layers,
  Microscope,
  Plus,
  Quote,
  Search,
  Settings,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

// Role types
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface AppSidebarProps {
  userRole: UserRole;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  items?: { title: string; path: string; icon: React.ElementType }[];
  minRole?: UserRole;
  badge?: string;
}

// Role hierarchy for access control
const roleHierarchy: Record<UserRole, number> = {
  researcher: 1,
  pro_researcher: 2,
  team_lead: 3,
  admin: 4,
};

const hasRoleAccess = (userRole: UserRole, minRole?: UserRole): boolean => {
  if (!minRole) return true;
  return roleHierarchy[userRole] >= roleHierarchy[minRole];
};

// Navigation items matching original frontend
const navigationItems: SidebarItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "Papers",
    icon: FileText,
    items: [
      { title: "All Papers", path: "/papers", icon: FileText },
      { title: "Upload Paper", path: "/papers/upload", icon: Upload },
      { title: "Search Papers", path: "/papers/search", icon: Search },
    ],
  },
  {
    title: "Collections",
    icon: BookOpen,
    items: [
      { title: "My Collections", path: "/collections", icon: BookOpen },
      { title: "Create Collection", path: "/collections/create", icon: Plus },
      { title: "Shared Collections", path: "/collections/shared", icon: Users },
    ],
  },
  {
    title: "Workspaces",
    icon: Layers,
    items: [
      { title: "My Workspaces", path: "/workspaces", icon: Layers },
      { title: "Create Workspace", path: "/workspaces/create", icon: Plus },
      { title: "Shared Workspaces", path: "/workspaces/shared", icon: Users },
    ],
  },
  {
    title: "Research",
    icon: Microscope,
    items: [
      {
        title: "PDF Text Extraction",
        path: "/research/pdf-extraction",
        icon: FileText,
      },
      { title: "Text Editor", path: "/research/editor", icon: FileText },
      { title: "Citations", path: "/research/citations", icon: Quote },
      {
        title: "Annotations",
        path: "/research/annotations",
        icon: Highlighter,
      },
    ],
  },
  {
    title: "AI Insights",
    path: "/ai-insights",
    icon: Brain,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Billing",
    path: "/billing",
    icon: CreditCard,
  },
];

// Admin-only features
const adminFeatures: SidebarItem[] = [
  {
    title: "Admin Overview",
    path: "/admin-overview",
    icon: Shield,
    minRole: "admin",
  },
  {
    title: "User Management",
    path: "/users",
    icon: Users,
    minRole: "admin",
  },
  {
    title: "Subscriptions",
    path: "/subscriptions",
    icon: CreditCard,
    minRole: "admin",
  },
  {
    title: "System Settings",
    path: "/settings",
    icon: Settings,
    minRole: "admin",
  },
];

// Collapsible section component
function CollapsibleSection({
  item,
  isActive,
  currentPath,
  onNavigate,
}: {
  item: SidebarItem;
  isActive: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
        }`}
      >
        <item.icon className="mr-2 h-4 w-4" />
        <span>{item.title}</span>
        {isOpen ? (
          <ChevronDown className="ml-auto h-4 w-4" />
        ) : (
          <ChevronRight className="ml-auto h-4 w-4" />
        )}
      </Button>
      {isOpen && item.items && (
        <div className="pl-6 space-y-1 mt-1">
          {item.items.map((subItem) => {
            const isSubActive = currentPath?.startsWith(subItem.path);
            return (
              <Button
                key={subItem.title}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.(subItem.path)}
                className={`w-full justify-start px-2 py-1 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                  isSubActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : ""
                }`}
              >
                <subItem.icon className="mr-2 h-3 w-3" />
                <span className="text-sm">{subItem.title}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Workspace Switcher placeholder
function WorkspaceSwitcher({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-10 px-3 bg-sidebar border-sidebar-border hover:bg-sidebar-accent"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
            <Layers className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm truncate">Personal Workspace</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm rounded hover:bg-muted flex items-center gap-2"
            >
              <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                <Layers className="h-3 w-3 text-primary" />
              </div>
              Personal Workspace
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm rounded hover:bg-muted flex items-center gap-2"
            >
              <div className="h-6 w-6 rounded bg-blue-500/20 flex items-center justify-center">
                <Users className="h-3 w-3 text-blue-500" />
              </div>
              Team Research Lab
            </button>
            <div className="border-t border-border my-2" />
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.("/workspaces/create");
              }}
              className="w-full px-3 py-2 text-left text-sm rounded hover:bg-muted flex items-center gap-2 text-primary"
            >
              <Plus className="h-4 w-4" />
              Create Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppSidebar({
  userRole,
  currentPath,
  onNavigate,
}: AppSidebarProps) {
  // Filter admin features based on role
  const visibleAdminFeatures = adminFeatures.filter((item) =>
    hasRoleAccess(userRole, item.minRole)
  );

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <button onClick={() => onNavigate?.("/")}>
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">ScholarFlow</span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                Research Hub
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        {/* Workspace Switcher */}
        <div className="mb-6">
          <WorkspaceSwitcher onNavigate={onNavigate} />
        </div>

        {/* Admin Features (if applicable) */}
        {visibleAdminFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
              Administration
            </h3>
            <nav className="space-y-1">
              {visibleAdminFeatures.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    onClick={() => item.path && onNavigate?.(item.path)}
                    className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="px-2 mb-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const sectionActive = item.items
                ? item.items.some((subItem) =>
                    currentPath?.startsWith(subItem.path)
                  )
                : currentPath === item.path ||
                  currentPath?.startsWith(`${item.path}/`);

              if (item.items?.length) {
                return (
                  <CollapsibleSection
                    key={item.title}
                    item={item}
                    isActive={sectionActive}
                    currentPath={currentPath}
                    onNavigate={onNavigate}
                  />
                );
              }

              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  onClick={() => item.path && onNavigate?.(item.path)}
                  className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    sectionActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/70 text-center">
          © {new Date().getFullYear()} ScholarFlow
        </div>
      </div>
    </div>
  );
}
