// phase-4/paper-importer

import axios from "axios";
import prisma from "../../shared/prisma";
import { StorageService } from "../papers/storage.service";

const storage = new StorageService();

export interface ImportedPaper {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  doi?: string;
  source: string;
  keywords?: string[];
  downloadUrl?: string;
}

export interface ImportResult {
  paper: any;
  source: string;
  externalId?: string;
}

export class ImportService {
  /**
   * CrossRef DOI lookup — no auth required
   */
  static async importByDOI(doi: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const cleanDoi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "").trim();
    const res = await axios.get(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
      headers: { "User-Agent": "ScholarFlow/1.0 (mailto:dev@scholarflow.com)" },
      timeout: 10000,
    });

    const msg = res.data.message;
    const title = msg.title?.[0] || "Untitled";
    const authors = (msg.author || []).map(
      (a: any) => `${a.given || ""} ${a.family || ""}`.trim()
    );
    const year = msg.created?.["date-parts"]?.[0]?.[0] || msg.issued?.["date-parts"]?.[0]?.[0] || 2024;
    const abstract = msg.abstract || "";
    const keywords = msg.subject || [];

    const metadata = { authors, year, source: "doi", doi: cleanDoi, keywords };
    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'doi', ${cleanDoi}, ${keywords}::text[], null, ${msg["is-referenced-by-count"] || 0}, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    return { paper: paper[0], source: "doi", externalId: cleanDoi };
  }

  /**
   * arXiv API lookup — no auth required
   */
  static async importByArxiv(arxivId: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const cleanId = arxivId.replace(/^https?:\/\/arxiv\.org\/abs\//, "").replace(/v\d+$/, "").trim();
    const res = await axios.get(`http://export.arxiv.org/api/query?id_list=${encodeURIComponent(cleanId)}`, {
      timeout: 15000,
    });

    const text = res.data as string;
    const titleMatch = text.match(/<title>(.*?)<\/title>/);
    const title = titleMatch?.[1]?.replace(/\s+/g, " ").trim() || "Untitled";
    const summaryMatch = text.match(/<summary>(.*?)<\/summary>/);
    const abstract = summaryMatch?.[1]?.replace(/\s+/g, " ").trim() || "";
    const authorMatches = text.matchAll(/<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g);
    const authors = [...authorMatches].map((m) => m[1].trim());
    const yearMatch = text.match(/<published>(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 2024;

    const metadata = { authors, year, source: "arxiv", arxivId: cleanId };
    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'arxiv', ${`10.48550/arXiv.${cleanId}`}, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    return { paper: paper[0], source: "arxiv", externalId: cleanId };
  }

  /**
   * URL import — download PDF and store in S3
   */
  static async importByURL(url: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const res = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
    const buffer = Buffer.from(res.data);
    const filename = url.split("/").pop() || "imported.pdf";

    const objectKey = `papers/${workspaceId}/${Date.now()}-${filename}`;
    await storage.putObject({ key: objectKey, body: buffer, contentType: "application/pdf" });

    const metadata = { authors: [], year: new Date().getFullYear(), source: "url" };
    const title = filename.replace(/\.pdf$/i, "");

    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, null, ${JSON.stringify(metadata)}::jsonb, 'url', null, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;

    await prisma.$executeRaw`
      INSERT INTO "PaperFile" (id, "paperId", "storageProvider", "objectKey", "contentType", "sizeBytes", "originalFilename", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${paper[0].id}, 's3', ${objectKey}, 'application/pdf', ${buffer.length}, ${filename}, NOW(), NOW(), false)
    `;

    return { paper: paper[0], source: "url" };
  }

  /**
   * BibTeX file parser — batch import
   */
  static parseBibTeX(content: string): ImportedPaper[] {
    const entries = content.split(/@\w+\{/g).filter(Boolean).map((e) => {
      const titleMatch = e.match(/title\s*=\s*\{([^}]*)\}/);
      const authorMatch = e.match(/author\s*=\s*\{([^}]*)\}/);
      const yearMatch = e.match(/year\s*=\s*\{(\d+)\}/);
      const doiMatch = e.match(/doi\s*=\s*\{([^}]*)\}/);
      const abstractMatch = e.match(/abstract\s*=\s*\{([^}]*)\}/);

      return {
        title: titleMatch?.[1] || "Untitled",
        authors: authorMatch?.[1]
          ?.split(" and ")
          .map((a) => a.split(",").reverse().join(" ").trim()) || [],
        year: yearMatch ? parseInt(yearMatch[1], 10) : 2024,
        abstract: abstractMatch?.[1] || "",
        doi: doiMatch?.[1],
        source: "bibtex",
      };
    });
    return entries;
  }

  /**
   * RIS file parser — batch import
   */
  static parseRIS(content: string): ImportedPaper[] {
    const lines = content.split(/\r?\n/);
    const papers: ImportedPaper[] = [];
    let current: Partial<ImportedPaper> = {};

    for (const line of lines) {
      if (line.match(/^TY\s+-\s/)) {
        current = { source: "ris" };
      }
      if (line.match(/^ER\s+-\s/) && current.title) {
        papers.push({
          title: current.title || "Untitled",
          authors: current.authors || [],
          year: current.year || 2024,
          abstract: current.abstract || "",
          doi: current.doi,
          source: "ris",
        });
        current = {};
      }
      const tag = line.substring(0, 2);
      const value = line.substring(6).trim();
      if (tag === "T1") current.title = value;
      if (tag === "AU") current.authors = [...(current.authors || []), value];
      if (tag === "PY") current.year = parseInt(value, 10) || 2024;
      if (tag === "AB") current.abstract = value;
      if (tag === "DO") current.doi = value;
    }
    return papers;
  }
}

export const importService = {
  importByDOI: ImportService.importByDOI,
  importByArxiv: ImportService.importByArxiv,
  importByURL: ImportService.importByURL,
  parseBibTeX: ImportService.parseBibTeX,
  parseRIS: ImportService.parseRIS,
};
