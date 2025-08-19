"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const [active, setActive] = useState<string>("#features");

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash;
      if (hash) setActive(hash);
    };
    handler();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-40 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/40 bg-[linear-gradient(135deg,var(--primary)/18_0%,transparent_55%),linear-gradient(to_right,var(--background),var(--background))] after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_60%_0%,theme(colors.primary/15),transparent_70%)]"
      aria-label="Main"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="relative font-semibold text-lg tracking-tight group"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 group-hover:from-primary/90 group-hover:to-primary/70 transition-colors">
              ScholarFlow
            </span>
            <span className="absolute -inset-x-2 -bottom-1 top-1 rounded-md opacity-0 group-hover:opacity-10 bg-primary/40 blur-md transition-opacity" />
          </Link>
          <ul className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={
                    "relative px-1 py-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group " +
                    (active === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <span>{item.label}</span>
                  <span
                    className={
                      "pointer-events-none absolute inset-x-1 bottom-0 h-0.5 origin-left bg-gradient-to-r from-primary via-primary/70 to-primary/40 transition-transform " +
                      (active === item.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100")
                    }
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            aria-label="Toggle color theme"
            className="w-9 px-0"
          >
            <span aria-hidden>{theme === "dark" ? "☀️" : "🌙"}</span>
          </Button>
          {session ? (
            <Button asChild size="sm" variant="gradient">
              <Link href="/dashboard">Dashboard →</Link>
            </Button>
          ) : (
            <Button size="sm" variant="gradient" onClick={() => signIn()}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
