import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default" | "lg";
  attached?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      orientation = "horizontal",
      size = "default",
      attached = false,
      children,
      ...props
    },
    ref
  ) => {
    const gapClasses = {
      sm: attached ? "gap-0" : "gap-1",
      default: attached ? "gap-0" : "gap-2",
      lg: attached ? "gap-0" : "gap-3",
    };

    const orientationClasses = {
      horizontal: "flex-row",
      vertical: "flex-col",
    };

    // Modify children to have proper border radius when attached
    const modifiedChildren = attached
      ? React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const isFirst = index === 0;
            const isLast = index === React.Children.count(children) - 1;

            let roundedClasses = "";
            if (orientation === "horizontal") {
              if (isFirst && isLast) {
                roundedClasses = "";
              } else if (isFirst) {
                roundedClasses = "rounded-r-none";
              } else if (isLast) {
                roundedClasses = "rounded-l-none border-l-0";
              } else {
                roundedClasses = "rounded-none border-l-0";
              }
            } else {
              if (isFirst && isLast) {
                roundedClasses = "";
              } else if (isFirst) {
                roundedClasses = "rounded-b-none";
              } else if (isLast) {
                roundedClasses = "rounded-t-none border-t-0";
              } else {
                roundedClasses = "rounded-none border-t-0";
              }
            }

            return React.cloneElement(child, {
              className: cn(
                (child.props as any)?.className || "",
                roundedClasses
              ),
            } as any);
          }
          return child;
        })
      : children;

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex",
          orientationClasses[orientation],
          gapClasses[size],
          className
        )}
        {...props}
      >
        {modifiedChildren}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
