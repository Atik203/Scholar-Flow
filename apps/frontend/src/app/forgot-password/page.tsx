"use client";
import { Button } from "@/components/ui/button";
import { useForgotPasswordMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await forgotPassword(data).unwrap();

      if (result.success) {
        setIsSubmitted(true);
        toast.success("Password reset email sent!", {
          description: "Check your email for the reset link",
        });
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset email", {
        description: error?.data?.message || "Please try again later",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left side - Success Message */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Success Icon */}
              <div className="mb-8">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-green-600">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground mt-2">
                  We've sent a password reset link to
                </p>
                <p className="font-medium text-foreground mt-1">{email}</p>
              </div>

              {/* Instructions */}
              <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-foreground">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Click the link in your email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Create a new secure password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Sign in with your new password</span>
                  </li>
                </ul>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 dark:text-white">
                      Security Notice
                    </p>
                    <p className="text-xs text-blue-700 dark:text-white mt-1">
                      The reset link will expire in 15 minutes for your
                      security. If you didn't request this, you can safely
                      ignore this email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try another email
                </Button>

                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Back to login
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Still having trouble?{" "}
                  <Link
                    href="/contact"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Contact support
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Hero Image/Content */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,theme(colors.green.500/20),transparent_50%)]" />

          <div className="relative flex flex-col justify-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format"
                  alt="Email security"
                  width={400}
                  height={300}
                  className="mx-auto rounded-2xl shadow-2xl"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Secure Password Recovery
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                We've got you covered with a secure, time-limited password reset
                process that keeps your account safe.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>15-minute secure token expiration</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Encrypted email delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>No password stored in emails</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>

              <div className="mb-6">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Forgot your password?
                </h1>
                <p className="text-muted-foreground mt-2">
                  No worries! Enter your email and we'll send you a reset link
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                size="lg"
                loading={isLoading}
                loadingText="Sending reset link..."
              >
                {!isLoading && (
                  <>
                    Send reset link
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign in here
                </Link>
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secure password recovery process</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-1/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,theme(colors.primary/20),transparent_50%)]" />

        <div className="relative flex flex-col justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <Image
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format"
                alt="Password recovery"
                width={400}
                height={300}
                className="mx-auto rounded-2xl shadow-2xl"
              />
            </div>

            <h2 className="text-3xl font-bold mb-4">Secure Account Recovery</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Get back to your research quickly and securely with our
              industry-standard password recovery process.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Instant email delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-chart-1" />
                <span>Time-limited security tokens</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>No account information exposed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
