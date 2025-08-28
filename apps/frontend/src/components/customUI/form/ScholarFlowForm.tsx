import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import {
  FormProvider as ReactHookFormProvider,
  useForm,
} from "react-hook-form";
import { z } from "zod";

// Form Provider Component
interface FormProviderProps {
  children: React.ReactNode;
  schema?: z.ZodType<any, any, any>;
  defaultValues?: any;
  onSubmit?: (data: any) => void;
  className?: string;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  schema,
  defaultValues = {},
  onSubmit,
  className,
}) => {
  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit?.(data);
  });

  return (
    <ReactHookFormProvider {...methods}>
      <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
        {children}
      </form>
    </ReactHookFormProvider>
  );
};

// Form Field Component
interface FormFieldProps {
  children: React.ReactNode;
  name: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  name,
  className,
}) => {
  return <div className={cn("space-y-2", className)}>{children}</div>;
};

// Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  required,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

// Form Label Component
interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  htmlFor,
  required,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-medium text-foreground", className)}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
};

// Form Error Component
interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  children,
  className,
}) => {
  return (
    <p className={cn("text-sm text-destructive", className)}>{children}</p>
  );
};

// Form Description Component
interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
};

// Export all components as ScholarForm object
export const ScholarForm = {
  Root: FormProvider,
  Field: FormField,
  Input: FormInput,
  Label: FormLabel,
  Error: FormError,
  Description: FormDescription,
};
