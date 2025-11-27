"use client";

/**
 * PageContainer and Layout Components
 * Matches frontend/src/components/layout/PageContainer.tsx
 */

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "main" | "section" | "article";
}

export function PageContainer({
  children,
  className = "",
  as: Component = "div",
}: PageContainerProps) {
  return (
    <Component
      className={`mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8 ${className}`}
    >
      {children}
    </Component>
  );
}

// Section component for consistent spacing
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function Section({
  children,
  className = "",
  as: Component = "section",
}: SectionProps) {
  return (
    <Component className={`py-16 md:py-24 lg:py-32 ${className}`}>
      {children}
    </Component>
  );
}

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
    <div className={`mx-auto max-w-4xl px-3 sm:px-5 lg:px-8 ${className}`}>
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
    <div className={`mx-auto max-w-7xl px-3 sm:px-5 lg:px-8 ${className}`}>
      {children}
    </div>
  ),
};
