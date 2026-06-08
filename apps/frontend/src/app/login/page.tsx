"use client";
import {
  dismissToast,
  showAuthErrorToast,
  showAuthSuccessToast,
  showLoadingToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/customUI/form/FloatingInput";
import { ToggleField } from "@/components/customUI/form/ToggleField";
import { ScholarForm } from "@/components/customUI/form/ScholarFlowForm";
import { useAuthRoute } from "@/hooks/useAuthGuard";
import { signInWithCredentials, signInWithOAuth } from "@/lib/auth/authHelpers";
import { getCallbackUrl } from "@/lib/auth/redirects";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { isLoading: authLoading } = useAuthRoute();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading("credentials");
    const loadingToast = showLoadingToast("Signing in...");

    try {
      const callbackUrl = getCallbackUrl(searchParams);
      const result = await signInWithCredentials(
        data.email,
        data.password,
        dispatch
      );

      if (!result.success) {
        dismissToast(loadingToast);
        showAuthErrorToast(result.error || "Invalid email or password");
        return;
      }

      dismissToast(loadingToast);
      showAuthSuccessToast("Welcome back!");
      router.push(callbackUrl || "/dashboard");
    } catch (error) {
      dismissToast(loadingToast);
      showAuthErrorToast("An unexpected error occurred while signing in");
    } finally {
      setIsLoading(null);
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(provider);
    showLoadingToast(`Redirecting to ${provider}...`);

    try {
      const callbackUrl = getCallbackUrl(searchParams);
      signInWithOAuth(provider, callbackUrl);
    } catch (error) {
      showAuthErrorToast(`An error occurred while signing in with ${provider}`);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>

              <div className="mb-6">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-muted-foreground mt-2">
                  Sign in to continue your research journey
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading !== null}
                variant="outline"
                className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50"
                size="lg"
              >
                {isLoading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <Button
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading !== null}
                variant="outline"
                className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50"
                size="lg"
              >
                {isLoading === "github" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Github className="h-5 w-5 mr-3" />
                )}
                Continue with GitHub
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FloatingInput
                {...register("email")}
                label="Email address"
                type="email"
                required
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <div className="relative">
                <FloatingInput
                  {...register("password")}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <ToggleField
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      label="Remember me"
                      size="sm"
                    />
                  )}
                />
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading !== null}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                size="lg"
              >
                {isLoading === "credentials" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign up for free
                </Link>
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Protected by industry-standard encryption</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format"
                alt="Research collaboration"
                width={400}
                height={300}
                className="mx-auto rounded-2xl shadow-2xl"
              />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Welcome back to{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                ScholarFlow
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Continue your research journey with AI-powered tools designed to
              accelerate discovery and collaboration.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Access your research library instantly</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-chart-1" />
                <span>Continue collaborating with your team</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Pick up where you left off</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
