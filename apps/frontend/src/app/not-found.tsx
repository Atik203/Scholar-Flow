import { Button } from "@/components/ui/button";
import { FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted/50 border border-border flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/features">
              <Search className="h-4 w-4" />
              Explore features
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
