"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface ResetPasswordPageProps {
  onNavigate?: (path: string) => void;
  token?: string; // Simulated token from URL
}

// ============================================================================
// Reset Password Page Component
// ============================================================================
export function ResetPasswordPage({
  onNavigate,
  token = "valid-token", // For demo purposes, default to valid
}: ResetPasswordPageProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // If no token, show error
  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => onNavigate?.("/forgot-password")}
            >
              Request New Reset Link
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one lowercase letter and one number";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  // Success State
  if (isSuccess) {
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
                  Password Reset Successfully!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Your password has been updated. You can now sign in with your
                  new password.
                </p>
              </div>

              {/* Security Note */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Security Updated
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Your account is now protected with a new password. The old
                      reset link has been invalidated for security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onNavigate?.("/login")}
                >
                  Sign In Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => onNavigate?.("/")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Having trouble signing in?{" "}
                  <button
                    onClick={() => onNavigate?.("/contact")}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Contact support
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Hero Image/Content */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,197,94,0.2),transparent_50%)]" />

          <div className="relative flex flex-col justify-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <img
                  src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop&auto=format"
                  alt="Password reset success"
                  className="mx-auto rounded-2xl shadow-2xl w-[400px] h-[300px] object-cover"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Your account is now secure with a new password. Sign in to
                continue your research journey.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>New password is active</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Old reset link invalidated</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Account security updated</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Form State
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
              <button
                onClick={() => onNavigate?.("/forgot-password")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to forgot password
              </button>

              <div className="mb-6">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Create New Password
                </h1>
                <p className="text-muted-foreground mt-2">
                  Enter your new password below. Make sure it's secure and
                  memorable.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
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
                {errors.newPassword && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters with one lowercase letter and
                  one number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full pr-12 pl-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating password...
                  </div>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <button
                  onClick={() => onNavigate?.("/login")}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign in here
                </button>
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secure password update process</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-1/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.2),transparent_50%)]" />

        <div className="relative flex flex-col justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <img
                src="https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=300&fit=crop&auto=format"
                alt="Password security"
                className="mx-auto rounded-2xl shadow-2xl w-[400px] h-[300px] object-cover"
              />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Strong Password Guidelines
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Create a strong password that's both secure and memorable for your
              research account.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-chart-1" />
                <span>Include lowercase letters and numbers</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Avoid common words and patterns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
