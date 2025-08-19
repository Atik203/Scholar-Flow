import React from "react";

const footerLinks = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Security", href: "/security" },
  { label: "Changelog", href: "/changelog" },
  { label: "Status", href: "#" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="border-t py-12 mt-20" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h3
              id="footer-heading"
              className="font-semibold text-lg tracking-tight"
            >
              Scholar-Flow
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              AI-powered research paper collaboration. Built for rigorous teams
              who ship insight.
            </p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Scholar-Flow. All rights reserved.
          </p>
          <p className="opacity-70">
            Phase 1 MVP • Roadmap-driven development.
          </p>
        </div>
      </div>
    </footer>
  );
};
