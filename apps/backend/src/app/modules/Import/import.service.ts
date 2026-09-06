import axios from "axios";
import prisma from "../../shared/prisma";
import { StorageService as storage } from "../papers/storage.service";
import { queueDocumentExtraction } from "../../services/pdfProcessingQueue";

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
  hasPdf?: boolean;
}

async function tryQueueExtraction(paperId: string): Promise<void> {
  try {
    await queueDocumentExtraction(paperId);
  } catch {
    console.warn(`[Import] Could not queue extraction for ${paperId} — Redis unavailable`);
  }
}

async function savePdfToS3(
  buffer: Buffer,
  workspaceId: string,
  paperId: string,
  filename: string,
): Promise<{ objectKey: string }> {
  const objectKey = `papers/${workspaceId}/${Date.now()}-${filename}`;
  await storage.putObject({ key: objectKey, body: buffer, contentType: "application/pdf" });

  await prisma.$executeRaw`
    INSERT INTO "PaperFile" (id, "paperId", "storageProvider", "objectKey", "contentType", "sizeBytes", "originalFilename", "createdAt", "updatedAt", "isDeleted")
    VALUES (gen_random_uuid(), ${paperId}, 's3', ${objectKey}, 'application/pdf', ${buffer.length}, ${filename}, NOW(), NOW(), false)
  `;

  return { objectKey };
}

async function downloadPdf(url: string): Promise<Buffer> {
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
  return Buffer.from(res.data);
}

function extractMetaTag(html: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+name=["']${name}["'][^>]*content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+property=["']og:${name}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+name=["']citation_${name}["']\\s+content=["']([^"']+)["']`, "i"),
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m) return m[1];
  }
  return null;
}

function extractAllMetaTags(html: string, name: string): string[] {
  const results: string[] = [];
  const pattern = new RegExp(
    `<meta\\s+name=["']${name}["'][^>]*content=["']([^"']+)["']`,
    "gi",
  );
  let m;
  while ((m = pattern.exec(html)) !== null) results.push(m[1]);

  const citationPattern = new RegExp(
    `<meta\\s+name=["']citation_${name}["'][^>]*content=["']([^"']+)["']`,
    "gi",
  );
  let cm;
  while ((cm = citationPattern.exec(html)) !== null) results.push(cm[1]);

  return results;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").substring(0, 100);
}

async function findOAPdfByDoi(doi: string): Promise<Buffer | null> {
  try {
    const unpaywall = await axios.get(
      `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=dev@scholarflow.com`,
      { timeout: 8000 },
    );
    const bestLocation = unpaywall.data.best_oa_location || unpaywall.data.oa_locations?.[0];
    if (bestLocation?.url_for_pdf) {
      console.log(`[Import] Unpaywall found OA PDF for DOI ${doi}: ${bestLocation.url_for_pdf}`);
      return await downloadPdf(bestLocation.url_for_pdf);
    }
  } catch {
    console.warn(`[Import] Unpaywall lookup failed for DOI ${doi}`);
  }

  try {
    const ssRes = await axios.get(
      `https://api.semanticscholar.org/v1/paper/DOI:${encodeURIComponent(doi)}`,
      { timeout: 8000 },
    );
    const pdfUrl = ssRes.data.pdfUrl || ssRes.data.openAccessPdf?.url;
    if (pdfUrl) {
      console.log(`[Import] Semantic Scholar found PDF for DOI ${doi}: ${pdfUrl}`);
      return await downloadPdf(pdfUrl);
    }
  } catch {
    console.warn(`[Import] Semantic Scholar lookup failed for DOI ${doi}`);
  }

  return null;
}

function detectSourceFromUrl(url: string): string {
  const hostname = new URL(url).hostname.replace("www.", "");
  if (hostname.includes("arxiv.org")) return "arxiv";
  if (hostname.includes("ieeexplore.ieee.org")) return "ieee";
  if (hostname.includes("researchgate.net")) return "researchgate";
  if (hostname.includes("scholar.google.com")) return "google_scholar";
  if (hostname.includes("semanticscholar.org")) return "semantic_scholar";
  if (url.endsWith(".pdf")) return "pdf";
  return "unknown";
}

