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
      className="relative mt-24 border-t bg-gradient-to-b from-muted/30 via-muted/50 to-muted/80"
      aria-labelledby="footer-heading"
    >
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent_85%)] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/20),transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-14">
          <div className="md:col-span-4 lg:col-span-5">
            <h3
              id="footer-heading"
              className="font-bold text-xl tracking-tight flex items-center gap-2"
            >
              <Shield className="h-5 w-5 text-primary" /> ScholarFlow
              <Shield className="h-6 w-6 text-primary" />{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text font-bold">
                ScholarFlow
              </span>
            </h3>
            <p className="mt-4 text-sm text-muted-foreground/90 leading-relaxed max-w-sm">
              AI-powered research paper collaboration. Organize, annotate, and
              surface insight faster with semantic tooling.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border bg-background/60 backdrop-blur hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border bg-background/60 backdrop-blur hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.heading} className="space-y-4">
                <h4 className="text-xs font-semibold tracking-wide uppercase text-primary/80">
                  {section.heading}
                </h4>
                <ul className="space-y-3 text-sm">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="relative text-muted-foreground/80 hover:text-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded px-1 py-1 hover:translate-x-1 after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-primary/70 after:to-primary/30 hover:after:scale-x-100 after:transition-transform after:duration-300"
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
        <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-muted-foreground/70 pt-8 border-t border-border/50">
          <p>© {new Date().getFullYear()} ScholarFlow. All rights reserved.</p>
          <p className="flex items-center gap-1.5 opacity-90">
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-primary animate-pulse" /> for
            researchers.{" "}
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Phase 1 MVP
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
