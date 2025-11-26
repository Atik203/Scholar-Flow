"use client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Github,
  Mail,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/button";

// Role types for the system
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface RegisterPageProps {
  onNavigate?: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

const benefits = [
  "Unlimited paper uploads and AI analysis",
  "Advanced semantic search capabilities",
  "Real-time collaboration with teams",
  "Export to all major citation formats",
  "Priority customer support",
  "Mobile app access",
];

// Role email patterns for demo
const roleEmailPatterns: Record<string, UserRole> = {
  "researcher@example.com": "researcher",
  "pro@example.com": "pro_researcher",
  "lead@example.com": "team_lead",
  "admin@example.com": "admin",
};

export function RegisterPage({ onNavigate, onShowToast }: RegisterPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  // Determine role from email
  const determineRole = (email: string): UserRole | null => {
    if (roleEmailPatterns[email.toLowerCase()]) {
      return roleEmailPatterns[email.toLowerCase()];
    }
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.startsWith("admin")) return "admin";
    if (lowerEmail.startsWith("lead") || lowerEmail.startsWith("team"))
      return "team_lead";
    if (lowerEmail.startsWith("pro")) return "pro_researcher";
    if (lowerEmail.includes("@")) return "researcher";
    return null;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, text: "Weak", color: "text-red-500" };
    if (strength <= 3)
      return { strength, text: "Fair", color: "text-yellow-500" };
    if (strength <= 4)
      return { strength, text: "Good", color: "text-green-500" };
    return { strength, text: "Strong", color: "text-green-600" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!firstName.trim()) {
      onShowToast?.("Please enter your first name", "error");
      return;
    }
    if (!lastName.trim()) {
      onShowToast?.("Please enter your last name", "error");
      return;
    }
    if (!email.trim()) {
      onShowToast?.("Please enter your email address", "error");
      return;
    }

    const role = determineRole(email);
    if (!role) {
      onShowToast?.("Please enter a valid email address", "error");
      return;
    }

    if (!password.trim() || password.length < 8) {
      onShowToast?.("Password must be at least 8 characters", "error");
      return;
    }
    if (password !== confirmPassword) {
      onShowToast?.("Passwords don't match", "error");
      return;
    }
    if (!acceptTerms) {
      onShowToast?.("You must accept the terms and conditions", "error");
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      onShowToast?.(
        "Account created successfully! Welcome to ScholarFlow.",
        "success"
      );

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

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true);
    onShowToast?.(`Signing up with ${provider}...`, "info");

    setTimeout(() => {
      setIsLoading(false);
      onNavigate?.("/dashboard/researcher");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-80px)]">
            {/* Left side - Hero Image/Content */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[var(--chart-1)]/10 to-primary/5" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.2),transparent_50%)]" />

              <div className="relative flex flex-col justify-center p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="mb-8">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop&auto=format"
                      alt="Research team collaboration"
                      className="rounded-2xl shadow-2xl w-[400px] h-[300px] object-cover"
                    />
                  </div>

                  <h2 className="text-3xl font-bold mb-4">
                    Join{" "}
                    <span className="bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent">
                      50,000+
                    </span>{" "}
                    researchers
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md">
                    Accelerate your research with AI-powered tools trusted by
                    leading institutions worldwide.
                  </p>

                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right side - Form */}
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
                      <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-[var(--chart-1)]/20 border border-primary/30 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h1 className="text-3xl font-bold tracking-tight">
                        Create account
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Start your research journey today
                      </p>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      onClick={() => handleSocialLogin("google")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
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
                      Sign up with Google
                    </Button>

                    <Button
                      onClick={() => handleSocialLogin("github")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-border hover:bg-muted/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      <Github className="h-5 w-5 mr-3" />
                      Sign up with GitHub
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">
                        Or sign up with email
                      </span>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          First name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Last name
                        </label>
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>

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
                          placeholder="john.doe@university.edu"
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try: admin@..., lead@..., pro@..., or any email for
                        researcher
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Institution{" "}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </label>
                        <input
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="Stanford University"
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Field of study{" "}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </label>
                        <input
                          value={fieldOfStudy}
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          placeholder="Computer Science"
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
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
                          placeholder="Create a strong password"
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

                      {password && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  passwordStrength.strength <= 2
                                    ? "bg-red-500"
                                    : passwordStrength.strength <= 3
                                      ? "bg-yellow-500"
                                      : passwordStrength.strength <= 4
                                        ? "bg-green-500"
                                        : "bg-green-600"
                                }`}
                                style={{
                                  width: `${(passwordStrength.strength / 5) * 100}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`text-xs ${passwordStrength.color}`}
                            >
                              {passwordStrength.text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full pr-12 pl-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50 mt-0.5"
                        />
                        <span>
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={() => onNavigate?.("/terms")}
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            Terms of Service
                          </button>{" "}
                          and{" "}
                          <button
                            type="button"
                            onClick={() => onNavigate?.("/privacy")}
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            Privacy Policy
                          </button>
                        </span>
                      </label>

                      <label className="flex items-center gap-3 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={newsletter}
                          onChange={(e) => setNewsletter(e.target.checked)}
                          className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                        />
                        <span>
                          Send me updates about new features and research
                          insights
                        </span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-primary to-[var(--chart-1)] hover:from-primary/90 hover:to-[var(--chart-1)]/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create account
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        onClick={() => onNavigate?.("/login")}
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Sign in
                      </button>
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>
                        Your data is protected with enterprise-grade security
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
