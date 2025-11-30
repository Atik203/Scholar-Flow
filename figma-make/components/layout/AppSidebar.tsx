"use client";
import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Compass,
  CreditCard,
  Download,
  FileText,
  Globe,
  HelpCircle,
  Highlighter,
  History,
  Home,
  Key,
  Layers,
  Lock,
  Map,
  MessageSquare,
  Microscope,
  Network,
  Plus,
  Quote,
  Search,
  Settings,
  Shield,
  Upload,
  UserCheck,
  Users,
  Webhook,
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

interface SubItem {
  title: string;
  path: string;
  icon: React.ElementType;
  minRole?: UserRole;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  items?: SubItem[];
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

// Primary navigation items (multi-item menus) - Core features with submenus
const getPrimaryNavigationItems = (userRole: UserRole): SidebarItem[] =>
  [
    {
      title: "Papers",
      icon: FileText,
      items: [
        { title: "All Papers", path: "/papers", icon: FileText },
        { title: "Upload Paper", path: "/papers/upload", icon: Upload },
        { title: "Search Papers", path: "/papers/search", icon: Search },
        { title: "Import Papers", path: "/papers/import", icon: Download },
      ],
    },
    {
      title: "Collections",
      icon: BookOpen,
      items: [
        { title: "My Collections", path: "/collections", icon: BookOpen },
        { title: "Create Collection", path: "/collections/create", icon: Plus },
        {
          title: "Shared Collections",
          path: "/collections/shared",
          icon: Users,
        },
      ],
    },
    {
      title: "Workspaces",
      icon: Layers,
      items: [
        { title: "My Workspaces", path: "/workspaces", icon: Layers },
        { title: "Create Workspace", path: "/workspaces/create", icon: Plus },
        {
          title: "Browse Templates",
          path: "/workspaces/templates",
          icon: Globe,
        },
      ],
    },
    {
      title: "Research",
      icon: Microscope,
      items: [
        { title: "Research Hub", path: "/research", icon: Microscope },
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
        {
          title: "Citation Graph",
          path: "/research/citation-graph",
          icon: Network,
          minRole: "pro_researcher" as UserRole,
        },
        {
          title: "Research Map",
          path: "/research/map",
          icon: Map,
          minRole: "pro_researcher" as UserRole,
        },
        { title: "Research Notes", path: "/research-notes", icon: FileText },
      ],
    },
    {
      title: "Discover",
      icon: Compass,
      items: [
        { title: "Explore", path: "/discover", icon: Compass },
        { title: "Trending", path: "/discover/trending", icon: BarChart3 },
        {
          title: "Recommendations",
          path: "/discover/recommendations",
          icon: Brain,
        },
      ],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      items: [
        { title: "Overview", path: "/analytics", icon: BarChart3 },
        {
          title: "Personal Analytics",
          path: "/analytics/personal",
          icon: BarChart3,
        },
        {
          title: "Workspace Analytics",
          path: "/analytics/workspace",
          icon: BarChart3,
          minRole: "team_lead" as UserRole,
        },
        {
          title: "Usage Reports",
          path: "/analytics/usage",
          icon: BarChart3,
          minRole: "pro_researcher" as UserRole,
        },
        {
          title: "Export Analytics",
          path: "/analytics/export",
          icon: Download,
          minRole: "pro_researcher" as UserRole,
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { title: "Notifications", path: "/notifications", icon: Bell },
        {
          title: "Notification Center",
          path: "/notifications/center",
          icon: Bell,
        },
        {
          title: "Notification History",
          path: "/notifications/history",
          icon: History,
        },
        { title: "Settings", path: "/notifications/settings", icon: Settings },
      ],
    },
    {
      title: "Team",
      icon: Users,
      minRole: "team_lead" as UserRole,
      items: [
        { title: "Team Members", path: "/team", icon: Users },
        { title: "Invitations", path: "/team/invitations", icon: UserCheck },
        { title: "Team Activity", path: "/team/activity", icon: History },
        { title: "Team Settings", path: "/team/settings", icon: Settings },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { title: "Security Dashboard", path: "/security", icon: Shield },
        { title: "Two-Factor Auth", path: "/security/2fa", icon: Lock },
        { title: "Active Sessions", path: "/security/sessions", icon: Globe },
        { title: "Privacy Settings", path: "/privacy", icon: Lock },
      ],
    },
    {
      title: "Activity",
      icon: History,
      items: [
        { title: "Activity Log", path: "/activity-log", icon: History },
        { title: "Recent Activity", path: "/recent-activity", icon: History },
        { title: "Discussions", path: "/discussions", icon: MessageSquare },
        { title: "Search History", path: "/search/history", icon: Search },
      ],
    },
    {
      title: "Help & Settings",
      icon: Settings,
      items: [
        { title: "General Settings", path: "/settings", icon: Settings },
        { title: "Export Data", path: "/settings/export", icon: Download },
        { title: "Help Center", path: "/help", icon: HelpCircle },
        {
          title: "Keyboard Shortcuts",
          path: "/help/shortcuts",
          icon: HelpCircle,
        },
      ],
    },
  ].filter((item) => hasRoleAccess(userRole, item.minRole));

// Quick access items (single-item menus) - shown at the top
const getQuickAccessItems = (userRole: UserRole): SidebarItem[] =>
  [
    {
      title: "Dashboard",
      path: userRole === "admin" ? "/dashboard/admin" : "/dashboard",
      icon: Home,
    },
    {
      title: "Global Search",
      path: "/search",
      icon: Globe,
      badge: "AI",
    },
    {
      title: "AI Insights",
      path: "/ai-insights",
      icon: Brain,
    },
    {
      title: "Billing",
      path: "/billing",
      icon: CreditCard,
    },
  ].filter((item) => hasRoleAccess(userRole, item.minRole));

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
    path: "/admin/users",
    icon: Users,
    minRole: "admin",
  },
  {
    title: "Subscriptions",
    path: "/admin/subscriptions",
    icon: CreditCard,
    minRole: "admin",
  },
  {
    title: "Plans",
    path: "/admin/plans",
    icon: CreditCard,
    minRole: "admin",
  },
  {
    title: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
    minRole: "admin",
  },
  {
    title: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
    minRole: "admin",
  },
  {
    title: "Audit Log",
    path: "/admin/audit",
    icon: History,
    minRole: "admin",
  },
  {
    title: "Webhooks",
    path: "/admin/webhooks",
    icon: Webhook,
    minRole: "admin",
  },
  {
    title: "API Keys",
    path: "/admin/api-keys",
    icon: Key,
    minRole: "admin",
  },
  {
    title: "Content Moderation",
    path: "/admin/moderation",
    icon: Shield,
    minRole: "admin",
  },
  {
    title: "System Settings",
    path: "/admin/settings",
    icon: Settings,
    minRole: "admin",
  },
];

