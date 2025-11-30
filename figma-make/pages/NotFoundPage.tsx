"use client";

import { FileQuestion, Home, Search } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface NotFoundPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Not Found Page Component
// ============================================================================
export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted/50 border border-border flex items-center justify-center">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onNavigate?.("/features")}
          >
            <Search className="h-4 w-4" />
            Explore features
          </Button>
          <Button className="gap-2" onClick={() => onNavigate?.("/")}>
            <Home className="h-4 w-4" />
            Go home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
