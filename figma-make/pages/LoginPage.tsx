"use client";

/**
 * LoginPage - User Authentication
 *
 * Enhanced with:
 * - Animated background particles
 * - Recent login locations
 * - Magic link option
 * - Biometric authentication hint
 */

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Fingerprint,
  Github,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Shield,
  Smartphone,
  Sparkles,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/button";

// Role types for the system
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface LoginPageProps {
  onNavigate?: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

// Role email patterns for demo
const roleEmailPatterns: Record<string, UserRole> = {
  "researcher@example.com": "researcher",
  "pro@example.com": "pro_researcher",
  "lead@example.com": "team_lead",
  "admin@example.com": "admin",
};

// Recent login locations for security display
const recentLoginLocations = [
  {
    city: "New York, USA",
    device: "Chrome on MacOS",
    time: "2 hours ago",
    current: true,
  },
  { city: "Boston, USA", device: "Safari on iPhone", time: "Yesterday" },
  { city: "London, UK", device: "Firefox on Windows", time: "3 days ago" },
];

// Animated background particles configuration
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
}));

export function LoginPage({ onNavigate, onShowToast }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "magic-link">(
    "password"
  );
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showRecentLogins, setShowRecentLogins] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Check for biometric availability on mount
  useEffect(() => {
    // Simulating biometric availability check
    if (typeof window !== "undefined" && "PublicKeyCredential" in window) {
      setBiometricAvailable(true);
    }
  }, []);

  // Determine role from email
  const determineRole = (email: string): UserRole | null => {
    // Check exact patterns first
    if (roleEmailPatterns[email.toLowerCase()]) {
      return roleEmailPatterns[email.toLowerCase()];
    }
    // Check prefix patterns
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.startsWith("admin")) return "admin";
    if (lowerEmail.startsWith("lead") || lowerEmail.startsWith("team"))
      return "team_lead";
    if (lowerEmail.startsWith("pro")) return "pro_researcher";
    if (lowerEmail.includes("@")) return "researcher"; // Default if valid email
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email is not empty
    if (!email.trim()) {
      onShowToast?.("Please enter your email address", "error");
      return;
    }

    // Determine role from email
    const role = determineRole(email);

    if (!role) {
      onShowToast?.("Please enter a valid email address", "error");
      return;
    }

    if (!password.trim()) {
      onShowToast?.("Please enter your password", "error");
      return;
    }

    setIsLoading("credentials");

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(null);
      onShowToast?.("Welcome back!", "success");

      // Navigate to role-specific dashboard
      switch (role) {
        case "admin":
          onNavigate?.("/dashboard/admin");
          break;
        case "team_lead":
          onNavigate?.("/dashboard/team-lead");
          break;
        case "pro_researcher":
          onNavigate?.("/dashboard/pro-researcher");
          break;
        default:
          onNavigate?.("/dashboard/researcher");
      }
    }, 1500);
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      onShowToast?.("Please enter your email address", "error");
      return;
    }
    setIsLoading("magic-link");
    setTimeout(() => {
      setIsLoading(null);
      setMagicLinkSent(true);
      onShowToast?.("Magic link sent! Check your email.", "success");
    }, 1500);
  };

  const handleBiometricAuth = () => {
    setIsLoading("biometric");
    onShowToast?.("Authenticating with biometrics...", "info");
    setTimeout(() => {
      setIsLoading(null);
      onShowToast?.("Welcome back!", "success");
      onNavigate?.("/dashboard/researcher");
    }, 2000);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(provider);
    onShowToast?.(`Redirecting to ${provider}...`, "info");

    // Simulate OAuth redirect
    setTimeout(() => {
      setIsLoading(null);
      // Default to researcher dashboard for social login
      onNavigate?.("/dashboard/researcher");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background Particles */}
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

      {/* Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex relative z-10">
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
                <button
                  onClick={() => onNavigate?.("/")}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to home
                </button>

                <div className="mb-6">
                  <motion.div
                    className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-[var(--chart-1)]/20 border border-primary/30 flex items-center justify-center"
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

                {/* Biometric Authentication Hint */}
                {biometricAvailable && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4"
                  >
                    <Button
                      onClick={handleBiometricAuth}
                      disabled={isLoading !== null}
                      variant="outline"
                      className="w-full border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                    >
                      {isLoading === "biometric" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Fingerprint className="h-5 w-5 mr-2 text-primary" />
                      )}
                      Sign in with Biometrics
                      <Smartphone className="h-4 w-4 ml-2 text-muted-foreground" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use Face ID, Touch ID, or Windows Hello
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Login Method Toggle */}
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

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading !== null}
                  variant="outline"
                  className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-glow"
                  size="lg"
                >
                  {isLoading === "google" ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                  className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-glow"
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

              {/* Divider */}
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

              {/* Login Form - Conditional based on method */}
              <AnimatePresence mode="wait">
                {loginMethod === "password" ? (
                  <motion.form
                    key="password-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try: admin@..., lead@..., pro@..., or any email for
                        researcher
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pr-12 pl-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => onNavigate?.("/forgot-password")}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading !== null}
                      variant="gradient"
                      className="w-full px-4 py-3 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none btn-hover-glow btn-shine"
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
                          <ArrowRight className="h-4 w-4 ml-2" />
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
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            We'll send you a magic link to sign in instantly
                          </p>
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading !== null}
                          variant="gradient"
                          className="w-full px-4 py-3 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none btn-hover-glow btn-shine"
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
                          We sent a magic link to <strong>{email}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => setMagicLinkSent(false)}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Didn't receive it? Try again
                        </button>
                      </motion.div>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Recent Login Locations */}
              <div className="mt-6">
                <button
                  onClick={() => setShowRecentLogins(!showRecentLogins)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                  <Globe className="h-4 w-4" />
                  <span>Recent login activity</span>
                  <ChevronDown
                    className={`h-4 w-4 ml-auto transition-transform ${
                      showRecentLogins ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showRecentLogins && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-2 overflow-hidden"
                    >
                      {recentLoginLocations.map((login, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            login.current
                              ? "border-green-500/30 bg-green-500/5"
                              : "border-border bg-muted/30"
                          }`}
                        >
                          <MapPin
                            className={`h-4 w-4 ${login.current ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {login.city}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {login.device}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {login.time}
                            </p>
                            {login.current && (
                              <span className="text-xs text-green-500 font-medium">
                                Current
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => onNavigate?.("/register")}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Sign up for free
                  </button>
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Protected by industry-standard encryption</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Hero Image/Content */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[var(--chart-1)]/10 to-primary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.2),transparent_50%)]" />

          <div className="relative flex flex-col justify-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format"
                  alt="Research collaboration"
                  className="mx-auto rounded-2xl shadow-2xl w-[400px] h-[300px] object-cover"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Welcome back to{" "}
                <span className="bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent">
                  ScholarFlow
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Continue your research journey with AI-powered tools designed to
                accelerate discovery and collaboration.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Access your research library instantly</span>
                </div>
                <div className="flex items-center gap-3 text-sm justify-center">
                  <div className="h-2 w-2 rounded-full bg-[var(--chart-1)]" />
                  <span>Continue collaborating with your team</span>
                </div>
                <div className="flex items-center gap-3 text-sm justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Pick up where you left off</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
