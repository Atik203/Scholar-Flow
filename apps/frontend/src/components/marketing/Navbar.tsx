"use client";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8 h-12 md:h-14 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-primary/5 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
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
        <div className="flex items-center gap-2 md:gap-3">
          <ul className="hidden lg:flex items-center gap-5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    "relative px-2.5 py-1.5 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group hover:bg-primary/5 " +
                    (pathname === item.href
                      ? "text-primary font-medium bg-primary/10"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className={
                      "pointer-events-none absolute inset-x-2 bottom-1 h-0.5 origin-left bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-300 " +
                      (pathname === item.href
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100")
                    }
                  />
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            ))}
          </ul>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            aria-label="Toggle color theme"
            className="w-9 h-9 px-0 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" aria-hidden />
            ) : (
              <Moon className="h-4 w-4" aria-hidden />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {session ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard →</Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              variant="gradient"
              className="btn-hover-glow btn-shine shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden absolute inset-x-0 top-full z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <nav className="mx-auto max-w-[1440px] px-3 py-2">
            <ul className="grid gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-primary/5 " +
                      (pathname === item.href
                        ? "text-primary font-medium bg-primary/10"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
