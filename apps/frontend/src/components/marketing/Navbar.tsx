"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

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
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50 after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-b after:from-primary/10 after:to-transparent"
      aria-label="Main"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-xl tracking-tight">
            ScholarFlow
          </Link>
          <ul className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
                >
                  {item.label}
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
            <Button size="sm" onClick={() => signIn()}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
