import prisma from "../../shared/prisma";
import type {
  AiContext,
  AiContextInput,
  PaperContext,
  WorkspaceContext,
  DashboardContext,
  ContextInjectionResult,
} from "./aiContext.types";

const MAX_SAMPLE_TEXT_CHARS = 3000;
const MAX_RELATED_PAPERS = 5;
const MAX_RECENT_PAPERS = 5;

function buildSystemPrompt(
  context: AiContext,
  basePrompt = "You are a helpful research assistant."
): ContextInjectionResult {
  let userContext = "";
  let tokenEstimate = 0;

  if (context.type === "paper") {
    const p = context.paper;
    userContext = `The user is currently viewing a research paper:
Title: ${p.title}
${p.abstract ? `Abstract: ${p.abstract.slice(0, 500)}` : "No abstract available."}
${p.authors.length > 0 ? `Authors: ${p.authors.join(", ")}` : ""}
${p.tags.length > 0 ? `Tags: ${p.tags.join(", ")}` : ""}
Status: ${p.processingStatus}
Language: ${p.language || "unknown"}

`;

    if (context.aiSummary) {
      userContext += `Paper summary: ${context.aiSummary.slice(0, 1000)}\n\n`;
    }

    if (context.aiKeyPoints.length > 0) {
      userContext += `Key points extracted from this paper:\n`;
      for (const kp of context.aiKeyPoints) {
        userContext += `- ${kp.content}\n`;
      }
      userContext += "\n";
    }

    if (context.sampleText) {
      userContext += `Paper text excerpt:\n${context.sampleText.slice(0, MAX_SAMPLE_TEXT_CHARS)}\n\n`;
    }

    userContext += `This paper belongs to workspace: ${context.workspace.name}.\n`;

    if (context.relatedPapers.length > 0) {
      userContext += `Related papers:\n`;
      for (const rp of context.relatedPapers) {
        userContext += `- ${rp.title}\n`;
      }
      userContext += "\n";
    }

    tokenEstimate = Math.ceil(userContext.length / 4);
  } else if (context.type === "workspace") {
    const w = context.workspace;
    userContext = `The user is currently viewing a research workspace:
Name: ${w.name}
${w.description ? `Description: ${w.description}` : ""}
${w.goals ? `Goals: ${w.goals}` : ""}
Members: ${context.memberCount}
Papers: ${context.paperCount}
`;

    if (context.recentPapers.length > 0) {
      userContext += `Recent papers in this workspace:\n`;
      for (const rp of context.recentPapers) {
        userContext += `- ${rp.title}\n`;
      }
      userContext += "\n";
    }

    tokenEstimate = Math.ceil(userContext.length / 4);
  } else {
    const u = context.user;
    userContext = `The user ${u.name ? `(${u.name})` : ""} is on their dashboard.
Role: ${u.role}\n`;

    if (context.recentPapers.length > 0) {
      userContext += `Recent papers:\n`;
      for (const rp of context.recentPapers) {
        userContext += `- ${rp.title}\n`;
      }
      userContext += "\n";
    }

    if (context.activeWorkspaces.length > 0) {
      userContext += `Active workspaces:\n`;
      for (const w of context.activeWorkspaces) {
        userContext += `- ${w.name}\n`;
      }
      userContext += "\n";
    }

    tokenEstimate = Math.ceil(userContext.length / 4);
  }

  const systemPrompt = `${basePrompt}

Current page context (use this to answer naturally without the user needing to repeat information):

${userContext}`;

  return { systemPrompt, userContext, tokenEstimate };
}

