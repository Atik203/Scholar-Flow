"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import { USER_ROLES } from "@/lib/auth/roles";
import {
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  ChevronRight,
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
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation items for different user roles
const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
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
        url: "/dashboard/papers",
        icon: FileText,
      },
      {
        title: "Upload Paper",
        url: "/dashboard/papers/upload",
        icon: Upload,
      },
      {
        title: "Search Papers",
        url: "/dashboard/papers/search",
        icon: Search,
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
        url: "/dashboard/collections",
        icon: BookOpen,
      },
      {
        title: "Create Collection",
        url: "/dashboard/collections/create",
        icon: Plus,
      },
      {
        title: "Shared Collections",
        url: "/dashboard/collections/shared",
        icon: Users,
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
        url: "/dashboard/workspaces",
        icon: Layers,
      },
      {
        title: "Create Workspace",
        url: "/dashboard/workspaces/create",
        icon: Plus,
      },
      {
        title: "Shared Workspaces",
        url: "/dashboard/workspaces/shared",
        icon: Users,
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
        url: "/dashboard/research/pdf-extraction",
        icon: TextCursor,
      },
      {
        title: "Text Editor",
        url: "/dashboard/research/editor",
        icon: FileText,
      },
      {
        title: "Citations",
        url: "/dashboard/research/citations",
        icon: Quote,
      },
      {
        title: "Annotations",
        url: "/dashboard/research/annotations",
        icon: Highlighter,
      },
      {
        title: "Research Notes",
        url: "/dashboard/research/notes",
        icon: MessageSquare,
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
        url: "/dashboard/collaborations/teams",
        icon: Users,
      },
      {
        title: "Active Projects",
        url: "/dashboard/collaborations/projects",
        icon: Building2,
      },
      {
        title: "Shared Projects",
        url: "/dashboard/collaborations/projects/shared",
        icon: Building2,
      },
      {
        title: "Invitations",
        url: "/dashboard/collaborations/invitations",
        icon: Star,
      },
    ],
  },
  {
    title: "AI Insights",
    url: "/dashboard/ai-insights",
    icon: Brain,
    badge: "New",
    minRole: USER_ROLES.RESEARCHER,
  },
];

// Pro/Advanced features
const proFeatures = [
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
    minRole: USER_ROLES.PRO_RESEARCHER,
  },
  {
    title: "Advanced Search",
    url: "/dashboard/search/advanced",
    icon: Zap,
    badge: "Pro",
    minRole: USER_ROLES.PRO_RESEARCHER,
  },
  {
    title: "Research Trends",
    url: "/dashboard/trends",
    icon: TrendingUp,
    minRole: USER_ROLES.PRO_RESEARCHER,
  },
];

// Admin features
const adminFeatures = [
  {
    title: "Admin Panel",
    url: "/dashboard/admin",
    icon: Shield,
    minRole: USER_ROLES.ADMIN,
  },
  {
    title: "User Management",
    url: "/dashboard/admin/users",
    icon: Users,
    minRole: USER_ROLES.ADMIN,
  },
  {
    title: "System Settings",
    url: "/dashboard/admin/settings",
    icon: Settings,
    minRole: USER_ROLES.ADMIN,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const user = session?.user;
  const userRole = user?.role || USER_ROLES.RESEARCHER;

  // Helper function to check if user has required role
  const hasRole = (minRole: string) => {
    const roleHierarchy = [
      USER_ROLES.RESEARCHER,
      USER_ROLES.PRO_RESEARCHER,
      USER_ROLES.TEAM_LEAD,
      USER_ROLES.ADMIN,
    ];
    const userRoleIndex = roleHierarchy.indexOf(userRole as any);
    const minRoleIndex = roleHierarchy.indexOf(minRole as any);
    return userRoleIndex >= minRoleIndex;
  };

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter((item) =>
    hasRole(item.minRole)
  );
  const filteredProFeatures = proFeatures.filter((item) =>
    hasRole(item.minRole)
  );
  const filteredAdminFeatures = adminFeatures.filter((item) =>
    hasRole(item.minRole)
  );

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

        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="px-2 mb-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
            Navigation
          </h3>
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.url;

              if (item.items) {
                return (
                  <Collapsible key={item.title} defaultOpen>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-1">
                      {item.items.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant="ghost"
                          size="sm"
                          asChild
                          className={`w-full justify-start px-2 py-1 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                            pathname === subItem.url
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : ""
                          }`}
                        >
                          <Link href={subItem.url}>
                            <subItem.icon className="mr-2 h-3 w-3" />
                            <span className="text-sm">{subItem.title}</span>
                          </Link>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

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
                  <Link href={item.url}>
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

        {/* Pro Features */}
        {filteredProFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
              Pro Features
            </h3>
            <nav className="space-y-1">
              {filteredProFeatures.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  asChild
                  className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname === item.url
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  <Link href={item.url}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-chart-1 px-2 py-0.5 text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        )}

        {/* Admin Features */}
        {filteredAdminFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
              Administration
            </h3>
            <nav className="space-y-1">
              {filteredAdminFeatures.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  asChild
                  className={`w-full justify-start px-2 py-2 h-auto font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname === item.url
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  <Link href={item.url}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        )}
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
