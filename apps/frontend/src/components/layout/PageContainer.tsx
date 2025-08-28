import { cn } from "@/lib/utils";
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  as: Component = "div",
}) => {
  const ComponentElement = Component as React.ElementType;
  return (
    <ComponentElement
      className={cn("mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8", className)}
    >
      {children}
    </ComponentElement>
  );
};

// Section component for consistent spacing
export const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}> = ({ children, className = "", as: Component = "section" }) => {
  const ComponentElement = Component as React.ElementType;
  return (
    <ComponentElement className={cn("py-16 md:py-24 lg:py-32", className)}>
      {children}
    </ComponentElement>
  );
};

// Container variants for different use cases
export const Container = {
  Page: PageContainer,
  Section: Section,
  Small: ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={cn("mx-auto max-w-4xl px-3 sm:px-5 lg:px-8", className)}>
      {children}
    </div>
  ),
  Large: ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={cn("mx-auto max-w-7xl px-3 sm:px-5 lg:px-8", className)}>
      {children}
    </div>
  ),
};
