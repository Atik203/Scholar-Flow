import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Typography Scale System for Scholar-Flow
 * Provides consistent typography classes across the application
 */
export const typography = {
  // Heading scales with proper scroll margins and responsive sizing
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",

  // Text variants
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",

  // Code and special text
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  inlineCode:
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",

  // List styles
  ul: "my-6 ml-6 list-disc [&>li]:mt-2",
  ol: "my-6 ml-6 list-decimal [&>li]:mt-2",
  li: "leading-7",

  // Blockquote
  blockquote: "mt-6 border-l-2 pl-6 italic",

  // Table styles
  table: "w-full overflow-y-auto",
  tr: "m-0 border-t p-0 even:bg-muted",
  th: "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
  td: "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",

  // Link styles
  link: "font-medium underline underline-offset-4 hover:text-primary",

  // Emphasis
  strong: "font-semibold",
  em: "italic",

  // Utility classes
  noMargin: "m-0",
  noPadding: "p-0",
  center: "text-center",
  left: "text-left",
  right: "text-right",

  // Responsive text utilities
  responsive: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
    "7xl": "text-7xl",
    "8xl": "text-8xl",
    "9xl": "text-9xl",
  },

  // Font weight utilities
  weight: {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  },

  // Line height utilities
  leading: {
    none: "leading-none",
    tight: "leading-tight",
    snug: "leading-snug",
    normal: "leading-normal",
    relaxed: "leading-relaxed",
    loose: "leading-loose",
  },

  // Letter spacing utilities
  tracking: {
    tighter: "tracking-tighter",
    tight: "tracking-tight",
    normal: "tracking-normal",
    wide: "tracking-wide",
    wider: "tracking-wider",
    widest: "tracking-widest",
  },
} as const;

/**
 * Typography component props interface
 */
export interface TypographyProps {
  variant?: keyof typeof typography;
  className?: string;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  align?: "left" | "center" | "right";
  weight?: keyof typeof typography.weight;
  size?: keyof typeof typography.responsive;
  leading?: keyof typeof typography.leading;
  tracking?: keyof typeof typography.tracking;
}

/**
 * Typography component for consistent text styling
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  className = "",
  children,
  as: Component = "p",
  align,
  weight,
  size,
  leading: lineHeight,
  tracking,
  ...props
}) => {
  const baseClasses = typography[variant];
  const alignmentClass = align ? typography[align] : "";
  const weightClass = weight ? typography.weight[weight] : "";
  const sizeClass = size ? typography.responsive[size] : "";
  const leadingClass = lineHeight ? typography.leading[lineHeight] : "";
  const trackingClass = tracking ? typography.tracking[tracking] : "";

  const combinedClasses = cn(
    baseClasses,
    alignmentClass,
    weightClass,
    sizeClass,
    leadingClass,
    trackingClass,
    className
  );

  return React.createElement(
    Component,
    { className: combinedClasses, ...props },
    children
  );
};

/**
 * Predefined typography components for common use cases
 */
export const TypographyComponents = {
  H1: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "h1", as: "h1", ...props }),
  H2: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "h2", as: "h2", ...props }),
  H3: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "h3", as: "h3", ...props }),
  H4: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "h4", as: "h4", ...props }),
  H5: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "h5", as: "h5", ...props }),
  H6: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "h6", as: "h6", ...props }),
  P: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "p", as: "p", ...props }),
  Lead: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "lead", as: "p", ...props }),
  Large: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "large", as: "span", ...props }),
  Small: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "small", as: "span", ...props }),
  Muted: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "muted", as: "span", ...props }),
  Code: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, { variant: "code", as: "code", ...props }),
  InlineCode: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, {
      variant: "inlineCode",
      as: "code",
      ...props,
    }),
  Blockquote: (props: Omit<TypographyProps, "variant">) =>
    React.createElement(Typography, {
      variant: "blockquote",
      as: "blockquote",
      ...props,
    }),
  Link: (props: Omit<TypographyProps, "variant"> & { href: string }) => {
    const { href, ...restProps } = props;
    return React.createElement(Typography, {
      variant: "link",
      as: "a",
      ...restProps,
      ...(href && { href }),
    });
  },
};

export default typography;
