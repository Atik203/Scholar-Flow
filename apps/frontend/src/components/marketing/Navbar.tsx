"use client";
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
      className="fixed top-0 inset-x-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50"
      aria-label="Main"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            Scholar-<span className="text-primary">Flow</span>
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
          <button
            onClick={toggleTheme}
            className="text-xs md:text-sm px-2 py-1 rounded border hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium shadow hover:shadow-md transition-shadow"
            >
              Dashboard →
            </Link>
          ) : (
            <button
              onClick={() => signIn()}
              className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium shadow hover:shadow-md transition-shadow"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
