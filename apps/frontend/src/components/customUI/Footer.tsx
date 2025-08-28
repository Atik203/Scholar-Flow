import { PageContainer } from "@/components/layout/PageContainer";
import { Github, Heart, Shield, Twitter } from "lucide-react";
import React from "react";

const sections: {
  heading: string;
  links: { label: string; href: string }[];
}[] = [
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

export const Footer: React.FC = () => {
  return (
    <footer
      className="relative mt-24 border-t bg-gradient-to-b from-slate-900 via-slate-950 to-black dark:from-slate-950 dark:via-black dark:to-slate-950"
      aria-labelledby="footer-heading"
    >
      {/* Enhanced background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,theme(colors.primary/15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,theme(colors.chart-1/10),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-slate-900/50 dark:to-slate-950/50" />
      <PageContainer className="py-16 relative">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-14">
          <div className="md:col-span-4 lg:col-span-5">
            <h3
              id="footer-heading"
              className="font-bold tracking-tight flex items-center gap-2 sm:gap-3"
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-white dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent font-bold text-lg sm:text-xl md:text-2xl">
                ScholarFlow
              </span>
            </h3>
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed max-w-sm">
              AI-powered research paper collaboration. Organize, annotate, and
              surface insight faster with semantic tooling.
            </p>
            <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 inline-flex items-center justify-center rounded-lg border border-slate-700 dark:border-slate-600 bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur hover:bg-primary/20 hover:border-primary/50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 inline-flex items-center justify-center rounded-lg border border-slate-700 dark:border-slate-600 bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur hover:bg-primary/20 hover:border-primary/50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.heading} className="space-y-4">
                <h4 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-primary">
                  {section.heading}
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="relative text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded px-1 py-1 hover:translate-x-1 after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-primary/70 after:to-primary/30 hover:after:scale-x-100 after:transition-transform after:duration-300"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 sm:mt-20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs pt-6 sm:pt-8 border-t border-slate-700 dark:border-slate-600">
          <p className="text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} ScholarFlow. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-primary animate-pulse" /> for
            researchers.{" "}
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
              Phase 1 MVP
            </span>
          </p>
        </div>
      </PageContainer>
    </footer>
  );
};
