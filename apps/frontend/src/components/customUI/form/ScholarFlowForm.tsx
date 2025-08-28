import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

// Form Provider Wrapper
export const FormProvider = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<"form">
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("space-y-6", className)} {...props} />
));
FormProvider.displayName = "FormProvider";

// Form Field Component
export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  render: (props: {
    field: {
      value: any;
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      name: string;
      ref: React.Ref<HTMLInputElement>;
    };
    fieldState: {
      error?: any;
      isTouched?: boolean;
      isDirty?: boolean;
    };
    formState: {
      isSubmitting?: boolean;
      isLoading?: boolean;
    };
  }) => React.ReactElement;
}

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  render,
}: FormFieldProps<TFieldValues, TName>) => {
  const { control, formState } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={(props) => render({ ...props, formState })}
    />
  );
};

// Form Label Component
export interface FormLabelProps extends React.ComponentProps<"label"> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

// Form Input Component
export interface FormInputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      {...props}
    />
  )
);
FormInput.displayName = "FormInput";

// Form Error Component
export interface FormErrorProps extends React.ComponentProps<"p"> {
  error?: string;
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, error, ...props }, ref) => {
    if (!error) return null;

    return (
      <p
        ref={ref}
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {error}
      </p>
    );
  }
);
FormError.displayName = "FormError";

// Form Description Component
export interface FormDescriptionProps extends React.ComponentProps<"p"> {}

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FormDescription.displayName = "FormDescription";

// Main Form Export
export const ScholarForm = {
  Root: FormProvider,
  Field: FormField,
  Input: FormInput,
  Label: FormLabel,
  Error: FormError,
  Description: FormDescription,
};