async function extractMetadataFromHtml(url: string): Promise<{
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  doi: string | null;
  pdfUrl: string | null;
}> {
  try {
    const res = await axios.get(url, { timeout: 15000, responseType: "text" });
    const html = res.data as string;

    const title =
      extractMetaTag(html, "title") ||
      extractMetaTag(html, "citation_title") ||
      extractMetaTag(html, "description") ||
      "Untitled";

    const authorTags = extractAllMetaTags(html, "author");
    const authors = [...new Set(authorTags.map((a) => a.trim()))];

    const yearStr = extractMetaTag(html, "date") || extractMetaTag(html, "citation_date") || "";
    const year = parseInt(yearStr.match(/\d{4}/)?.[0] || "", 10) || new Date().getFullYear();

    const abstract =
      extractMetaTag(html, "description") ||
      extractMetaTag(html, "citation_abstract") ||
      "";

    const doi = extractMetaTag(html, "doi") || extractMetaTag(html, "citation_doi") || null;

    const pdfUrl = extractMetaTag(html, "citation_pdf_url") || null;

    return { title, authors, year, abstract, doi, pdfUrl };
  } catch {
    return { title: "Untitled", authors: [], year: new Date().getFullYear(), abstract: "", doi: null, pdfUrl: null };
  }
}

export class ImportService {
  static async importByDOI(doi: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const cleanDoi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "").trim();
    const res = await axios.get(
      `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`,
      { headers: { "User-Agent": "ScholarFlow/1.0 (mailto:dev@scholarflow.com)" }, timeout: 10000 },
    );

    const msg = res.data.message;
    const title = msg.title?.[0] || "Untitled";
    const authors = (msg.author || []).map((a: any) => `${a.given || ""} ${a.family || ""}`.trim());
    const year = msg.created?.["date-parts"]?.[0]?.[0] || msg.issued?.["date-parts"]?.[0]?.[0] || 2024;
    const abstract = msg.abstract || "";
    const keywords = msg.subject || [];
    const metadata = { authors, year, source: "doi", doi: cleanDoi, keywords };

    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'doi', ${cleanDoi}, ${keywords}::text[], null, ${msg["is-referenced-by-count"] || 0}, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    const paperId = paper[0].id;

    let hasPdf = false;
    const pdfBuffer = await findOAPdfByDoi(cleanDoi);
    if (pdfBuffer) {
      const filename = sanitizeFilename(`${title.substring(0, 50)}.pdf`);
      await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
      await tryQueueExtraction(paperId);
      hasPdf = true;
      console.log(`[Import] DOI ${cleanDoi}: PDF saved, extraction queued`);
    } else {
      console.log(`[Import] DOI ${cleanDoi}: no OA PDF found — metadata only`);
    }

