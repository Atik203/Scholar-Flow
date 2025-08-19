"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export default function Home() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Scholar‑Flow</h1>
        <p className="text-muted-foreground text-lg">
          AI-powered research paper collaboration. Upload, search, annotate –
          rapidly iterate on literature reviews with semantic intelligence.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {session ? (
          <Button onClick={() => window.location.assign("/dashboard")}>
            Enter Dashboard
          </Button>
        ) : (
          <Button onClick={() => signIn()}>Get Started</Button>
        )}
        <Button variant="outline" onClick={toggleTheme}>
          Toggle {theme === "dark" ? "Light" : "Dark"} Mode
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
        {[
          ["Upload", "Secure PDF ingestion (future OCR + embeddings)."],
          ["Organize", "Collections keep focus while researching."],
          ["Search", "Semantic retrieval coming soon via pgvector."],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-lg border p-5 text-left bg-card/50"
          >
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-8">
        Phase 1 MVP • Feature flags control unfinished surfaces.
      </p>
    </div>
  );
}
