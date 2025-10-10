import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

export interface FormProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn("space-y-4", className)} {...props} />
  )
)
Form.displayName = "Form"

interface FormFieldProps {
  control?: any
  name: string
  render: ({ field }: { field: any }) => React.ReactElement
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ control, name, render, ...props }, ref) => {
    const form = useFormContext()
    const fieldControl = control || form.control

    return (
      <Controller
        control={fieldControl}
        name={name}
        render={({ field, fieldState }) => (
          <div ref={ref} {...props}>
            {render({ field })}
          </div>
        )}
      />
    )
  }
)
FormField.displayName = "FormField"

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
  )
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props} />
  )
)
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
