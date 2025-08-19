import { Github, Heart, Shield, Twitter } from "lucide-react";
import React from "react";

const sections: {
  heading: string;
  links: { label: string; href: string }[];
}[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
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
      className="relative border-t mt-24 bg-gradient-to-b from-background via-background to-muted/30"
      aria-labelledby="footer-heading"
    >
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent_75%)] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-14">
          <div className="md:col-span-4 lg:col-span-5">
            <h3
              id="footer-heading"
              className="font-semibold text-lg tracking-tight flex items-center gap-2"
            >
              <Shield className="h-5 w-5 text-primary" /> Scholar-Flow
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
              AI-powered research paper collaboration. Organize, annotate, and
              surface insight faster with semantic tooling.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border hover:bg-muted transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border hover:bg-muted transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.heading} className="space-y-3">
                <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  {section.heading}
                </h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
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
        <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Scholar-Flow. All rights reserved.
          </p>
          <p className="flex items-center gap-1 opacity-80">
            Built with <Heart className="h-3.5 w-3.5 text-primary" /> for
            researchers. Phase 1 MVP.
          </p>
        </div>
      </div>
    </footer>
  );
};
