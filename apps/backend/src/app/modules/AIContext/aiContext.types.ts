export interface PaperContext {
  type: "paper";
  paper: {
    id: string;
    title: string;
    abstract: string | null;
    authors: string[];
    tags: string[];
    doi: string | null;
    language: string | null;
    processingStatus: string;
  };
  aiSummary: string | null;
  aiKeyPoints: Array<{ content: string; category: string | null }>;
  chunkCount: number;
  sampleText: string;
  workspace: {
    id: string;
    name: string;
    aiFeaturesEnabled: boolean;
  };
  annotationsCount: number;
  notesCount: number;
  relatedPapers: Array<{ id: string; title: string }>;
}

export interface WorkspaceContext {
  type: "workspace";
  workspace: {
    id: string;
    name: string;
    description: string | null;
    goals: string | null;
  };
  memberCount: number;
  paperCount: number;
  recentPapers: Array<{ id: string; title: string }>;
  recentActivity: string;
}

export interface DashboardContext {
  type: "dashboard";
  user: {
    name: string | null;
    email: string;
    role: string;
  };
  recentPapers: Array<{ id: string; title: string }>;
  activeWorkspaces: Array<{ id: string; name: string }>;
  unreadNotifications: number;
}

export type AiContext = PaperContext | WorkspaceContext | DashboardContext;

export type AiContextInput =
  | { type: "paper"; id: string; userId: string }
  | { type: "workspace"; id: string; userId: string }
  | { type: "dashboard"; userId: string };

export interface ContextInjectionResult {
  systemPrompt: string;
  userContext: string;
  tokenEstimate: number;
}
