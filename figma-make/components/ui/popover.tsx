"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Popover Context
interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
);

function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a Popover");
  }
  return context;
}

// Popover Root
interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Popover({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

// Popover Trigger
interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  const { open, onOpenChange } = usePopover();

  const handleClick = () => onOpenChange(!open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props?.onClick?.(e);
        handleClick();
      },
      "aria-expanded": open,
    });
  }

  return (
    <button type="button" onClick={handleClick} aria-expanded={open}>
      {children}
    </button>
  );
}

// Popover Content
interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

function PopoverContent({
  children,
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  const { open, onOpenChange } = usePopover();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        const trigger =
          contentRef.current.parentElement?.querySelector("[aria-expanded]");
        if (trigger && trigger.contains(e.target as Node)) return;
        onOpenChange(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
    left: "right-full mr-1",
    right: "left-full ml-1",
  };

  const animationVariants = {
    top: { initial: { y: 8 }, animate: { y: 0 } },
    bottom: { initial: { y: -8 }, animate: { y: 0 } },
    left: { initial: { x: 8 }, animate: { x: 0 } },
    right: { initial: { x: -8 }, animate: { x: 0 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          initial={{
            opacity: 0,
            scale: 0.96,
            ...animationVariants[side].initial,
          }}
          animate={{ opacity: 1, scale: 1, ...animationVariants[side].animate }}
          exit={{ opacity: 0, scale: 0.96, ...animationVariants[side].initial }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
            sideClasses[side],
            side === "top" || side === "bottom" ? alignClasses[align] : "",
            className
          )}
          style={
            side === "top" || side === "bottom"
              ? {
                  marginTop: side === "bottom" ? sideOffset : undefined,
                  marginBottom: side === "top" ? sideOffset : undefined,
                }
              : {
                  marginLeft: side === "right" ? sideOffset : undefined,
                  marginRight: side === "left" ? sideOffset : undefined,
                }
          }
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
