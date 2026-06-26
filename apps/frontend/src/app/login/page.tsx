"use client";
import {
  dismissToast,
  showAuthErrorToast,
  showAuthSuccessToast,
  showLoadingToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingInput } from "@/components/customUI/form/FloatingInput";
import { ToggleField } from "@/components/customUI/form/ToggleField";
import { useAuthRoute } from "@/hooks/useAuthGuard";
import { signInWithCredentials, signInWithOAuth } from "@/lib/auth/authHelpers";
import { getCallbackUrl } from "@/lib/auth/redirects";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Globe,
  Loader2,
  Mail,
  Shield,
  Sparkles,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { API_BASE_URL } from "@/lib/apiUrl";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
}));

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "magic-link">("password");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { isLoading: authLoading } = useAuthRoute();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)sf_last_auth=([^;]*)/);
    setLastProvider(match ? match[1] : null);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
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
    } catch {
      dismissToast(loadingToast);
      showAuthErrorToast("An unexpected error occurred while signing in");
    } finally {
      setIsLoading(null);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicLinkEmail.trim()) {
      showAuthErrorToast("Please enter your email address");
      return;
    }
    setIsLoading("magic-link");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/magic-link/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: magicLinkEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showAuthErrorToast(data.message || "Failed to send magic link");
        setIsLoading(null);
        return;
      }

      setMagicLinkSent(true);
      showAuthSuccessToast("Magic link sent! Check your email.");
    } catch {
      showAuthErrorToast("Failed to send magic link");
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
    } catch {
      showAuthErrorToast(`An error occurred while signing in with ${provider}`);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex relative z-10">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
                  <motion.div
                    className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Sign in to continue your research journey
                  </p>
                </div>

              </div>

              <div className="flex rounded-lg border border-border p-1 mb-6">
                <button
                  onClick={() => setLoginMethod("password")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    loginMethod === "password"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Password
                  {lastProvider === "credentials" && (
                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-300 bg-green-50 ml-1 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                      Last used
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setLoginMethod("magic-link")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1 ${
                    loginMethod === "magic-link"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Magic Link
                </button>
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
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <span className="flex-1 text-left">Continue with Google</span>
                  {lastProvider === "google" && (
                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-300 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-800 ml-auto">
                      Last used
                    </Badge>
                  )}
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
                  <span className="flex-1 text-left">Continue with GitHub</span>
                  {lastProvider === "github" && (
                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-300 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-800 ml-auto">
                      Last used
                    </Badge>
                  )}
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

              <AnimatePresence mode="wait">
                {loginMethod === "password" ? (
                  <motion.form
                    key="password-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
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
                  </motion.form>
                ) : (
                  <motion.form
                    key="magic-link-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleMagicLinkSubmit}
                    className="space-y-4"
                  >
                    {!magicLinkSent ? (
                      <>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                          <input
                            type="email"
                            value={magicLinkEmail}
                            onChange={(e) => setMagicLinkEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground -mt-2">
                          We&apos;ll send you a magic link to sign in instantly
                        </p>

                        <Button
                          type="submit"
                          disabled={isLoading !== null}
                          className="w-full px-4 py-3 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                          size="lg"
                        >
                          {isLoading === "magic-link" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Sending link...
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4 mr-2" />
                              Send Magic Link
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Mail className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Check your email!
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          We sent a magic link to <strong>{magicLinkEmail}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => setMagicLinkSent(false)}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Didn&apos;t receive it? Try again
                        </button>
                      </motion.div>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>

              {lastProvider && (
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>
                    Last signed in with{" "}
                    <span className="font-medium text-foreground capitalize">
                      {lastProvider === "credentials" ? "password" : lastProvider}
                    </span>
                  </span>
                </div>
              )}

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
    </div>
  );
}
