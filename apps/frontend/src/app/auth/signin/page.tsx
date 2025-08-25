"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Loader2 } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthSignInPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsLoading(provider);

    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        toast.error(`Failed to sign in with ${provider}`);
        return;
      }

      if (result?.ok) {
        // Wait for session to be updated
        const session = await getSession();
        if (session) {
          toast.success("Welcome to ScholarFlow!");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error(`Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card className="border border-border/60 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold">
                Welcome to ScholarFlow
              </CardTitle>
              <CardDescription>
                Sign in to access your research workspace and continue your
                academic journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Google Sign In */}
              <Button
                onClick={() => handleSocialSignIn("google")}
                disabled={isLoading !== null}
                variant="outline"
                className="w-full h-11 font-medium"
              >
                {isLoading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              {/* GitHub Sign In */}
              <Button
                onClick={() => handleSocialSignIn("github")}
                disabled={isLoading !== null}
                variant="outline"
                className="w-full h-11 font-medium"
              >
                {isLoading === "github" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Github className="h-4 w-4 mr-2" />
                )}
                Continue with GitHub
              </Button>

              <div className="text-center text-sm text-muted-foreground mt-6">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/5 via-chart-1/5 to-chart-2/5 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6">Accelerate Your Research</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Organization</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically organize and categorize your research papers
                  with AI-powered insights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Collaborative Workspaces</h3>
                <p className="text-muted-foreground text-sm">
                  Share your research with colleagues and collaborate in
                  real-time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Advanced Search</h3>
                <p className="text-muted-foreground text-sm">
                  Find relevant papers across multiple databases with semantic
                  search
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