async function buildPaperContext(
  paperId: string,
  _userId: string
): Promise<PaperContext> {
  const paper = await prisma.paper.findUnique({
    where: { id: paperId, isDeleted: false },
    include: {
      workspace: { select: { id: true, name: true } },
      chunks: { select: { content: true }, orderBy: { idx: "asc" }, take: 2 },
      annotations: { select: { id: true }, where: { isDeleted: false } },
      researchNotes: { select: { id: true }, where: { isDeleted: false } },
      aiSummaries: { select: { summary: true }, orderBy: { createdAt: "desc" }, take: 1 },
      aiKeyPoints: {
        select: { content: true, category: true },
        where: { isDeleted: false },
        orderBy: { order: "asc" },
      },
      collectionJoins: {
        select: {
          collection: {
            select: {
              papers: {
                select: { paper: { select: { id: true, title: true } } },
                where: { paperId: { not: paperId } },
                take: MAX_RELATED_PAPERS,
              },
            },
          },
        },
        take: 1,
      },
    },
  }) as Record<string, any> | null;

  if (!paper) throw new Error("Paper not found");

  const summary = paper.aiSummaries?.[0]?.summary || null;
  const sampleText = (paper.chunks as any[])
    ?.map((c: any) => c.content)
    .join("\n")
    .slice(0, MAX_SAMPLE_TEXT_CHARS);

  const relatedPapers =
    paper.collectionJoins?.[0]?.collection?.papers?.map((cp: any) => ({
      id: cp.paper.id,
      title: cp.paper.title,
    })) || [];

  return {
    type: "paper",
    paper: {
      id: paper.id,
      title: paper.title,
      abstract: paper.abstract,
      authors: (paper.metadata as any)?.authors || [],
      tags: paper.tags,
      doi: paper.doi,
      language: paper.language,
      processingStatus: paper.processingStatus,
    },
    aiSummary: summary,
    aiKeyPoints: (paper.aiKeyPoints || []).map((kp: any) => ({
      content: kp.content,
      category: kp.category,
    })),
    chunkCount: paper.chunks?.length || 0,
    sampleText,
    workspace: {
      id: paper.workspace.id,
      name: paper.workspace.name,
      aiFeaturesEnabled: true,
    },
    annotationsCount: paper.annotations?.length || 0,
    notesCount: paper.researchNotes?.length || 0,
    relatedPapers,
  };
}

async function buildWorkspaceContext(
  workspaceId: string,
  _userId: string
): Promise<WorkspaceContext> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId, isDeleted: false },
    include: {
      _count: { select: { members: true, papers: true } },
      papers: {
        select: { id: true, title: true, createdAt: true },
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: MAX_RECENT_PAPERS,
      },
    },
  }) as Record<string, any> | null;

  if (!workspace) throw new Error("Workspace not found");

  const recentActivity = workspace.papers?.length > 0
    ? `Most recent paper: "${workspace.papers[0].title}"`
    : "No recent activity.";

  return {
    type: "workspace",
    workspace: {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      goals: null,
    },
    memberCount: workspace._count?.members || 0,
    paperCount: workspace._count?.papers || 0,
    recentPapers: (workspace.papers || []).map((p: any) => ({
      id: p.id,
      title: p.title,
    })),
    recentActivity,
  };
}

async function buildDashboardContext(
  userId: string
): Promise<DashboardContext> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) throw new Error("User not found");

  const [recentPapers, workspaces, unreadNotifications] = await Promise.all([
    prisma.paper.findMany({
      where: { uploaderId: userId, isDeleted: false },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: MAX_RECENT_PAPERS,
    }),
    prisma.workspaceMember.findMany({
      where: { userId, isDeleted: false },
      select: { workspace: { select: { id: true, name: true } } },
      take: MAX_RECENT_PAPERS,
    }),
    prisma.notification.count({
      where: { userId, read: false },
    }),
  ]);

  return {
    type: "dashboard",
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    recentPapers: recentPapers.map((p) => ({
      id: p.id,
      title: p.title,
    })),
    activeWorkspaces: workspaces.map((w) => ({
      id: w.workspace.id,
      name: w.workspace.name,
    })),
    unreadNotifications,
  };
}

export const aiContextService = {
  async resolve(input: AiContextInput): Promise<AiContext> {
    switch (input.type) {
      case "paper":
        return await buildPaperContext(input.id, input.userId);
      case "workspace":
        return await buildWorkspaceContext(input.id, input.userId);
      case "dashboard":
        return await buildDashboardContext(input.userId);
      default:
        throw new Error("Unknown context type");
    }
  },

  buildSystemPrompt,

  injectContextIntoSystemPrompt(
    context: AiContext,
    basePrompt?: string
  ): ContextInjectionResult {
    return buildSystemPrompt(context, basePrompt);
  },
};
