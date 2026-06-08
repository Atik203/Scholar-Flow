"use client";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/customUI/form/FloatingInput";
import { getRoleDashboardUrl } from "@/lib/auth/redirects";
import {
  useGetCurrentUserQuery,
  useSendEmailVerificationMutation,
  useVerifyEmailMutation,
} from "@/redux/auth/authApi";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, Loader2, Mail, Send, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [verifyEmail] = useVerifyEmailMutation();
  const [sendVerification, { isLoading: isSending }] = useSendEmailVerificationMutation();
  const { data: currentUser } = useGetCurrentUserQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const doVerify = async (tokenToVerify: string) => {
    try {
      setIsVerifying(true);
      setIsError(false);
      setErrorMessage("");
      const result = await verifyEmail({ token: tokenToVerify }).unwrap();
      if (result.success) {
        setIsSuccess(true);
        toast.success("Email verified successfully!", {
          description: "Your account is now fully activated",
        });
      }
    } catch (error: any) {
      setIsError(true);
      const msg = error?.data?.message || error?.message || "Failed to verify email. Please try again.";
      setErrorMessage(msg);
      toast.error("Email verification failed", { description: msg });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (token) {
      doVerify(token);
    }
  }, [token]);

  const handleManualVerify = () => {
    if (!manualToken.trim()) {
      toast.error("Please enter a verification token");
      return;
    }
    doVerify(manualToken.trim());
  };

  const handleSendVerification = async () => {
    if (!currentUser?.data?.user?.id) {
      toast.error("Please log in to send verification email");
      return;
    }
    try {
      await sendVerification({ userId: currentUser.data.user.id }).unwrap();
      toast.success("Verification email sent!", {
        description: "Check your email for the verification link",
      });
    } catch (error: any) {
      toast.error("Failed to send verification email", {
        description: error?.data?.message || "Please try again later",
      });
    }
  };

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
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Your Email</h1>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-red-600">Verification Failed</h1>
                <p className="text-muted-foreground mt-2">{errorMessage}</p>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-red-900 dark:text-red-100">Common Issues</h3>
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

              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Go to Login
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full" size="lg">
                    Contact Support
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8">
                <p className="text-sm text-muted-foreground">
                  Need a new verification email?{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Sign in to request one
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,theme(colors.red.500/20),transparent_50%)]" />
          <div className="relative flex flex-col justify-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format"
                  alt="Verification troubleshooting"
                  width={400}
                  height={300}
                  className="mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4">Verification Troubleshooting</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Don&apos;t worry! Email verification issues are common and easily resolved.
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-green-600">
                  Email Verified Successfully!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Congratulations! Your email address has been verified and your account is now fully activated.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-green-900 dark:text-green-100">What&apos;s Next?</h3>
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

              <div className="space-y-3">
                <Link href="/profile">
                  <Button className="w-full" size="lg">
                    Go to Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href={getRoleDashboardUrl(currentUser?.data?.user?.role)}>
                  <Button variant="outline" className="w-full" size="lg">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8">
                <p className="text-sm text-muted-foreground">
                  Ready to start researching?{" "}
                  <Link href="/features" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Explore our features
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

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
                  alt="Email verified"
                  width={400}
                  height={300}
                  className="mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome to ScholarFlow!</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Your account is now fully verified and ready to use.
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

  // Default - no token, show manual entry
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold">Email Verification</h1>
            <p className="text-muted-foreground mt-2">
              Click the verification link in your email to verify your account.
            </p>
          </div>

          <div className="space-y-4">
            <FloatingInput
              label="Enter verification token"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste your verification token"
            />
            <Button onClick={handleManualVerify} className="w-full" size="lg">
              Verify Token
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">or</span>
              </div>
            </div>
            <Button
              onClick={handleSendVerification}
              variant="outline"
              className="w-full"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send New Verification Email
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary">
              &larr; Back to Profile
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
