"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Modal Context
// ============================================================================
interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = React.createContext<ModalContextValue | undefined>(
  undefined
);

function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
}

// ============================================================================
// Modal Root
// ============================================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeOnOverlayClick ? onClose : undefined}
            />
            {children}
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>,
    document.body
  );
}

// ============================================================================
// Modal Content
// ============================================================================
type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[90vw] max-h-[90vh]",
};

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, size = "md", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "relative z-[101] w-full",
          sizeClasses[size],
          "bg-card rounded-xl shadow-2xl border border-border",
          "flex flex-col overflow-hidden",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
ModalContent.displayName = "ModalContent";

// ============================================================================
// Modal Header
// ============================================================================
interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, showCloseButton = true, children, ...props }, ref) => {
    const { onClose } = useModal();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between",
          "px-6 py-4 border-b border-border",
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {showCloseButton && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={cn(
              "ml-4 p-1.5 rounded-full",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </motion.button>
        )}
      </div>
    );
  }
);
ModalHeader.displayName = "ModalHeader";

// ============================================================================
// Modal Title
// ============================================================================
export const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

// ============================================================================
// Modal Description
// ============================================================================
export const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-1", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

// ============================================================================
// Modal Body
// ============================================================================
export const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 px-6 py-4 overflow-y-auto", className)}
    {...props}
  />
));
ModalBody.displayName = "ModalBody";

// ============================================================================
// Modal Footer
// ============================================================================
export const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-3",
      "px-6 py-4 border-t border-border",
      "bg-muted/30",
      className
    )}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";

// ============================================================================
// Confirmation Modal
// ============================================================================
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
        <ModalFooter>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-lg",
              "text-sm font-medium",
              "border border-border",
              "hover:bg-muted transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-lg",
              "text-sm font-medium text-white",
              variant === "destructive"
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90",
              "transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Loading...
              </span>
            ) : (
              confirmText
            )}
          </motion.button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ============================================================================
// Alert Modal
// ============================================================================
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonText?: string;
  variant?: "default" | "success" | "warning" | "error";
}

const alertVariantClasses: Record<string, string> = {
  default: "bg-primary text-white hover:bg-primary/90",
  success: "bg-green-600 text-white hover:bg-green-700",
  warning: "bg-yellow-600 text-white hover:bg-yellow-700",
  error: "bg-destructive text-white hover:bg-destructive/90",
};

export function AlertModal({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "OK",
  variant = "default",
}: AlertModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
        <ModalFooter>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-lg",
              "text-sm font-medium",
              "transition-colors",
              alertVariantClasses[variant]
            )}
          >
            {buttonText}
          </motion.button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ============================================================================
// Form Modal
// ============================================================================
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  size?: ModalSize;
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  isLoading = false,
  size = "md",
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isLoading}>
      <ModalContent size={size}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-lg",
              "text-sm font-medium",
              "border border-border",
              "hover:bg-muted transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-lg",
              "text-sm font-medium text-white",
              "bg-primary hover:bg-primary/90",
              "transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Loading...
              </span>
            ) : (
              submitText
            )}
          </motion.button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Modal;
