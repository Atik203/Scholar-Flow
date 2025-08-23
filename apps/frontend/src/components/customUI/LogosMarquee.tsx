"use client";
import {
  Chrome,
  Cloud,
  Cpu,
  Database,
  Figma,
  GitBranch,
  Github,
  Shield,
  Slack,
  Zap,
} from "lucide-react";
import React from "react";
import Marquee from "react-fast-marquee";

const companies = [
  { icon: Github, name: "GitHub", color: "text-gray-900 dark:text-gray-100" },
  { icon: Chrome, name: "Google", color: "text-blue-600 dark:text-blue-400" },
  { icon: Slack, name: "Slack", color: "text-purple-600 dark:text-purple-400" },
  { icon: Figma, name: "Figma", color: "text-pink-600 dark:text-pink-400" },
  {
    icon: GitBranch,
    name: "GitLab",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    icon: Database,
    name: "MongoDB",
    color: "text-green-600 dark:text-green-400",
  },
  { icon: Cloud, name: "AWS", color: "text-yellow-600 dark:text-yellow-400" },
  { icon: Cpu, name: "Intel", color: "text-blue-700 dark:text-blue-300" },
  { icon: Zap, name: "Vercel", color: "text-gray-900 dark:text-gray-100" },
  {
    icon: Shield,
    name: "Security Co",
    color: "text-red-600 dark:text-red-400",
  },
];

export const LogosMarquee: React.FC = () => {
  return (
    <section
      className="py-16 relative overflow-hidden"
      aria-label="Trusted by companies"
    >
      {/* Subtle background enhancement */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center text-xs uppercase tracking-wider text-muted-foreground/80 mb-6">
          Trusted by research teams at
        </div>
        <div className="overflow-hidden rounded-md border bg-card/60 backdrop-blur-sm">
          <Marquee speed={40} gradient={false} className="py-6" pauseOnHover>
            {companies.map((company, i) => {
              const IconComponent = company.icon;
              return (
                <div
                  key={`${company.name}-${i}`}
                  className="flex items-center gap-3 mx-8 opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <IconComponent
                    className={`h-8 w-8 ${company.color}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {company.name}
                  </span>
                </div>
              );
            })}
          </Marquee>
        </div>
      </div>
    </section>
  );
};
