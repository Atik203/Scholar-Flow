/**
 * Textarea Component
 * Matches frontend/src/components/ui/textarea.tsx
 */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({
  className = "",
  error = false,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        error
          ? "border-destructive focus-visible:ring-destructive"
          : "border-input"
      } ${className}`}
      {...props}
    />
  );
}
