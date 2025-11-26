"use client";
import { Github, Heart, Shield, Twitter } from "lucide-react";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
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
          <p className="flex items-center gap-1.5 text-gray-400">
            Built with <Heart className="h-3.5 w-3.5 text-primary" /> for
            researchers.
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
              Phase 1 MVP
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
