"use client";

import {
  Activity,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Highlighter,
  MessageSquare,
  Quote,
  TextCursor,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

interface ResearchPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Research Tool Data
// ============================================================================
const researchTools = [
  {
    title: "Citations & References",
    description:
      "Export citations in 7 academic formats, manage export history",
    icon: Quote,
    href: "/research/citations",
    color:
      "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800",
    features: ["7 Formats", "Export History", "Batch Export"],
    subRoutes: [
      {
        title: "Export Citations",
        href: "/research/citations/export",
        icon: Download,
      },
      {
        title: "Export History",
        href: "/research/citations/history",
        icon: Calendar,
      },
      {
        title: "Format Guide",
        href: "/research/citations/formats",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Research Discussions",
    description: "Threaded discussions for papers, collections, and workspaces",
    icon: MessageSquare,
    href: "/research/discussions",
    color:
      "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
    features: ["Threaded", "Real-time", "Collaboration"],
    subRoutes: [
      {
        title: "Create Discussion",
        href: "/research/discussions/create",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Activity Log",
    description: "Comprehensive activity tracking with filtering and export",
    icon: Activity,
    href: "/research/activity-log",
    color:
      "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
    features: ["Real-time", "Filtering", "Export"],
    subRoutes: [
      {
        title: "Export Log",
        href: "/research/activity-log/export",
        icon: Download,
      },
    ],
  },
  {
    title: "PDF Annotations",
    description: "Annotate and highlight important sections in PDFs",
    icon: Highlighter,
    href: "/research/annotations",
    color:
      "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800",
    features: ["PDF View", "Highlights", "Comments"],
  },
  {
    title: "Text Editor",
    description: "Create and edit research papers with our rich text editor",
    icon: FileText,
    href: "/research/editor",
    color:
      "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-800",
    features: ["Rich Text", "Auto-save", "Collaboration"],
  },
  {
    title: "PDF Text Extraction",
    description: "Extract and process text from PDF documents",
    icon: TextCursor,
    href: "/research/pdf-extraction",
    color:
      "bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800",
    features: ["OCR", "Text Processing", "Metadata"],
  },
];

// ============================================================================
// Research Tool Card Component
// ============================================================================
interface ResearchToolCardProps {
  tool: (typeof researchTools)[0];
}

const ResearchToolCard: React.FC<ResearchToolCardProps> = ({ tool }) => {
  const IconComponent = tool.icon;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
      className={cn(
        "rounded-xl border p-4 transition-all cursor-pointer",
        tool.color
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white dark:bg-background shadow-sm">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">{tool.title}</h3>
      </div>

      {/* Description */}
      <p className="text-base text-muted-foreground mb-4">{tool.description}</p>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tool.features.map((feature, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-white/60 dark:bg-background/60 rounded-md text-xs font-medium"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Main Action */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium"
      >
        Open {tool.title}
      </motion.button>

      {/* Sub Routes */}
      {tool.subRoutes && (
        <div className="mt-4 space-y-1">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Quick Actions:
          </div>
          {tool.subRoutes.map((subRoute, index) => {
            const SubIcon = subRoute.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ x: 4 }}
                className="w-full py-1.5 px-3 text-left text-xs flex items-center gap-2 rounded-md hover:bg-white/40 dark:hover:bg-background/40 transition-colors"
              >
                <SubIcon className="h-3 w-3" />
                {subRoute.title}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// Feature Highlight Card Component
// ============================================================================
interface FeatureHighlightProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  gradient: string;
  badges: string[];
  badgeColor: string;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  title,
  description,
  icon: IconComponent,
  iconColor,
  gradient,
  badges,
  badgeColor,
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn("rounded-xl border p-4", gradient)}
  >
    <div className="flex items-center gap-2 mb-2">
      <IconComponent className={cn("h-5 w-5", iconColor)} />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <span
          key={index}
          className={cn("px-2 py-1 rounded-md text-xs font-medium", badgeColor)}
        >
          {badge}
        </span>
      ))}
    </div>
  </motion.div>
);

// ============================================================================
// Research Page Component
// ============================================================================
export function ResearchPage({
  onNavigate,
  role: propRole,
}: ResearchPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research"
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Research Tools</h1>
          <p className="text-muted-foreground">
            Access all your research tools in one place. Create papers, extract
            text, manage citations, and more.
          </p>
        </div>

        {/* Research Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchTools.map((tool) => (
            <ResearchToolCard key={tool.title} tool={tool} />
          ))}
        </div>

        {/* Latest Features Section */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-6">Latest Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureHighlight
              title="Citation Export System"
              description="Export citations in 7 academic formats with batch processing and history tracking"
              icon={Quote}
              iconColor="text-purple-600"
              gradient="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/30 dark:to-blue-950/30 dark:border-purple-800"
              badges={["BibTeX", "APA", "MLA", "+4 more"]}
              badgeColor="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
            />

            <FeatureHighlight
              title="Threaded Discussions"
              description="Real-time collaboration with threaded conversations for papers and collections"
              icon={MessageSquare}
              iconColor="text-blue-600"
              gradient="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/30 dark:to-cyan-950/30 dark:border-blue-800"
              badges={["Real-time", "Threaded", "Collaboration"]}
              badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
            />

            <FeatureHighlight
              title="Activity Logging"
              description="Comprehensive activity tracking with advanced filtering and export capabilities"
              icon={Activity}
              iconColor="text-green-600"
              gradient="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800"
              badges={["Real-time", "Filtering", "Export"]}
              badgeColor="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
            />
          </div>
        </div>

        {/* Collaboration CTA */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border rounded-xl p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                Collaborate with Your Team
              </h3>
              <p className="text-muted-foreground">
                Invite colleagues to your workspace and collaborate on research
                in real-time.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Invite Team
          </motion.button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default ResearchPage;
