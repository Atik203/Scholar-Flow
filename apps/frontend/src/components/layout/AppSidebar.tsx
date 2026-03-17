"use client";

import { Button } from "@/components/ui/button";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import {
  USER_ROLES,
  buildRoleScopedPath,
  hasRoleAccess,
} from "@/lib/auth/roles";
import { useAuth } from "@/redux/auth/useAuth";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Compass,
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
  Sparkles,
  TextCursor,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

type SidebarLink = {
  title: string;
  icon: LucideIcon;
  path: string;
  minRole: string;
  badge?: string;
};

type SidebarItem = {
  title: string;
  icon: LucideIcon;
  minRole: string;
  path?: string;
  badge?: string;
  items?: SidebarLink[];
};

type ResolvedSidebarLink = SidebarLink & { href: string };

type ResolvedSidebarItem = Omit<SidebarItem, "path" | "items"> & {
  href: string;
  items?: ResolvedSidebarLink[];
};

const getQuickAccessItems = (userRole: string): ResolvedSidebarItem[] => {
  return [
    {
      title: "Dashboard",
      icon: Home,
      minRole: USER_ROLES.RESEARCHER,
      href: buildRoleScopedPath(userRole, ""),
    },
    {
      title: "Global Search",
      icon: Search,
      minRole: USER_ROLES.RESEARCHER,
      href: buildRoleScopedPath(userRole, "/search"),
      badge: "AI",
    },
    {
      title: "AI Insights",
      icon: Brain,
      minRole: USER_ROLES.RESEARCHER,
      href: buildRoleScopedPath(userRole, "/ai-insights"),
    },
    {
      title: "Billing",
      icon: CreditCard,
      minRole: USER_ROLES.RESEARCHER,
      href: "/dashboard/billing", // Billing usually direct without role prefix
    },
  ].filter((item) => hasRoleAccess(userRole, item.minRole));
};

const navigationItems: SidebarItem[] = [
  {
    title: "Papers",
    icon: FileText,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      { title: "All Papers", path: "/papers", icon: FileText, minRole: USER_ROLES.RESEARCHER },
      { title: "Upload Paper", path: "/papers/upload", icon: Upload, minRole: USER_ROLES.RESEARCHER },
      { title: "Search Papers", path: "/papers/search", icon: Search, minRole: USER_ROLES.RESEARCHER },
    ],
  },
  {
    title: "Collections",
    icon: BookOpen,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      { title: "My Collections", path: "/collections", icon: BookOpen, minRole: USER_ROLES.RESEARCHER },
      { title: "Create Collection", path: "/collections/create", icon: Plus, minRole: USER_ROLES.RESEARCHER },
      { title: "Shared Collections", path: "/collections/shared", icon: Users, minRole: USER_ROLES.RESEARCHER },
    ],
  },
  {
    title: "Workspaces",
    icon: Layers,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      { title: "My Workspaces", path: "/workspaces", icon: Layers, minRole: USER_ROLES.RESEARCHER },
      { title: "Create Workspace", path: "/workspaces/create", icon: Plus, minRole: USER_ROLES.RESEARCHER },
      { title: "Shared Workspaces", path: "/workspaces/shared", icon: Users, minRole: USER_ROLES.RESEARCHER },
    ],
  },
  {
    title: "Discover",
    icon: Compass,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      { title: "Trending Papers", path: "/discover/trending", icon: TrendingUp, minRole: USER_ROLES.RESEARCHER },
      { title: "Recommendations", path: "/discover/recommendations", icon: Sparkles, minRole: USER_ROLES.RESEARCHER },
    ],
  },
  {
    title: "Research",
    icon: Microscope,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      { title: "PDF Text Extraction", path: "/research/pdf-extraction", icon: TextCursor, minRole: USER_ROLES.RESEARCHER },
      { title: "Text Editor", path: "/research/editor", icon: FileText, minRole: USER_ROLES.RESEARCHER },
      { title: "Citations", path: "/research/citations", icon: Quote, minRole: USER_ROLES.RESEARCHER },
      { title: "Annotations", path: "/research/annotations", icon: Highlighter, minRole: USER_ROLES.RESEARCHER },
    ],
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    minRole: USER_ROLES.RESEARCHER,
  },
];

const adminFeatures: SidebarItem[] = [
  {
    title: "Admin Overview",
    path: "/admin-overview",
    icon: Shield,
    minRole: USER_ROLES.ADMIN,
  },
  {
    title: "User Management",
    path: "/users",
    icon: Users,
    minRole: USER_ROLES.ADMIN,
  },
  {
    title: "Subscriptions",
    path: "/subscriptions",
    icon: CreditCard,
    minRole: USER_ROLES.ADMIN,
  },
  {
    title: "System Settings",
    path: "/settings",
    icon: Settings,
    minRole: USER_ROLES.ADMIN,
  },
];

