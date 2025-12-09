/**
 * Avatar Component
 * Matches frontend/src/components/ui/avatar.tsx
 */

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = fallback || alt?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-muted-foreground">{initials}</span>
      )}
    </div>
  );
}

export function AvatarImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt || "Avatar"}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

export function AvatarFallback({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`font-medium text-muted-foreground ${className}`}>
      {children}
    </span>
  );
}
