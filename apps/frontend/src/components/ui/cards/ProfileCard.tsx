import { cn } from "@/lib/utils";
import { Globe, Mail, MapPin } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Badge } from "../badge";
import { Button } from "../button";
import { cardVariants, type CardVariantsProps } from "../card-variants";

export interface ProfileCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariantsProps {
  user: {
    name: string;
    email?: string;
    role?: string;
    company?: string;
    location?: string;
    website?: string;
    avatar?: string;
    bio?: string;
    tags?: string[];
  };
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      variant?:
        | "default"
        | "outline"
        | "secondary"
        | "destructive"
        | "ghost"
        | "link";
      loading?: boolean;
    };
    secondary?: {
      label: string;
      onClick: () => void;
      variant?:
        | "default"
        | "outline"
        | "secondary"
        | "destructive"
        | "ghost"
        | "link";
    };
  };
  showContactInfo?: boolean;
  showTags?: boolean;
}

export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      className,
      user,
      actions,
      showContactInfo = true,
      showTags = true,
      variant = "default",
      padding = "md",
      hover = "lift",
      size = "md",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const textSizes = {
      sm: {
        name: "text-lg",
        role: "text-sm",
        bio: "text-sm",
        contact: "text-xs",
      },
      md: {
        name: "text-xl",
        role: "text-base",
        bio: "text-base",
        contact: "text-sm",
      },
      lg: {
        name: "text-2xl",
        role: "text-lg",
        bio: "text-lg",
        contact: "text-base",
      },
    };

    const avatarSizes = {
      sm: "h-16 w-16",
      md: "h-20 w-20",
      lg: "h-24 w-24",
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hover }),
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className={avatarSizes[size]}>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className={cn("font-bold mb-1", textSizes[size].name)}>
              {user.name}
            </h3>

            {user.role && (
              <p
                className={cn(
                  "text-muted-foreground mb-1",
                  textSizes[size].role
                )}
              >
                {user.role}
                {user.company && ` at ${user.company}`}
              </p>
            )}

            {user.bio && (
              <p className={cn("text-muted-foreground", textSizes[size].bio)}>
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        {showContactInfo && (
          <div className="space-y-2 mb-6">
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span
                  className={cn(
                    "text-muted-foreground",
                    textSizes[size].contact
                  )}
                >
                  {user.email}
                </span>
              </div>
            )}

            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span
                  className={cn(
                    "text-muted-foreground",
                    textSizes[size].contact
                  )}
                >
                  {user.location}
                </span>
              </div>
            )}

            {user.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors",
                    textSizes[size].contact
                  )}
                >
                  {user.website}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {showTags && user.tags && user.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {user.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex gap-3">
            {actions.primary && (
              <Button
                onClick={actions.primary.onClick}
                variant={actions.primary.variant || "default"}
                loading={actions.primary.loading}
                className="flex-1"
                size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
              >
                {actions.primary.label}
              </Button>
            )}

            {actions.secondary && (
              <Button
                onClick={actions.secondary.onClick}
                variant={actions.secondary.variant || "outline"}
                className="flex-1"
                size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
              >
                {actions.secondary.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";
