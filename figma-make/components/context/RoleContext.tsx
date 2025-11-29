"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Role types
export type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

// Role display names
export const roleDisplayNames: Record<UserRole, string> = {
  researcher: "Researcher",
  pro_researcher: "Pro Researcher",
  team_lead: "Team Lead",
  admin: "Administrator",
};

// Context interface
interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isTeamLead: boolean;
  isPro: boolean;
  canManageTeam: boolean;
  canAccessAdmin: boolean;
  displayName: string;
}

// Create context with default value
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Provider component - supports controlled mode via `role` prop
export function RoleProvider({
  children,
  role: controlledRole,
  initialRole = "researcher",
  onRoleChange,
}: {
  children: ReactNode;
  role?: UserRole; // Controlled role from parent
  initialRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}) {
  // Use internal state only if not controlled
  const [internalRole, setInternalRole] = useState<UserRole>(initialRole);

  // Determine actual role - prefer controlled prop
  const role = controlledRole ?? internalRole;

  // Sync internal state when controlled role changes
  useEffect(() => {
    if (controlledRole !== undefined) {
      setInternalRole(controlledRole);
    }
  }, [controlledRole]);

  // setRole updates both internal state and calls parent callback
  const setRole = (newRole: UserRole) => {
    setInternalRole(newRole);
    onRoleChange?.(newRole);
  };

  // Computed values
  const isAdmin = role === "admin";
  const isTeamLead = role === "team_lead";
  const isPro = role === "pro_researcher" || isTeamLead || isAdmin;
  const canManageTeam = isTeamLead || isAdmin;
  const canAccessAdmin = isAdmin;
  const displayName = roleDisplayNames[role];

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isAdmin,
        isTeamLead,
        isPro,
        canManageTeam,
        canAccessAdmin,
        displayName,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

// Hook to use role context
export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (context === undefined) {
    // Return default values if not in provider (for backwards compatibility)
    return {
      role: "researcher",
      setRole: () => {},
      isAdmin: false,
      isTeamLead: false,
      isPro: false,
      canManageTeam: false,
      canAccessAdmin: false,
      displayName: "Researcher",
    };
  }
  return context;
}

// Hook to get user object with current role
export function useUserWithRole(
  defaultUser: {
    name: string;
    email: string;
    image?: string;
    role: UserRole;
  },
  overrideRole?: UserRole
) {
  const { role: contextRole } = useRole();
  const effectiveRole = overrideRole ?? contextRole;

  return {
    ...defaultUser,
    role: effectiveRole,
  };
}

// Export for direct imports
export { RoleContext };
