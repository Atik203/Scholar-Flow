"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  BookOpen,
  Brain,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Highlighter,
  Home,
  Layers,
  MessageSquare,
  Microscope,
  Plus,
  Quote,
  Search,
  Settings,
  Shield,
  Star,
  TextCursor,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

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

const navigationItems: SidebarItem[] = [
  {
    title: "Dashboard",
    path: "",
    icon: Home,
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Papers",
    icon: FileText,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      {
        title: "All Papers",
        path: "/papers",
        icon: FileText,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Upload Paper",
        path: "/papers/upload",
        icon: Upload,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Search Papers",
        path: "/papers/search",
        icon: Search,
        minRole: USER_ROLES.RESEARCHER,
      },
    ],
  },
  {
    title: "Collections",
    icon: BookOpen,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      {
        title: "My Collections",
        path: "/collections",
        icon: BookOpen,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Create Collection",
        path: "/collections/create",
        icon: Plus,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Shared Collections",
        path: "/collections/shared",
        icon: Users,
        minRole: USER_ROLES.RESEARCHER,
      },
    ],
  },
  {
    title: "Workspaces",
    icon: Layers,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      {
        title: "My Workspaces",
        path: "/workspaces",
        icon: Layers,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Create Workspace",
        path: "/workspaces/create",
        icon: Plus,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Shared Workspaces",
        path: "/workspaces/shared",
        icon: Users,
        minRole: USER_ROLES.RESEARCHER,
      },
    ],
  },
  {
    title: "Research",
    icon: Microscope,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      {
        title: "PDF Text Extraction",
        path: "/research/pdf-extraction",
        icon: TextCursor,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Text Editor",
        path: "/research/editor",
        icon: FileText,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Citations",
        path: "/research/citations",
        icon: Quote,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Annotations",
        path: "/research/annotations",
        icon: Highlighter,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Research Notes",
        path: "/research/notes",
        icon: MessageSquare,
        minRole: USER_ROLES.RESEARCHER,
      },
    ],
  },
  {
    title: "Collaborations",
    icon: Users,
    minRole: USER_ROLES.RESEARCHER,
    items: [
      {
        title: "My Teams",
        path: "/collaborations/teams",
        icon: Users,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Active Projects",
        path: "/collaborations/projects",
        icon: Building2,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Shared Projects",
        path: "/collaborations/projects/shared",
        icon: Building2,
        minRole: USER_ROLES.RESEARCHER,
      },
      {
        title: "Invitations",
        path: "/collaborations/invitations",
        icon: Star,
        minRole: USER_ROLES.RESEARCHER,
      },
    ],
  },
  {
    title: "AI Insights",
    path: "/ai-insights",
    icon: Brain,
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Billing",
    path: "/billing",
    icon: CreditCard,
    minRole: USER_ROLES.RESEARCHER,
  },
];

const adminFeatures: SidebarLink[] = [
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
    title: "System Settings",
    path: "/settings",
    icon: Settings,
    minRole: USER_ROLES.ADMIN,
  },
];

export function AppSidebar() {
  const { session } = useAuth();
  const pathname = usePathname();

  const user = session?.user;
  const userRole = user?.role || USER_ROLES.RESEARCHER;

  const resolvedNavigationItems = useMemo<ResolvedSidebarItem[]>(() => {
    return navigationItems
      .filter((item) => hasRoleAccess(userRole, item.minRole))
      .map<ResolvedSidebarItem>((item) => {
        const { path = "", items: rawItems, ...rest } = item;
        // Special case for billing - use direct path instead of role-scoped
        const href =
          item.title === "Billing"
            ? "/dashboard/billing"
            : buildRoleScopedPath(userRole, path);
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

  const resolvedAdminFeatures = useMemo<ResolvedSidebarLink[]>(() => {
    if (!hasRoleAccess(userRole, USER_ROLES.ADMIN)) {
      return [];
    }

    return adminFeatures.map((item) => ({
      ...item,
      href: buildRoleScopedPath(userRole, item.path),
    }));
  }, [userRole]);

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/">
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
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2 sidebar-scroll">
        {/* Workspace Switcher */}
        <div className="mb-6">
          <WorkspaceSwitcher />
        </div>

        {/* Admin Features */}
        {resolvedAdminFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
              Administration
            </h3>
            <nav className="space-y-1">
              {resolvedAdminFeatures.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    asChild
                    className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
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
            {resolvedNavigationItems.map((item) => {
              const sectionActive = item.items
                ? item.items.some((subItem) =>
                    pathname.startsWith(subItem.href)
                  )
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

              if (item.items?.length) {
                return (
                  <Collapsible key={item.title} defaultOpen={sectionActive}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                          sectionActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-1">
                      {item.items.map((subItem) => {
                        const isActive = pathname.startsWith(subItem.href);

                        return (
                          <Button
                            key={subItem.title}
                            variant="ghost"
                            size="sm"
                            asChild
                            className={`w-full justify-start px-2 py-1 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : ""
                            }`}
                          >
                            <Link href={subItem.href}>
                              <subItem.icon className="mr-2 h-3 w-3" />
                              <span className="text-sm">{subItem.title}</span>
                            </Link>
                          </Button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  asChild
                  className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
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
