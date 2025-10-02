"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Simulate verification delay for better UX
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Verifying Your Payment
              </h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your subscription...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-primary/50 shadow-xl">
          <CardContent className="pt-12 pb-8 text-center space-y-8">
            {/* Success Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                <CheckCircle className="h-24 w-24 text-primary relative" />
              </div>
            </motion.div>

            {/* Success Message */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                Payment Successful
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  Premium
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Your subscription is now active! You have full access to all
                premium features.
              </p>
            </div>

            {/* Session ID (for support) */}
            {sessionId && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">
                  Session ID:{" "}
                  <span className="font-mono text-foreground">{sessionId}</span>
                </p>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-xl p-6 text-left space-y-4">
              <h2 className="text-xl font-semibold">What's Next?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Explore Premium Features</p>
                    <p className="text-sm text-muted-foreground">
                      Access advanced AI insights, unlimited papers, and more
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Manage Your Subscription</p>
                    <p className="text-sm text-muted-foreground">
                      Update billing info, view invoices, or change plans
                      anytime
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Get Support</p>
                    <p className="text-sm text-muted-foreground">
                      Priority support is now available for all your questions
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/billing">Manage Subscription</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          A confirmation email has been sent to your inbox with your receipt and
          subscription details.
        </p>
      </motion.div>
    </div>
  );
}