function CollapsibleSection({
  item,
  isActive,
  pathname,
}: {
  item: ResolvedSidebarItem;
  isActive: boolean;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(isActive);

  // Auto-open if a child becomes active
  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  if (!item.items || item.items.length === 0) return null;

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${
          isActive
            ? "bg-primary/5 text-primary outline-none dark:bg-primary/10 dark:text-primary"
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
        <div className="pl-7 space-y-0.5 mt-1 border-l-2 border-gray-100 dark:border-gray-800 ml-5">
          {item.items.map((subItem) => {
            const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`);
            return (
              <Button
                key={subItem.title}
                variant="ghost"
                size="sm"
                asChild
                className={`w-full justify-start px-3 py-1.5 h-auto font-normal text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${
                  isSubActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    : ""
                }`}
              >
                <Link href={subItem.href}>
                  <subItem.icon className="mr-2.5 h-3.5 w-3.5" />
                  <span className="text-sm">{subItem.title}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AppSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { session } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;
  const userRole = user?.role || USER_ROLES.RESEARCHER;

  const resolvedNavigationItems = useMemo<ResolvedSidebarItem[]>(() => {
    return navigationItems
      .filter((item) => hasRoleAccess(userRole, item.minRole))
      .map<ResolvedSidebarItem>((item) => {
        const { path = "", items: rawItems, ...rest } = item;
        const href = buildRoleScopedPath(userRole, path);
        const resolvedItems = rawItems
          ?.filter((subItem) => hasRoleAccess(userRole, subItem.minRole))
          .map<ResolvedSidebarLink>((subItem) => {
            const { path: subPath, ...subRest } = subItem;
            return {
              ...subRest,
              path: subPath,
              href: buildRoleScopedPath(userRole, subPath),
            };
          });

        return {
          ...rest,
          href,
          items: resolvedItems,
        };
      });
  }, [userRole]);

  const resolvedAdminFeatures = useMemo(() => {
    if (!hasRoleAccess(userRole, USER_ROLES.ADMIN)) {
      return [];
    }

    return adminFeatures.map((item) => ({
      ...item,
      href: buildRoleScopedPath(userRole, item.path || ""),
    }));
  }, [userRole]);

  const quickAccessItems = useMemo(() => getQuickAccessItems(userRole), [userRole]);

  const handleLinkClick = (href: string) => {
    if (onNavigate) onNavigate();
    router.push(href);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" onClick={onNavigate}>
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Brain className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold text-gray-900 dark:text-white">
                ScholarFlow
              </span>
              <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                Research Hub
              </span>
            </div>
          </div>
        </Link>
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
          <WorkspaceSwitcher />
        </div>

        {/* Admin Features (if applicable) */}
        {resolvedAdminFeatures.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Administration
            </h3>
            <nav className="space-y-0.5">
              {resolvedAdminFeatures.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    onClick={() => handleLinkClick(item.href)}
                    className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${
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
            <div className="my-3 border-t border-gray-100 dark:border-gray-800" />
          </div>
        )}

        {/* Quick Access - Single item menus at top */}
        <div className="mb-4">
          <h3 className="px-3 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Quick Access
          </h3>
          <nav className="space-y-0.5">
            {quickAccessItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(`${item.href}/`) && item.href !== "/dashboard" && item.href !== "/dashboard/admin" && item.href !== "/dashboard/researcher"); // Prevent root matching everything
                
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  onClick={() => handleLinkClick(item.href)}
                  className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                      : ""
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </Button>
              );
            })}
          </nav>
          <div className="my-3 border-t border-gray-100 dark:border-gray-800" />
        </div>

        {/* Main Navigation - Multi-item menus */}
        <div className="mb-4">
          <h3 className="px-3 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Features
          </h3>
          <nav className="space-y-0.5">
            {resolvedNavigationItems.map((item) => {
              const sectionActive = item.items
                ? item.items.some((subItem) => pathname.startsWith(subItem.href))
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              if (item.items && item.items.length > 0) {
                return (
                  <CollapsibleSection
                    key={item.title}
                    item={item}
                    isActive={sectionActive ?? false}
                    pathname={pathname}
                  />
                );
              }

              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  onClick={() => handleLinkClick(item.href)}
                  className={`w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} ScholarFlow
        </div>
      </div>
    </div>
  );
}
