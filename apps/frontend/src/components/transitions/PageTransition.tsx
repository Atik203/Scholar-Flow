import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale" | "slideUp" | "slideDown";
  duration?: number;
  delay?: number;
  exit?: boolean;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  variant = "fade",
  duration = 0.3,
  delay = 0,
  exit = true,
}) => {
  const variants = transitionVariants[variant];

  if (exit) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          className={cn("w-full", className)}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            duration,
            delay,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={variants.initial}
      animate={variants.animate}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animations
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
}> = ({ children, className, staggerDelay = 0.1, duration = 0.5 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration,
                ease: "easeOut",
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Hover animations
export const HoverCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverEffect?: "lift" | "scale" | "glow" | "rotate";
}> = ({ children, className, hoverEffect = "lift" }) => {
  const hoverVariants = {
    lift: {
      hover: { y: -8, transition: { duration: 0.2 } },
    },
    scale: {
      hover: { scale: 1.05, transition: { duration: 0.2 } },
    },
    glow: {
      hover: {
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 },
      },
    },
    rotate: {
      hover: { rotate: 2, transition: { duration: 0.2 } },
    },
  };

  return (
    <motion.div
      className={className}
      variants={hoverVariants[hoverEffect]}
      whileHover="hover"
      initial="initial"
    >
      {children}
    </motion.div>
  );
};

// Loading states
export const LoadingSpinner: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <motion.div
      className={cn("flex items-center justify-center", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={cn(
          "animate-spin rounded-full border-4 border-primary border-t-transparent",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};
