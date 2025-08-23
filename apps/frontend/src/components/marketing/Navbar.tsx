"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const navItems = [
  { label: "Features", href: "features" },
  { label: "How it works", href: "how-it-works" },
  { label: "Pricing", href: "pricing" },
  { label: "FAQ", href: "faq" },
  { label: "Contact", href: "contact" },
  { label: "About", href: "about" },
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="relative font-bold text-xl tracking-tight group transition-all duration-300"
        >
          <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text group-hover:scale-105 transition-transform duration-300 inline-block font-bold">
            ScholarFlow
          </span>
          <span className="absolute -inset-x-2 -bottom-1 top-1 rounded-md opacity-0 group-hover:opacity-20 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent blur-sm transition-all duration-300" />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={
                  "relative px-3 py-2 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group hover:bg-primary/5 " +
                  (active === item.href
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={
                    "pointer-events-none absolute inset-x-2 bottom-1 h-0.5 origin-left bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-300 " +
                    (active === item.href
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100")
                  }
                />
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </li>
          ))}
        </ul>
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          aria-label="Toggle color theme"
          className="w-9 px-0 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
        >
          <span aria-hidden className="text-base">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
        </Button>
        {session ? (
          <Button asChild size="sm">
            <Link href="/dashboard">Dashboard →</Link>
          </Button>
        ) : (
          <Button size="sm" onClick={() => signIn()}>
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};