    return { paper: paper[0], source: "doi", externalId: cleanDoi, hasPdf };
  }

  static async importByArxiv(arxivId: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const cleanId = arxivId
      .replace(/^https?:\/\/arxiv\.org\/(abs|pdf)\//, "")
      .replace(/v\d+$/, "")
      .trim();
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
    const paperDoi = `10.48550/arXiv.${cleanId}`;

    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'arxiv', ${paperDoi}, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    const paperId = paper[0].id;

    try {
      console.log(`[Import] arXiv ${cleanId}: downloading PDF from https://arxiv.org/pdf/${cleanId}.pdf`);
      const pdfBuffer = await downloadPdf(`https://arxiv.org/pdf/${cleanId}.pdf`);
      const filename = sanitizeFilename(`${cleanId}.pdf`);
      await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
      await tryQueueExtraction(paperId);
      console.log(`[Import] arXiv ${cleanId}: PDF saved, extraction queued`);
      return { paper: paper[0], source: "arxiv", externalId: cleanId, hasPdf: true };
    } catch (err) {
      console.warn(`[Import] arXiv ${cleanId}: PDF download failed`, (err as Error).message);
      return { paper: paper[0], source: "arxiv", externalId: cleanId, hasPdf: false };
    }
  }

  static async importByURL(url: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const sourceType = detectSourceFromUrl(url);

    if (sourceType === "arxiv") {
      const arxivId = url.match(/\/(abs|pdf)\/(\d+\.\d+)/)?.[2] || url.match(/arxiv\.org\/pdf\/(\d+\.\d+)/)?.[1] || "";
      if (arxivId) return this.importByArxiv(arxivId, workspaceId, uploaderId);
    }

    if (sourceType === "ieee") {
      return this.importBySmartURL(url, workspaceId, uploaderId);
    }

    if (sourceType === "semantic_scholar") {
      return this.importBySmartURL(url, workspaceId, uploaderId);
    }

    let title = "Untitled";
    let authors: string[] = [];
    let year = new Date().getFullYear();
    let abstract = "";
    let doi: string | null = null;

    if (sourceType !== "pdf") {
      const meta = await extractMetadataFromHtml(url);
      title = meta.title;
      authors = meta.authors;
      year = meta.year;
      abstract = meta.abstract;
      doi = meta.doi;
    }

    if (doi && !title) {
      try {
        const crossRef = await axios.get(
          `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
          { headers: { "User-Agent": "ScholarFlow/1.0" }, timeout: 8000 },
        );
        const msg = crossRef.data.message;
        if (!title) title = msg.title?.[0] || title;
        if (!authors.length) authors = (msg.author || []).map((a: any) => `${a.given || ""} ${a.family || ""}`.trim());
        if (!year) year = msg.created?.["date-parts"]?.[0]?.[0] || year;
        if (!abstract) abstract = msg.abstract || "";
      } catch {
        // CrossRef enrichment is optional, continue with what we have
      }
    }

    const pdfBuffer = await downloadPdf(url);
    const metadata = { authors, year, source: "url" };
    const paperTitle = title || url.split("/").pop()?.replace(/\.pdf$/i, "") || "Untitled";

    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${paperTitle}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'url', ${doi}, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    const paperId = paper[0].id;

    const filename = sanitizeFilename(`${paperTitle.substring(0, 50)}.pdf`);
    await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
    await tryQueueExtraction(paperId);

    return { paper: paper[0], source: "url", externalId: doi || undefined, hasPdf: true };
  }

  static async importBySmartURL(url: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const sourceType = detectSourceFromUrl(url);
    console.log(`[Import] Smart URL detected source: ${sourceType} — ${url}`);

    if (sourceType === "arxiv") {
      const arxivId = url.match(/\/(?:abs|pdf)\/(\d+\.\d+)/)?.[1] || "";
      if (arxivId) return this.importByArxiv(arxivId, workspaceId, uploaderId);
    }

    if (sourceType === "ieee") {
      const meta = await extractMetadataFromHtml(url);
      let pdfBuffer: Buffer | null = null;

      if (meta.pdfUrl) {
        try {
          pdfBuffer = await downloadPdf(meta.pdfUrl);
        } catch {
          console.warn(`[Import] IEEE PDF download failed from ${meta.pdfUrl}`);
        }
      }

      let doi = meta.doi;
      let crossRefTitle = meta.title;
      let crossRefAuthors = meta.authors;
      let crossRefYear = meta.year;
      let crossRefAbstract = meta.abstract;

      if (doi) {
        try {
          const crossRef = await axios.get(
            `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
            { headers: { "User-Agent": "ScholarFlow/1.0" }, timeout: 8000 },
          );
          const msg = crossRef.data.message;
          if (!crossRefTitle) crossRefTitle = msg.title?.[0] || "Untitled";
          if (!crossRefAuthors.length) crossRefAuthors = (msg.author || []).map((a: any) => `${a.given || ""} ${a.family || ""}`.trim());
          if (!crossRefYear) crossRefYear = msg.created?.["date-parts"]?.[0]?.[0] || new Date().getFullYear();
          crossRefAbstract = msg.abstract || crossRefAbstract;
        } catch {
          // CrossRef enrichment is optional
        }
      }

      const metadata = { authors: crossRefAuthors, year: crossRefYear, source: "ieee", doi };
      const paper = await prisma.$queryRaw<any[]>`
        INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
        VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${crossRefTitle}, ${crossRefAbstract || null}, ${JSON.stringify(metadata)}::jsonb, 'ieee', ${doi}, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
        RETURNING id, title, source, doi
      `;
      const paperId = paper[0].id;

      if (pdfBuffer) {
        const filename = sanitizeFilename(`${crossRefTitle.substring(0, 50)}.pdf`);
        await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
        await tryQueueExtraction(paperId);
        return { paper: paper[0], source: "ieee", hasPdf: true };
      }

      if (doi) {
        const oaPdf = await findOAPdfByDoi(doi);
        if (oaPdf) {
          const filename = sanitizeFilename(`${crossRefTitle.substring(0, 50)}.pdf`);
          await savePdfToS3(oaPdf, workspaceId, paperId, filename);
          await tryQueueExtraction(paperId);
          return { paper: paper[0], source: "ieee", hasPdf: true };
        }
      }

      console.log(`[Import] IEEE ${doi || url}: no PDF available — metadata only`);
      return { paper: paper[0], source: "ieee", externalId: doi || undefined, hasPdf: false };
    }

    if (sourceType === "semantic_scholar") {
      try {
        const paperIdMatch = url.match(/paper\/([a-f0-9]+)/)?.[1];
        if (paperIdMatch) {
          const ssRes = await axios.get(
            `https://api.semanticscholar.org/v1/paper/${paperIdMatch}`,
            { timeout: 10000 },
          );
          const data = ssRes.data;
          const title = data.title || "Untitled";
          const authors = (data.authors || []).map((a: any) => a.name).filter(Boolean);
          const year = data.year || new Date().getFullYear();
          const abstract = data.abstract || "";
          const doi = data.externalIds?.DOI || null;
          const pdfUrl = data.pdfUrl || data.openAccessPdf?.url || null;
          const metadata = { authors, year, source: "semantic_scholar", doi };

          const paper = await prisma.$queryRaw<any[]>`
            INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
            VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'semantic_scholar', ${doi}, ARRAY[]::text[], null, ${data.citationCount || 0}, 'UPLOADED', NOW(), NOW(), false)
            RETURNING id, title, source, doi
          `;
          const paperId = paper[0].id;

          if (pdfUrl) {
            try {
              const pdfBuffer = await downloadPdf(pdfUrl);
              const filename = sanitizeFilename(`${title.substring(0, 50)}.pdf`);
              await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
              await tryQueueExtraction(paperId);
              return { paper: paper[0], source: "semantic_scholar", hasPdf: true };
            } catch {
              console.warn(`[Import] Semantic Scholar PDF download failed for ${title}`);
            }
          }

          return { paper: paper[0], source: "semantic_scholar", externalId: doi || paperIdMatch, hasPdf: false };
        }
      } catch {
        console.warn(`[Import] Semantic Scholar API failed for ${url}`);
      }
    }

    if (sourceType === "researchgate") {
      const doiMatch = url.match(/doi\/(10\.\d+\/[^?&]+)/);
      const doi = doiMatch?.[1] || null;
      if (doi) {
        return this.importByDOI(doi, workspaceId, uploaderId);
      }
    }

    if (sourceType === "google_scholar") {
      try {
        const html = (await axios.get(url, { timeout: 10000 })).data as string;
        const linkMatch = html.match(/<h3[^>]*>.*?<a\s+href=["']([^"']+)["']/);
        if (linkMatch) {
          const targetUrl = linkMatch[1].startsWith("http") ? linkMatch[1] : `https://scholar.google.com${linkMatch[1]}`;
          return this.importByURL(targetUrl, workspaceId, uploaderId);
        }
      } catch {
        console.warn(`[Import] Google Scholar scraping failed for ${url}`);
      }
    }

    return this.importByURL(url, workspaceId, uploaderId);
  }

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
  importBySmartURL: ImportService.importBySmartURL,
  parseBibTeX: ImportService.parseBibTeX,
  parseRIS: ImportService.parseRIS,
};
