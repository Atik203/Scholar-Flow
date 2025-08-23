"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
});

type ContactForm = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(ContactSchema) });

  async function onSubmit(values: ContactForm) {
    await new Promise((r) => setTimeout(r, 600));
    reset();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Contact
        </h1>
        <p className="mt-4 text-muted-foreground">
          We'd love to hear from you.
        </p>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 max-w-xl space-y-4"
      >
        <div>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            placeholder="Your name"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <textarea
            className="w-full rounded-md border bg-background px-3 py-2"
            rows={6}
            placeholder="Message"
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-destructive">
              {errors.message.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
