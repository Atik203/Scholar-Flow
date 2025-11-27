import { cardVariants, type CardVariants } from "../card-variants";

/**
 * ProfileCard - Card component for displaying user profiles
 * Matches frontend/src/components/ui/cards/ProfileCard.tsx
 */

export interface ProfileCardProps extends CardVariants {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  linkedin?: string;
  twitter?: string;
  className?: string;
}

export function ProfileCard({
  className,
  name,
  role,
  bio,
  avatar,
  linkedin,
  twitter,
  variant = "default",
  padding = "lg",
  hover = "lift",
  size = "full",
}: ProfileCardProps) {
  return (
    <div
      className={`${cardVariants({ variant, padding, hover, size })} text-center ${className || ""}`}
    >
      {/* Avatar */}
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-24 w-24 rounded-full object-cover mx-auto mb-4"
        />
      ) : (
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-primary font-bold text-3xl">
            {name.charAt(0)}
          </span>
        </div>
      )}

      {/* Name and Role */}
      <h3 className="font-semibold text-xl text-foreground">{name}</h3>
      <p className="text-primary font-medium text-sm mb-3">{role}</p>

      {/* Bio */}
      {bio && (
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {bio}
        </p>
      )}

      {/* Social Links */}
      {(linkedin || twitter) && (
        <div className="flex justify-center gap-3">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
