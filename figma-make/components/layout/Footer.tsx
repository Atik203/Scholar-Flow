"use client";
import {
  AlertCircle,
  ChevronUp,
  Github,
  Heart,
  Key,
  Loader,
  Mail,
  MoreHorizontal,
  Shield,
  Twitter,
  X,
} from "lucide-react";
import { useState } from "react";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);

  const quickNavSections = [
    {
      heading: "Auth",
      links: [
        { label: "Forgot Password", href: "/forgot-password", icon: Key },
        { label: "Reset Password", href: "/reset-password", icon: Key },
        { label: "Verify Email", href: "/verify-email", icon: Mail },
      ],
    },
    {
      heading: "Utility",
      links: [
        { label: "404 Page", href: "/not-found", icon: AlertCircle },
        { label: "Error Page", href: "/error", icon: AlertCircle },
        { label: "Loading", href: "/loading", icon: Loader },
      ],
    },
  ];

  const sections = [
    {
      heading: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "How it works", href: "/how-it-works" },
        { label: "Pricing", href: "/pricing" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Changelog", href: "/changelog" },
        { label: "Status", href: "/status" },
        { label: "Docs", href: "/docs" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Security", href: "/security" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/legal/privacy" },
        { label: "Terms", href: "/legal/terms" },
        { label: "Cookies", href: "/legal/cookies" },
        { label: "License", href: "/license" },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 border-t bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(249,115,22,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-14">
          {/* Logo and description */}
          <div className="md:col-span-4 lg:col-span-5">
            <button
              onClick={() => onNavigate?.("/")}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-[var(--chart-1)] flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ScholarFlow</span>
            </button>
            <p className="mt-6 text-sm text-gray-400 leading-relaxed max-w-sm">
              AI-powered research paper collaboration. Organize, annotate, and
              surface insight faster with semantic tooling.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://github.com"
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <Github className="h-5 w-5 text-gray-300" />
              </a>
              <a
                href="https://twitter.com"
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <Twitter className="h-5 w-5 text-gray-300" />
              </a>
            </div>
          </div>

          {/* Link sections */}
          <div className="mt-12 md:mt-0 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {sections.map((section) => (
              <div key={section.heading} className="space-y-4">
                <h4 className="text-sm font-semibold tracking-wide uppercase text-primary">
                  {section.heading}
                </h4>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <button
                        onClick={() => onNavigate?.(link.href)}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs pt-8 border-t border-gray-700">
          <p className="text-gray-400">
            © {new Date().getFullYear()} ScholarFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {/* Quick Navigation Button */}
            <div className="relative">
              <button
                onClick={() => setIsQuickNavOpen(!isQuickNavOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200 text-gray-400 hover:text-gray-300"
                title="More pages"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="text-[10px]">More</span>
                <ChevronUp
                  className={`h-3 w-3 transition-transform duration-200 ${
                    isQuickNavOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Quick Navigation Modal */}
              {isQuickNavOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsQuickNavOpen(false)}
                  />
                  {/* Modal */}
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-800/50">
                      <span className="text-[11px] font-medium text-gray-300">
                        Quick Navigation
                      </span>
                      <button
                        onClick={() => setIsQuickNavOpen(false)}
                        className="p-0.5 rounded hover:bg-gray-700 transition-colors"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {quickNavSections.map((section, idx) => (
                        <div key={section.heading}>
                          {idx > 0 && (
                            <div className="border-t border-gray-700/50" />
                          )}
                          <div className="px-3 py-1.5 bg-gray-800/30">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                              {section.heading}
                            </span>
                          </div>
                          <div className="py-1">
                            {section.links.map((link) => {
                              const Icon = link.icon;
                              return (
                                <button
                                  key={link.href}
                                  onClick={() => {
                                    onNavigate?.(link.href);
                                    setIsQuickNavOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-left"
                                >
                                  <Icon className="h-3 w-3 text-gray-500" />
                                  {link.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <p className="flex items-center gap-1.5 text-gray-400">
              Built with <Heart className="h-3.5 w-3.5 text-primary" /> for
              researchers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
