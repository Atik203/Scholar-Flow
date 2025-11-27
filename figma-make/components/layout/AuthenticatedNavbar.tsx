"use client";
import {
  BookMarked,
  BookOpen,
  Building2,
  ChevronDown,
  FileText,
  HelpCircle,
  Lightbulb,
  Menu,
  MessageSquare,
  Moon,
  Newspaper,
  Phone,
  Sun,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { UserMenu } from "./DashboardLayout";

// Role types
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface UserInfo {
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}

// Navigation structure with dropdowns - exact copy from Navbar
const navigationItems = [
  {
    label: "Products",
    href: "#",
    dropdown: true,
    items: [
      {
        label: "Research Papers",
        href: "/products/papers",
        description: "Discover and organize academic papers",
        icon: FileText,
      },
      {
        label: "Collections",
        href: "/products/collections",
        description: "Create and share paper collections",
        icon: BookOpen,
      },
      {
        label: "Collaboration",
        href: "/products/collaborate",
        description: "Work together on research projects",
        icon: Users,
      },
      {
        label: "AI Insights",
        href: "/products/ai-insights",
        description: "AI-powered research analysis",
        icon: Lightbulb,
      },
    ],
  },
  {
    label: "Resources",
    href: "#",
    dropdown: true,
    items: [
      {
        label: "Documentation",
        href: "/resources/docs",
        description: "Complete API and usage guides",
        icon: BookMarked,
      },
      {
        label: "Tutorials",
        href: "/resources/tutorials",
        description: "Step-by-step learning resources",
        icon: HelpCircle,
      },
      {
        label: "API Reference",
        href: "/resources/api",
        description: "Developer API documentation",
        icon: BookOpen,
      },
      {
        label: "Community",
        href: "/resources/community",
        description: "Connect with other researchers",
        icon: Users,
      },
    ],
  },
  {
    label: "Company",
    href: "#",
    dropdown: true,
    items: [
      {
        label: "About Us",
        href: "/company/about",
        description: "Learn about our mission and team",
        icon: Building2,
      },
      {
        label: "Careers",
        href: "/company/careers",
        description: "Join our growing team",
        icon: Users,
      },
      {
        label: "Contact",
        href: "/company/contact",
        description: "Get in touch with our team",
        icon: Phone,
      },
      {
        label: "Press & News",
        href: "/company/press",
        description: "Latest news and media resources",
        icon: Newspaper,
      },
    ],
  },
  {
    label: "Enterprise",
    href: "#",
    dropdown: true,
    items: [
      {
        label: "Enterprise Solutions",
        href: "/enterprise",
        description: "Scalable solutions for organizations",
        icon: Building2,
      },
      {
        label: "Team Management",
        href: "/enterprise/teams",
        description: "Advanced team collaboration tools",
        icon: Users,
      },
      {
        label: "Custom Integrations",
        href: "/enterprise/integrations",
        description: "Integrate with your existing tools",
        icon: BookOpen,
      },
      {
        label: "Dedicated Support",
        href: "/enterprise/support",
        description: "24/7 priority support for enterprise",
        icon: MessageSquare,
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

// Mock user for demo
const mockUser: UserInfo = {
  name: "John Doe",
  email: "john.doe@example.com",
  image: undefined,
  role: "researcher",
};

interface AuthenticatedNavbarProps {
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
  user?: UserInfo;
}

export const AuthenticatedNavbar: React.FC<AuthenticatedNavbarProps> = ({
  onNavigate,
  onSignOut,
  user = mockUser,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  const handleDropdownMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setHoveredDropdown(label);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigation = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
    setMobileOpen(false);
  };

  const renderNavItem = (item: (typeof navigationItems)[0]) => {
    if (item.dropdown && item.items) {
      const isOpen = hoveredDropdown === item.label;

      return (
        <li key={item.label} className="relative">
          <button
            className="relative px-2.5 py-1.5 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group hover:bg-primary/5 text-muted-foreground hover:text-foreground flex items-center"
            onMouseEnter={() => handleDropdownMouseEnter(item.label)}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {item.label}
            <ChevronDown
              className={`ml-1 h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-80 p-2 bg-popover border border-border rounded-lg shadow-xl z-50"
                onMouseEnter={() => handleDropdownMouseEnter(item.label)}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="grid gap-1">
                  {item.items.map((dropdownItem) => (
                    <a
                      key={dropdownItem.href}
                      href={dropdownItem.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(dropdownItem.href);
                      }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                    >
                      <dropdownItem.icon className="h-5 w-5 text-primary mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                          {dropdownItem.label}
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5 group-hover:text-foreground/80 transition-colors duration-200">
                          {dropdownItem.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      );
    }

    return (
      <li key={item.href}>
        <a
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(item.href);
          }}
          className="relative px-2.5 py-1.5 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group hover:bg-primary/5 text-muted-foreground hover:text-foreground"
        >
          <span className="relative z-10">{item.label}</span>
          <span className="pointer-events-none absolute inset-x-2 bottom-1 h-0.5 origin-left bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-300 scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100" />
          <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </li>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 h-12 sm:h-13 md:h-14 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="lg:hidden inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-primary/5 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            )}
          </button>

          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/");
            }}
            className="relative font-bold tracking-tight group transition-all duration-300"
          >
            <span className="bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block font-bold text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl">
              ScholarFlow
            </span>
            <span className="absolute -inset-x-2 -bottom-1 top-1 rounded-md opacity-0 group-hover:opacity-20 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent blur-sm transition-all duration-300" />
          </a>
        </div>

        {/* Centered Navigation */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex items-center justify-center gap-5 text-sm">
            {navigationItems.map(renderNavItem)}
          </ul>
        </div>

        {/* Right side actions - Theme toggle & User Menu (instead of Get Started) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme toggle */}
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            aria-label="Toggle color theme"
            className="relative w-8 h-8 sm:w-9 sm:h-9 px-0 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
          >
            <Sun
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all ${theme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`}
              aria-hidden
            />
            <Moon
              className={`absolute h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
              aria-hidden
            />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu (replaces Get Started button) */}
          <UserMenu user={user} onNavigate={onNavigate} onSignOut={onSignOut} />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute inset-x-0 top-full z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
          >
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-2">
              <ul className="grid gap-1">
                {navigationItems.map((item) => {
                  if (item.dropdown && item.items) {
                    return (
                      <li key={item.label}>
                        <div className="px-3 py-2 text-sm font-medium text-foreground border-b border-border/20">
                          {item.label}
                        </div>
                        <ul className="ml-4 mt-1 space-y-1">
                          {item.items.map((dropdownItem) => (
                            <li key={dropdownItem.href}>
                              <a
                                href={dropdownItem.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNavigation(dropdownItem.href);
                                }}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-primary/5 hover:scale-[1.02] text-muted-foreground hover:text-foreground cursor-pointer group"
                              >
                                <dropdownItem.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                                {dropdownItem.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.href);
                        }}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-primary/5 hover:scale-[1.02] cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
