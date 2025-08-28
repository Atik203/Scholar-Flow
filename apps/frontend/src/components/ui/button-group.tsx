import { cn } from "@/lib/utils";
import * as React from "react";

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default" | "lg";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      orientation = "horizontal",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "gap-1",
      default: "gap-2",
      lg: "gap-3",
    };

    const orientationClasses = {
      horizontal: "flex-row",
      vertical: "flex-col",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientationClasses[orientation],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            // Add rounded corners only to first and last buttons
            const isFirst = index === 0;
            const isLast = index === React.Children.count(children) - 1;

            let roundedClasses = "";
            if (orientation === "horizontal") {
              roundedClasses = cn(
                isFirst && "rounded-r-none",
                !isFirst && !isLast && "rounded-none",
                isLast && "rounded-l-none"
              );
            } else {
              roundedClasses = cn(
                isFirst && "rounded-b-none",
                !isFirst && !isLast && "rounded-none",
                isLast && "rounded-t-none"
              );
            }

            return React.cloneElement(child, {
              className: cn(
                (child.props as any)?.className || "",
                roundedClasses
              ),
            } as any);
          }
          return child;
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
