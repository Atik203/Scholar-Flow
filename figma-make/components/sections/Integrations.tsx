"use client";
import { ArrowRight, Check, Link2, Puzzle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";

const integrations = [
  {
    name: "Zotero",
    description: "Sync your entire Zotero library with one click",
    icon: "📚",
    color: "from-red-500 to-rose-500",
    category: "Reference Managers",
    status: "available",
    features: ["Two-way sync", "Folder preservation", "Tag import"],
  },
  {
    name: "Mendeley",
    description: "Import papers and annotations seamlessly",
    icon: "📖",
    color: "from-red-600 to-orange-500",
    category: "Reference Managers",
    status: "available",
    features: ["Full library import", "PDF annotations", "Groups sync"],
  },
  {
    name: "EndNote",
    description: "Transfer your EndNote database effortlessly",
    icon: "📝",
    color: "from-blue-600 to-blue-400",
    category: "Reference Managers",
    status: "available",
    features: ["XML import", "Citation styles", "Smart groups"],
  },
  {
    name: "Google Scholar",
    description: "Search and import papers directly from Scholar",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
    category: "Search",
    status: "available",
    features: ["One-click save", "Citation metrics", "Related papers"],
  },
  {
    name: "Semantic Scholar",
    description: "AI-powered paper recommendations",
    icon: "🧠",
    color: "from-purple-500 to-pink-500",
    category: "Search",
    status: "available",
    features: ["AI recommendations", "Citation graphs", "Author profiles"],
  },
  {
    name: "arXiv",
    description: "Direct import from arXiv preprints",
    icon: "📄",
    color: "from-red-500 to-red-600",
    category: "Repositories",
    status: "available",
    features: ["Auto-import", "Version tracking", "Categories"],
  },
  {
    name: "Notion",
    description: "Export notes and summaries to Notion",
    icon: "📋",
    color: "from-gray-700 to-gray-900",
    category: "Productivity",
    status: "coming-soon",
    features: ["Database sync", "Rich text", "Templates"],
  },
  {
    name: "Slack",
    description: "Share papers and insights with your team",
    icon: "💬",
    color: "from-purple-600 to-pink-500",
    category: "Communication",
    status: "coming-soon",
    features: ["Paper sharing", "Notifications", "Bot commands"],
  },
  {
    name: "Overleaf",
    description: "Insert citations directly into LaTeX documents",
    icon: "🍃",
    color: "from-green-600 to-green-400",
    category: "Writing",
    status: "coming-soon",
    features: ["BibTeX export", "Citation insert", "Auto-format"],
  },
];

const categories = ["All", ...new Set(integrations.map((i) => i.category))];

export const Integrations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredIntegrations =
    activeCategory === "All"
      ? integrations
      : integrations.filter((i) => i.category === activeCategory);

  return (
    <section
      id="integrations"
      className="py-32 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative overflow-hidden"
      aria-labelledby="integrations-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,var(--primary)_0%,transparent_40%)] opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,var(--chart-1)_0%,transparent_40%)] opacity-5" />

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Puzzle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Powerful Integrations</span>
          </motion.div>

          <h2
            id="integrations-heading"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Connect with your{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              favorite tools
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ScholarFlow integrates seamlessly with the tools you already use.
            Import your existing library and start collaborating instantly.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card border border-border hover:border-primary/30 hover:bg-card/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredCard(integration.name)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative"
            >
              <div
                className={`relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden ${
                  hoveredCard === integration.name
                    ? "border-primary/40 bg-gradient-to-br from-card to-card/80 shadow-xl shadow-primary/10"
                    : "border-border/50 bg-card/50 hover:bg-card/80"
                }`}
              >
                {/* Hover gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  {integration.status === "available" ? (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                      <Check className="h-3 w-3" />
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                      <RefreshCw className="h-3 w-3" />
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {integration.icon}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {integration.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {integration.status === "available"
                    ? "Connect now"
                    : "Get notified"}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-chart-1/5 to-purple-500/5 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {["📚", "🎓", "📄"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-card border-2 border-background flex items-center justify-center text-lg"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Don't see your tool?</h3>
                <p className="text-sm text-muted-foreground">
                  Request an integration and we'll prioritize it
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-medium shadow-lg shadow-primary/25"
            >
              <Link2 className="h-4 w-4" />
              Request Integration
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
