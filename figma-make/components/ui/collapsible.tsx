"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Collapsible Context
interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const CollapsibleContext = React.createContext<
  CollapsibleContextValue | undefined
>(undefined);

function useCollapsible() {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible components must be used within a Collapsible");
  }
  return context;
}

// Collapsible Root
interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Collapsible({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  disabled = false,
  children,
  className,
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange, disabled]
  );

  return (
    <CollapsibleContext.Provider
      value={{ open, onOpenChange: handleOpenChange, disabled }}
    >
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

// Collapsible Trigger
interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  showChevron?: boolean;
}

function CollapsibleTrigger({
  children,
  className,
  asChild,
  showChevron = true,
  ...props
}: CollapsibleTriggerProps) {
  const { open, onOpenChange, disabled } = useCollapsible();

  const handleClick = () => {
    if (!disabled) {
      onOpenChange(!open);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props?.onClick?.(e);
        handleClick();
      },
      "aria-expanded": open,
      "data-state": open ? "open" : "closed",
      disabled,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      disabled={disabled}
      className={cn(
        "flex w-full items-center justify-between py-2 text-sm font-medium transition-all hover:underline",
        "[&[data-state=open]>svg]:rotate-180",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {showChevron && (
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      )}
    </button>
  );
}

// Collapsible Content
interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

function CollapsibleContent({
  children,
  className,
  forceMount,
  ...props
}: CollapsibleContentProps) {
  const { open } = useCollapsible();

  if (!forceMount && !open) {
    return null;
  }

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={cn("pb-4 pt-0", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
