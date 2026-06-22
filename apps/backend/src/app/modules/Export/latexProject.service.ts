import prisma from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

export interface LatexFileNode {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  order: number;
}

interface LatexProjectMeta {
  files: LatexFileNode[];
  mainFileId: string | null;
  compiler: string;
}

const DEFAULT_LATEX_PROJECT: LatexProjectMeta = {
  files: [
    {
      id: "main",
      name: "main.tex",
      content: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{My Paper}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
Your abstract here.
\\end{abstract}

\\section{Introduction}
Your introduction here.

\\section{Methodology}
Your methodology here.

\\section{Results}
Your results here.

\\section{Conclusion}
Your conclusion here.

\\end{document}
`,
      parentId: null,
      order: 0,
    },
    {
      id: "intro",
      name: "chapters/introduction.tex",
      content: `\\section{Introduction}
\\label{sec:introduction}

Background and motivation for your research.
`,
      parentId: null,
      order: 1,
    },
  ],
  mainFileId: "main",
  compiler: "pdflatex",
};

function getLatexProject(metadata: any): LatexProjectMeta {
  if (metadata?.latexProject) {
    return metadata.latexProject as LatexProjectMeta;
  }
  return DEFAULT_LATEX_PROJECT;
}

export const latexProjectService = {
  async getFiles(paperId: string): Promise<LatexFileNode[]> {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: { metadata: true },
    });
    if (!paper) throw new Error("Paper not found");
    const project = getLatexProject(paper.metadata);
    return project.files;
  },

  async getFile(paperId: string, fileId: string): Promise<LatexFileNode | null> {
    const files = await this.getFiles(paperId);
    return files.find((f) => f.id === fileId) ?? null;
  },

  async saveFile(paperId: string, fileId: string, content: string): Promise<LatexFileNode> {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: { metadata: true },
    });
    if (!paper) throw new Error("Paper not found");

    const project = getLatexProject(paper.metadata);
    const idx = project.files.findIndex((f) => f.id === fileId);
    if (idx === -1) throw new Error("File not found");

    project.files[idx].content = content;

    await prisma.paper.update({
      where: { id: paperId },
      data: { metadata: { ...(paper.metadata as any), latexProject: project } },
    });

    return project.files[idx];
  },

  async createFile(
    paperId: string,
    name: string,
    content: string,
    parentId?: string
  ): Promise<LatexFileNode> {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: { metadata: true },
    });
    if (!paper) throw new Error("Paper not found");

    const project = getLatexProject(paper.metadata);
    const newFile: LatexFileNode = {
      id: uuidv4(),
      name,
      content: content || `% ${name}\n`,
      parentId: parentId ?? null,
      order: project.files.length,
    };

    project.files.push(newFile);

    await prisma.paper.update({
      where: { id: paperId },
      data: { metadata: { ...(paper.metadata as any), latexProject: project } },
    });

    return newFile;
  },

  async deleteFile(paperId: string, fileId: string): Promise<void> {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: { metadata: true },
    });
    if (!paper) throw new Error("Paper not found");

    const project = getLatexProject(paper.metadata);
    project.files = project.files.filter((f) => f.id !== fileId);

    if (project.mainFileId === fileId) {
      project.mainFileId = project.files[0]?.id ?? null;
    }

    await prisma.paper.update({
      where: { id: paperId },
      data: { metadata: { ...(paper.metadata as any), latexProject: project } },
    });
  },

  async setMainFile(paperId: string, fileId: string): Promise<void> {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: { metadata: true },
    });
    if (!paper) throw new Error("Paper not found");

    const project = getLatexProject(paper.metadata);
    if (!project.files.find((f) => f.id === fileId)) {
      throw new Error("File not found");
    }

    project.mainFileId = fileId;

    await prisma.paper.update({
      where: { id: paperId },
      data: { metadata: { ...(paper.metadata as any), latexProject: project } },
    });
  },
};
