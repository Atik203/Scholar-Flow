"use client";

import { ArrowRight, CheckCircle, Mail, Send, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

// ============================================================================
// Types
// ============================================================================
interface VerifyEmailPageProps {
  onNavigate?: (path: string) => void;
  token?: string; // Simulated token from URL
  simulateState?: "verifying" | "success" | "error" | "default"; // For demo
}

// ============================================================================
// Verify Email Page Component
// ============================================================================
export function VerifyEmailPage({
  onNavigate,
  token,
  simulateState = "default",
}: VerifyEmailPageProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Simulate verification when token is provided
  useEffect(() => {
    if (token) {
      const verifyTokenFromURL = async () => {
        setIsVerifying(true);
        setIsError(false);
        setErrorMessage("");

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate success or error based on token
        if (token === "valid-token" || simulateState === "success") {
          setIsSuccess(true);
        } else {
          setIsError(true);
          setErrorMessage("This verification link has expired or is invalid.");
        }
        setIsVerifying(false);
      };

      verifyTokenFromURL();
    }
  }, [token, simulateState]);

  // Demo state simulation
  useEffect(() => {
    if (simulateState === "verifying") {
      setIsVerifying(true);
    } else if (simulateState === "success") {
      setIsSuccess(true);
    } else if (simulateState === "error") {
      setIsError(true);
      setErrorMessage("This verification link has expired or is invalid.");
    }
  }, [simulateState]);

  const handleManualVerify = async () => {
    if (!manualToken.trim()) {
      return;
    }
    setIsVerifying(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsVerifying(false);
    setIsSuccess(true);
  };

  const handleSendVerification = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Your Email</h1>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left side - Error Message */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Error Icon */}
              <div className="mb-8">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-red-600">
                  Verification Failed
                </h1>
                <p className="text-muted-foreground mt-2">{errorMessage}</p>
              </div>

              {/* Common Issues */}
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-red-900 dark:text-red-100">
                  Common Issues
                </h3>
                <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Verification link has expired (15 minutes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Link has already been used</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Invalid or corrupted verification token</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onNavigate?.("/login")}
                >
                  Go to Login
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => onNavigate?.("/contact")}
                >
                  Contact Support
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Need a new verification email?{" "}
                  <button
                    onClick={() => onNavigate?.("/login")}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Sign in to request one
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Hero Image/Content */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(239,68,68,0.2),transparent_50%)]" />

          <div className="relative flex flex-col justify-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format"
                  alt="Email verification error"
                  className="mx-auto rounded-2xl shadow-2xl w-[400px] h-[300px] object-cover"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Verification Troubleshooting
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Don't worry! Email verification issues are common and easily
                resolved. We're here to help you get verified.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Check your email spam folder</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span>Ensure the link is complete</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Request a new verification email</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
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
                  Email Verified Successfully!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Congratulations! Your email address has been verified and your
                  account is now fully activated.
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-green-900 dark:text-green-100">
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Access to all ScholarFlow features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Receive important account notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Enhanced account security</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onNavigate?.("/profile")}
                >
                  Go to Profile
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => onNavigate?.("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Ready to start researching?{" "}
                  <button
                    onClick={() => onNavigate?.("/features")}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Explore our features
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
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format"
                  alt="Email verification success"
                  className="mx-auto rounded-2xl shadow-2xl w-[400px] h-[300px] object-cover"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Welcome to ScholarFlow!
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Your account is now fully verified and ready to use. Start
                exploring our powerful research tools and collaboration
                features.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>AI-powered paper analysis</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Team collaboration tools</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Advanced search capabilities</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Default state - no token provided
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">Email Verification</CardTitle>
              <CardDescription>
                Click the verification link in your email to verify your
                account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSendVerification}
                variant="outline"
                className="w-full"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send New Verification Email
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or enter token manually
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Enter verification token"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Button
                  onClick={handleManualVerify}
                  className="w-full"
                  disabled={!manualToken.trim()}
                >
                  Verify Token
                </Button>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => onNavigate?.("/profile")}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  ← Back to Profile
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
