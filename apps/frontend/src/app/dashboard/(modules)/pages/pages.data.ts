export interface ResearcherPageAction {
  label: string;
  path: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
}

export interface ResearcherPageDefinition {
  id: string;
  title: string;
  summary: string;
  status: string;
  updatedAt: string;
  highlights: string[];
  actions: ResearcherPageAction[];
}

export const RESEARCHER_PAGES: ReadonlyArray<ResearcherPageDefinition> = [
  {
    id: "workspace-overview",
    title: "Workspace Overview",
    summary:
      "Track papers, collections, and collaborators for your active workspace.",
    status: "Updated",
    updatedAt: "2 hours ago",
    highlights: [
      "Workspace-wide metrics refreshed every hour",
      "Quick links to papers, collections, and collaborators",
      "Role-aware recommendations based on workspace membership",
    ],
    actions: [
      { label: "Open workspace", path: "/workspaces" },
      { label: "View analytics", path: "/analytics" },
    ],
  },
  {
    id: "reading-queue",
    title: "Reading Queue",
    summary:
      "Prioritize upcoming papers with AI-generated summaries and due dates.",
    status: "New",
    updatedAt: "Today",
    highlights: [
      "Auto-generated reading order",
      "Smart reminders via email and in-app notifications",
      "Link highlights directly to notes and collections",
    ],
    actions: [
      { label: "Manage queue", path: "/papers" },
      { label: "Create reminder", path: "/collections" },
    ],
  },
  {
    id: "annotations",
    title: "Annotations",
    summary:
      "Review highlights and notes across PDFs and collaborative documents.",
    status: "Synced",
    updatedAt: "Yesterday",
    highlights: [
      "Filter annotations by collaborator or tag",
      "Export annotations into research summaries",
      "Sync insights into collections and shared workspaces",
    ],
    actions: [
      { label: "Open annotations", path: "/research/annotations" },
      { label: "Share notes", path: "/collaborations/projects" },
    ],
  },
  {
    id: "insights",
    title: "AI Insights",
    summary:
      "Surface trend analysis and recommended citations tailored to the workspace.",
    status: "Beta",
    updatedAt: "This week",
    highlights: [
      "Vector-based similarity to discover adjacent literature",
      "Workspace-scoped recommendations for collaborators",
      "Continuous updates tied to new uploads and feedback",
    ],
    actions: [
      { label: "Open AI Insights", path: "/ai-insights" },
      { label: "Provide feedback", path: "/collaborations/teams" },
    ],
  },
] as const;

export const RESEARCHER_PAGES_BY_ID = RESEARCHER_PAGES.reduce(
  (acc, page) => {
    acc[page.id] = page;
    return acc;
  },
  {} as Record<string, ResearcherPageDefinition>
);
