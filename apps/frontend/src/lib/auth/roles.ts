// Role-based constants and utilities for frontend
export const USER_ROLES = {
  RESEARCHER: "RESEARCHER",
  PRO_RESEARCHER: "PRO_RESEARCHER",
  TEAM_LEAD: "TEAM_LEAD",
  ADMIN: "ADMIN",
} as const;

export const ROLE_HIERARCHY = {
  RESEARCHER: 1,
  PRO_RESEARCHER: 2,
  TEAM_LEAD: 3,
  ADMIN: 4,
} as const;

export const ROLE_LABELS = {
  RESEARCHER: "Researcher",
  PRO_RESEARCHER: "Pro Researcher",
  TEAM_LEAD: "Team Lead",
  ADMIN: "Administrator",
} as const;

export const ROLE_DESCRIPTIONS = {
  RESEARCHER: "Basic research access with limited features",
  PRO_RESEARCHER: "Enhanced research tools with AI features and collaboration",
  TEAM_LEAD: "Team management capabilities with advanced collaboration tools",
  ADMIN: "Full system administration and user management access",
} as const;

export const ROLE_PERMISSIONS = {
  RESEARCHER: [
    "paper:read",
    "paper:create",
    "paper:update_own",
    "paper:delete_own",
    "collection:read",
    "collection:create",
    "collection:update_own",
    "collection:delete_own",
    "profile:read_own",
    "profile:update_own",
  ],
  PRO_RESEARCHER: [
    "paper:read",
    "paper:create",
    "paper:update_own",
    "paper:delete_own",
    "paper:ai_features",
    "collection:read",
    "collection:create",
    "collection:update_own",
    "collection:delete_own",
    "collection:share",
    "collaboration:join",
    "profile:read_own",
    "profile:update_own",
    "workspace:create",
    "workspace:join",
  ],
  TEAM_LEAD: [
    "paper:read",
    "paper:create",
    "paper:update_own",
    "paper:delete_own",
    "paper:update_team",
    "paper:delete_team",
    "paper:ai_features",
    "collection:read",
    "collection:create",
    "collection:update_own",
    "collection:delete_own",
    "collection:update_team",
    "collection:delete_team",
    "collection:share",
    "collaboration:join",
    "collaboration:manage",
    "profile:read_own",
    "profile:update_own",
    "profile:read_team",
    "workspace:create",
    "workspace:join",
    "workspace:manage",
    "user:invite",
  ],
  ADMIN: [
    "paper:read",
    "paper:create",
    "paper:update",
    "paper:delete",
    "paper:ai_features",
    "collection:read",
    "collection:create",
    "collection:update",
    "collection:delete",
    "collection:share",
    "collaboration:join",
    "collaboration:manage",
    "profile:read",
    "profile:update",
    "profile:delete",
    "workspace:create",
    "workspace:join",
    "workspace:manage",
    "workspace:delete",
    "user:read",
    "user:create",
    "user:update",
    "user:delete",
    "user:invite",
    "admin:dashboard",
    "admin:analytics",
    "admin:settings",
    "system:manage",
  ],
} as const;

export type UserRole = keyof typeof USER_ROLES;

// Role-based navigation items
export const getNavigationItems = (userRole?: string) => {
  const baseItems = [
    { label: "Dashboard", href: "/dashboard", permission: "dashboard:read" },
    { label: "Papers", href: "/papers", permission: "paper:read" },
    {
      label: "Collections",
      href: "/collections",
      permission: "collection:read",
    },
  ];

  const proItems = [
    { label: "Workspaces", href: "/workspaces", permission: "workspace:read" },
    {
      label: "Collaboration",
      href: "/collaborate",
      permission: "collaboration:join",
    },
  ];

  const teamLeadItems = [
    { label: "Team", href: "/team", permission: "user:read_team" },
    { label: "Analytics", href: "/analytics", permission: "analytics:read" },
  ];

  const adminItems = [
    { label: "Admin", href: "/admin", permission: "admin:dashboard" },
    { label: "Users", href: "/admin/users", permission: "user:read" },
    {
      label: "Settings",
      href: "/admin/settings",
      permission: "admin:settings",
    },
  ];

  let items = [...baseItems];

  if (hasRoleAccess(userRole, USER_ROLES.PRO_RESEARCHER)) {
    items = [...items, ...proItems];
  }

  if (hasRoleAccess(userRole, USER_ROLES.TEAM_LEAD)) {
    items = [...items, ...teamLeadItems];
  }

  if (hasRoleAccess(userRole, USER_ROLES.ADMIN)) {
    items = [...items, ...adminItems];
  }

  return items;
};

// Utility functions
export const hasPermission = (
  userRole: string,
  permission: string
): boolean => {
  const rolePermissions =
    ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  return rolePermissions?.includes(permission as any) || false;
};

export const hasRoleAccess = (
  userRole?: string,
  requiredRole?: string
): boolean => {
  if (!userRole || !requiredRole) return false;
  const userLevel =
    ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel =
    ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userLevel >= requiredLevel;
};

export const canAccessRoute = (
  userRole: string,
  routePermission: string
): boolean => {
  return hasPermission(userRole, routePermission);
};

export const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "destructive";
    case USER_ROLES.TEAM_LEAD:
      return "default";
    case USER_ROLES.PRO_RESEARCHER:
      return "secondary";
    case USER_ROLES.RESEARCHER:
    default:
      return "outline";
  }
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "text-red-600 bg-red-50 border-red-200";
    case USER_ROLES.TEAM_LEAD:
      return "text-blue-600 bg-blue-50 border-blue-200";
    case USER_ROLES.PRO_RESEARCHER:
      return "text-green-600 bg-green-50 border-green-200";
    case USER_ROLES.RESEARCHER:
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};
