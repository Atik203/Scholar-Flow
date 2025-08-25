import { Badge } from "@/components/ui/badge";
import {
  getRoleBadgeVariant,
  getRoleColor,
  ROLE_LABELS,
  USER_ROLES,
} from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "soft";
  className?: string;
}

export function RoleBadge({
  role,
  size = "md",
  variant = "soft",
  className,
}: RoleBadgeProps) {
  const roleLabel = ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "solid":
        return getRoleBadgeVariant(role);
      case "outline":
        return (
          "border-2 bg-transparent " +
          getRoleColor(role).replace("bg-", "border-").replace("-50", "-200")
        );
      case "soft":
      default:
        return cn("border", getRoleColor(role));
    }
  };

  return (
    <Badge
      variant={variant === "solid" ? getRoleBadgeVariant(role) : "outline"}
      className={cn(
        sizeClasses[size],
        variant !== "solid" && getRoleColor(role),
        "font-medium",
        className
      )}
    >
      {roleLabel}
    </Badge>
  );
}

interface RoleIndicatorProps {
  role: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RoleIndicator({
  role,
  showLabel = true,
  size = "md",
}: RoleIndicatorProps) {
  const getIndicatorColor = () => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "bg-red-500";
      case USER_ROLES.TEAM_LEAD:
        return "bg-blue-500";
      case USER_ROLES.PRO_RESEARCHER:
        return "bg-green-500";
      case USER_ROLES.RESEARCHER:
      default:
        return "bg-gray-500";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-2 h-2";
      case "lg":
        return "w-4 h-4";
      case "md":
      default:
        return "w-3 h-3";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("rounded-full", getIndicatorColor(), getSizeClasses())}
      />
      {showLabel && (
        <span
          className={cn(
            "font-medium",
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          )}
        >
          {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
        </span>
      )}
    </div>
  );
}