// Collapsible section component with role filtering for sub-items
function CollapsibleSection({
  item,
  isActive,
  currentPath,
  onNavigate,
  userRole,
}: {
  item: SidebarItem;
  isActive: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  userRole: UserRole;
}) {
  const [isOpen, setIsOpen] = useState(isActive);

  // Filter sub-items based on role access
  const visibleSubItems = item.items?.filter((subItem) =>
    hasRoleAccess(userRole, subItem.minRole)
  );

  // Don't render if no visible sub-items
  if (!visibleSubItems || visibleSubItems.length === 0) return null;

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${
          isActive
            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
            : ""
        }`}
      >
        <item.icon className="mr-3 h-4 w-4" />
        <span className="flex-1 text-left">{item.title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 opacity-60" />
        ) : (
          <ChevronRight className="h-4 w-4 opacity-60" />
        )}
      </Button>
      {isOpen && (
        <div className="pl-7 space-y-0.5 mt-1 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
          {visibleSubItems.map((subItem) => {
            const isSubActive = currentPath?.startsWith(subItem.path);
            return (
              <Button
                key={subItem.title}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.(subItem.path)}
                className={`w-full justify-start px-3 py-1.5 h-auto font-normal text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${
                  isSubActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    : ""
                }`}
              >
                <subItem.icon className="mr-2.5 h-3.5 w-3.5" />
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
        className="w-full justify-between h-10 px-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
            <Layers className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm truncate">Personal Workspace</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform text-gray-500 dark:text-gray-400 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
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
              className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <div className="h-6 w-6 rounded bg-blue-500/20 flex items-center justify-center">
                <Users className="h-3 w-3 text-blue-500" />
              </div>
              Team Research Lab
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.("/workspaces/create");
              }}
              className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-primary"
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => onNavigate?.("/")}>
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-gray-900 dark:text-white">
                ScholarFlow
              </span>
              <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                Research Hub
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Content - Hide scrollbar but keep scroll functionality */}
      <div
        className="flex-1 overflow-auto p-3 sidebar-scroll"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <style>{`
          .sidebar-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Workspace Switcher */}
        <div className="mb-4">
          <WorkspaceSwitcher onNavigate={onNavigate} />
        </div>

        {/* Admin Features (if applicable) */}
        {visibleAdminFeatures.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Administration
            </h3>
            <nav className="space-y-0.5">
              {visibleAdminFeatures.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    onClick={() => item.path && onNavigate?.(item.path)}
                    className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                        : ""
                    }`}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span>{item.title}</span>
                  </Button>
                );
              })}
            </nav>
            <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
          </div>
        )}

        {/* Quick Access - Single item menus at top */}
        <div className="mb-4">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Access
          </h3>
          <nav className="space-y-0.5">
            {getQuickAccessItems(userRole).map((item) => {
              const isActive =
                currentPath === item.path ||
                (currentPath?.startsWith(`${item.path}/`) ?? false);
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  onClick={() => item.path && onNavigate?.(item.path)}
                  className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : ""
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
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

        {/* Separator */}
        <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

        {/* Main Navigation - Multi-item menus */}
        <div className="mb-4">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Features
          </h3>
          <nav className="space-y-0.5">
            {getPrimaryNavigationItems(userRole).map((item) => {
              // Filter sub-items for role access
              const visibleSubItems = item.items?.filter((subItem) =>
                hasRoleAccess(userRole, subItem.minRole)
              );

              const sectionActive = visibleSubItems
                ? visibleSubItems.some((subItem) =>
                    currentPath?.startsWith(subItem.path)
                  )
                : currentPath === item.path ||
                  (currentPath?.startsWith(`${item.path}/`) ?? false);

              if (visibleSubItems && visibleSubItems.length > 0) {
                return (
                  <CollapsibleSection
                    key={item.title}
                    item={{ ...item, items: visibleSubItems }}
                    isActive={sectionActive ?? false}
                    currentPath={currentPath}
                    onNavigate={onNavigate}
                    userRole={userRole}
                  />
                );
              }

              // Single item without sub-items
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  onClick={() => item.path && onNavigate?.(item.path)}
                  className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${
                    sectionActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : ""
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} ScholarFlow
        </div>
      </div>
    </div>
  );
}
