"use client";

import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// DropdownMenu Context
interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<
  DropdownMenuContextValue | undefined
>(undefined);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "DropdownMenu components must be used within a DropdownMenu"
    );
  }
  return context;
}

// DropdownMenu Root
interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function DropdownMenu({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: DropdownMenuProps) {
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
    <DropdownMenuContext.Provider
      value={{ open, onOpenChange: handleOpenChange }}
    >
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

// DropdownMenu Trigger
interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

function DropdownMenuTrigger({
  children,
  asChild,
  className,
}: DropdownMenuTriggerProps) {
  const { open, onOpenChange } = useDropdownMenu();

  const handleClick = () => onOpenChange(!open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props?.onClick?.(e);
        handleClick();
      },
      "aria-expanded": open,
      "aria-haspopup": true,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup={true}
      className={className}
    >
      {children}
    </button>
  );
}

// DropdownMenu Content
interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

function DropdownMenuContent({
  children,
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  const { open, onOpenChange } = useDropdownMenu();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        // Check if click is on trigger
        const trigger = contentRef.current.parentElement?.querySelector(
          '[aria-haspopup="true"]'
        );
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover dark:bg-gray-800 p-1 text-popover-foreground dark:text-white shadow-lg",
            alignClasses[align],
            className
          )}
          style={{ top: `calc(100% + ${sideOffset}px)` }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// DropdownMenu Item
interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  variant?: "default" | "destructive";
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  const { onOpenChange } = useDropdownMenu();

  return (
    <button
      type="button"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors w-full text-left",
        "focus:bg-accent focus:text-accent-foreground dark:focus:bg-gray-700 dark:focus:text-white",
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700",
        variant === "destructive" &&
          "text-destructive focus:bg-destructive/10 focus:text-destructive",
        inset && "pl-8",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    />
  );
}

// DropdownMenu Label
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold text-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

// DropdownMenu Separator
function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-border dark:bg-gray-700", className)}
      {...props}
    />
  );
}

// DropdownMenu Shortcut
function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

// DropdownMenu Group
function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div role="group">{children}</div>;
}

// DropdownMenu Checkbox Item
interface DropdownMenuCheckboxItemProps
  extends Omit<DropdownMenuItemProps, "children"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children: React.ReactNode;
}

function DropdownMenuCheckboxItem({
  className,
  checked,
  onCheckedChange,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors w-full text-left",
        "focus:bg-accent focus:text-accent-foreground dark:focus:bg-gray-700",
        "hover:bg-accent dark:hover:bg-gray-700",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
}

// DropdownMenu Sub (simplified version)
interface DropdownMenuSubProps {
  children: React.ReactNode;
}

function DropdownMenuSub({ children }: DropdownMenuSubProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuSubTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  const { onOpenChange } = useDropdownMenu();

  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none w-full",
        "focus:bg-accent dark:focus:bg-gray-700",
        "hover:bg-accent dark:hover:bg-gray-700",
        inset && "pl-8",
        className
      )}
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </button>
  );
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useDropdownMenu();

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -4 }}
      className={cn(
        "absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg ml-1",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
