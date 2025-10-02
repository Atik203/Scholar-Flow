"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const getCancelReason = () => {
    switch (reason) {
      case "user_canceled":
        return "You canceled the checkout process.";
      case "expired":
        return "The checkout session expired.";
      default:
        return "The payment process was not completed.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-yellow-500/50 shadow-xl">
          <CardContent className="pt-12 pb-8 text-center space-y-8">
            {/* Warning Icon with Animation */}
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
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl" />
                <AlertCircle className="h-24 w-24 text-yellow-500 relative" />
              </div>
            </motion.div>

            {/* Cancel Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Payment Canceled
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                {getCancelReason()} No charges have been made to your account.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-muted/50 rounded-xl p-6 text-left space-y-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">
                    Why Upgrade to Premium?
                  </h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Unlimited paper uploads and storage</li>
                    <li>• Advanced AI-powered insights and summaries</li>
                    <li>• Team collaboration features</li>
                    <li>• Priority customer support</li>
                    <li>• Export to all formats</li>
                    <li>• 14-day free trial on annual plans</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-xl p-6 text-left space-y-3">
              <h2 className="text-lg font-semibold">Need Help?</h2>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  If you encountered an issue during checkout:
                </p>
                <ul className="space-y-1.5 text-muted-foreground ml-4">
                  <li>• Make sure your payment information is correct</li>
                  <li>• Check if your card has international transactions enabled</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the payment was declined</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/pricing">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>

            {/* Support Link */}
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Still having issues?{" "}
                <Link
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4 mt-6">
          <p className="text-center text-sm text-muted-foreground">
            🔒 All payments are securely processed by Stripe. We never store
            your payment information.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
