"use client";

import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ScrollArea Component
interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal" | "both";
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = "vertical", ...props }, ref) => {
    const [showScrollbar, setShowScrollbar] = React.useState(false);
    const viewportRef = React.useRef<HTMLDivElement>(null);

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={() => setShowScrollbar(true)}
        onMouseLeave={() => setShowScrollbar(false)}
        {...props}
      >
        <div
          ref={viewportRef}
          className={cn(
            "h-full w-full rounded-[inherit]",
            orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
            orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
            orientation === "both" && "overflow-auto"
          )}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: showScrollbar
              ? "hsl(var(--border)) transparent"
              : "transparent transparent",
          }}
        >
          {children}
        </div>

        {/* Custom scrollbar overlay */}
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          .scroll-area-viewport::-webkit-scrollbar-track {
            background: transparent;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb {
            background: hsl(var(--border));
            border-radius: 9999px;
            border: 3px solid transparent;
            background-clip: content-box;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--muted-foreground));
            border: 3px solid transparent;
            background-clip: content-box;
          }
        `}</style>
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

// ScrollBar Component (for compatibility)
interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex touch-none select-none transition-colors",
          orientation === "vertical" &&
            "h-full w-2.5 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-2.5 flex-col border-t border-t-transparent p-[1px]",
          className
        )}
        {...props}
      >
        <div className="relative flex-1 rounded-full bg-border" />
      </div>
    );
  }
);
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
