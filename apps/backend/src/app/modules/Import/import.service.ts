import axios from "axios";
import ApiError from "../../errors/ApiError";
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
  alreadyImported?: boolean;
}

async function tryQueueExtraction(paperId: string): Promise<void> {
  try {
    await queueDocumentExtraction(paperId);
  } catch {
    console.warn(`[Import] Could not queue extraction for ${paperId} — Redis unavailable`);
  }
}

function decodeEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function looksLikePdf(buffer: Buffer): boolean {
  return buffer.length > 4 && buffer.subarray(0, 5).toString("latin1") === "%PDF-";
}

/**
 * Accept a bare arXiv ID (new 2511.11306 or old hep-th/9901001 style), a
 * full arxiv.org/abs|pdf URL, or the DataCite arXiv DOI
 * (10.48550/arXiv.2511.11306). Strips trailing version suffixes. Returns the
 * canonical unversioned ID, or null when the input is not an arXiv ID.
 */
function normalizeArxivId(input: string): string | null {
  let id = input.trim();
  if (!id) return null;

  const urlMatch = id.match(/arxiv\.org\/(?:abs|pdf)\/([^?#\s]+)/i);
  if (urlMatch) id = urlMatch[1];

  id = id
    .replace(/^10\.48550\/arxiv\./i, "")
    .replace(/^arxiv:\s*/i, "")
    .replace(/^doi:\s*/i, "")
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .split(/[?#\s]/)[0]
    .trim()
    .replace(/v\d+$/i, "");

  if (!id || id.length > 64 || !/^[\w.-]+$/.test(id)) return null;
  const looksArxiv =
    /^\d{4}\.\d{4,5}$/.test(id) || /^[a-z-]+(?:\.[a-z-]+)*\/\d{7}$/i.test(id);
  return looksArxiv ? id : null;
}

/**
 * arXiv export API returns an Atom feed whose FIRST <title> is the feed-level
 * "arXiv Query: ..." string. Every field must be parsed from the <entry>
 * block, otherwise the paper title becomes the query string (observed bug).
 */
function parseArxivFeed(xml: string): {
  title: string;
  authors: string[];
  abstract: string;
  year: number;
} | null {
  const entry = xml.match(/<entry>[\s\S]*?<\/entry>/)?.[0];
  if (!entry) return null;

  const content = (tag: string): string => {
    const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
    if (!m) return "";
    const text = m[1].replace(/<[^>]*>/g, " ");
    return decodeEntities(text).replace(/\s+/g, " ").trim();
  };

  const title = content("title");
  if (!title) return null;

  const authorMatches = entry.matchAll(
    /<author>[\s\S]*?<name[^>]*>(.*?)<\/name>[\s\S]*?<\/author>/g,
  );
  const authors = [...authorMatches]
    .map((m) =>
      decodeEntities(m[1].replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim(),
    )
    .filter(Boolean);

  const yearMatch = entry.match(/<published>\s*(\d{4})/);
  const year = yearMatch
    ? parseInt(yearMatch[1], 10)
    : new Date().getFullYear();

  return { title, authors, abstract: content("summary"), year };
}

/**
 * Idempotency pre-check: if the same paper (DOI, arXiv ID, source ID, or
 * originating URL) is already imported into this workspace, return it instead
 * of creating a duplicate row. metadata->>'sourceId' / 'sourceUrl' are written
 * by the URL/smart-URL importers for exactly this lookup.
 */
async function findExistingPaper(
  workspaceId: string,
  match: {
    doi?: string | null;
    arxivId?: string | null;
    sourceId?: string | null;
    url?: string | null;
  },
): Promise<{ id: string; title: string; source: string; doi: string | null } | null> {
  const { doi = null, arxivId = null, sourceId = null, url = null } = match;
  const rows = await prisma.$queryRaw<
    Array<{ id: string; title: string; source: string; doi: string | null }>
  >`
    SELECT id, title, source, doi
    FROM "Paper"
    WHERE "workspaceId" = ${workspaceId}
      AND "isDeleted" = false
      AND (
        (${doi}::text IS NOT NULL AND doi = ${doi})
        OR (${arxivId}::text IS NOT NULL AND "metadata"->>'arxivId' = ${arxivId})
        OR (${sourceId}::text IS NOT NULL AND "metadata"->>'sourceId' = ${sourceId})
        OR (${url}::text IS NOT NULL AND "metadata"->>'sourceUrl' = ${url})
      )
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function paperHasPdf(paperId: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ n: number }>>`
    SELECT COUNT(*)::int AS n FROM "PaperFile"
    WHERE "paperId" = ${paperId} AND "isDeleted" = false
  `;
  return (rows[0]?.n ?? 0) > 0;
}

function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * DataCite REST API — fallback for DOIs not registered with Crossref
 * (e.g. 10.48550/arXiv.*, DataCite-only datasets). Returns full abstracts.
 */
async function fetchDataCiteByDoi(doi: string): Promise<{
  title: string;
  authors: string[];
  year: number | null;
  abstract: string;
}> {
  const res = await axios.get(
    `https://api.datacite.org/dois/${encodeURIComponent(doi)}`,
    { timeout: 8000 },
  );
  const attrs = res.data?.data?.attributes;
  if (!attrs) throw new Error(`DataCite: no record for ${doi}`);

  const creators = (attrs.creators || [])
    .map(
      (c: any) =>
        c?.name || `${c?.givenName || ""} ${c?.familyName || ""}`.trim(),
    )
    .filter(Boolean);
  const abstractEntry = (attrs.descriptions || []).find(
    (d: any) => (d?.descriptionType || "").toLowerCase() === "abstract",
  );

  return {
    title: attrs.titles?.[0]?.title || "",
    authors: creators,
    year: attrs.publicationYear
      ? parseInt(attrs.publicationYear, 10)
      : null,
    abstract: abstractEntry?.description
      ? stripHtmlTags(decodeEntities(abstractEntry.description))
      : "",
  };
}

/**
 * OpenAlex — free gap-fill source when Crossref/DataCite lack an abstract
 * or authors. Reconstructs the abstract from abstract_inverted_index.
 */
async function fetchOpenAlexByDoi(doi: string): Promise<{
  title: string;
  authors: string[];
  year: number | null;
  abstract: string;
  citedBy: number;
} | null> {
  const res = await axios.get(
    `https://api.openalex.org/works/doi:${encodeURIComponent(doi)}`,
    { timeout: 8000 },
  );
  const work = res.data;
  if (!work?.title) return null;

  const inverted: Record<string, number[]> | null =
    work.abstract_inverted_index || null;
  let abstract = "";
  if (inverted) {
    const words: Array<{ pos: number; word: string }> = [];
    for (const [word, positions] of Object.entries(inverted)) {
      for (const pos of positions) words.push({ pos, word });
    }
    abstract = words
      .sort((a, b) => a.pos - b.pos)
      .map((w) => w.word)
      .join(" ");
  }

  return {
    title: work.title,
    authors: (work.authorships || [])
      .map((a: any) => a?.author?.display_name)
      .filter(Boolean),
    year: work.publication_year || null,
    abstract,
    citedBy: work.cited_by_count || 0,
  };
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

/**
 * Attribute-order-agnostic HTML <meta>/<link> parser. Collects every meta by
 * its name/property/itemprop key (multi-values joined with \0) plus
 * rel="citation_pdf_url" links. Enables og:title, DC.date, article:author,
 * prism.doi etc. without brittle positional regexes.
 */
function parseMetaTags(html: string): Map<string, string> {
  const map = new Map<string, string>();

  const metaRe = /<meta\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(html)) !== null) {
    const tag = m[0];
    const attr = (name: string): string => {
      const a = tag.match(
        new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
      );
      return a ? decodeEntities(a[1] ?? a[2] ?? a[3] ?? "") : "";
    };
    const key = (attr("name") || attr("property") || attr("itemprop") || "").toLowerCase();
    const content = attr("content");
    if (!key || !content) continue;
    const previous = map.get(key);
    map.set(key, previous ? `${previous}\u0000${content}` : content);
  }

  const linkRe = /<link\b[^>]*>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(html)) !== null) {
    const rel = lm[0].match(/rel\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase() || "";
    const href = lm[0].match(/href\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    if (rel.includes("citation_pdf_url") && href && !map.has("citation_pdf_url")) {
      map.set("citation_pdf_url", decodeEntities(href));
    }
  }

  return map;
}

function findMeta(map: Map<string, string>, candidates: string[]): string {
  for (const key of candidates) {
    const value = map.get(key);
    if (value) return value;
  }
  return "";
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
      `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=openAccessPdf`,
      { timeout: 8000 },
    );
    const pdfUrl = ssRes.data?.openAccessPdf?.url;
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
  let hostname = "";
  let pathname = "";
  try {
    const parsed = new URL(url);
    hostname = parsed.hostname.replace("www.", "");
    pathname = parsed.pathname;
  } catch {
    return "unknown";
  }
  if (hostname.includes("arxiv.org")) return "arxiv";
  if (hostname.includes("ieeexplore.ieee.org")) return "ieee";
  if (hostname.includes("researchgate.net")) return "researchgate";
  if (hostname.includes("scholar.google.com")) return "google_scholar";
  if (hostname.includes("semanticscholar.org")) return "semantic_scholar";
  if (pathname.toLowerCase().endsWith(".pdf")) return "pdf";
  return "unknown";
}

async function extractMetadataFromHtml(url: string, html?: string): Promise<{
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  doi: string | null;
  pdfUrl: string | null;
}> {
  try {
    const body =
      html ??
      ((await axios.get(url, { timeout: 15000, responseType: "text" })).data as string);
    const meta = parseMetaTags(body);

    const titleTag = stripHtmlTags(
      decodeEntities(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    );
    const title =
      findMeta(meta, ["citation_title", "og:title", "twitter:title", "dc.title", "dcterms.title"]) ||
      titleTag ||
      "Untitled";

    const authors = [
      ...new Set(
        findMeta(meta, ["citation_author", "author", "article:author", "dc.creator"])
          .split("\u0000")
          .flatMap((a) => a.split(";"))
          .map((a) => decodeEntities(a).trim())
          .filter(Boolean),
      ),
    ];

    const dateStr = findMeta(meta, [
      "citation_publication_date",
      "citation_date",
      "article:published_time",
      "dc.date",
      "date",
    ]);
    const year = parseInt(dateStr.match(/\d{4}/)?.[0] || "", 10) || new Date().getFullYear();

    const abstract = stripHtmlTags(
      findMeta(meta, ["citation_abstract", "og:description", "twitter:description", "description"]),
    );
    const doi = findMeta(meta, ["citation_doi", "doi", "prism.doi"]) || null;
    let pdfUrl = findMeta(meta, ["citation_pdf_url"]) || null;
    if (pdfUrl && !pdfUrl.startsWith("http")) {
      try {
        pdfUrl = new URL(pdfUrl, url).toString();
      } catch {
        pdfUrl = null;
      }
    }

    return { title, authors, year, abstract, doi, pdfUrl };
  } catch {
    return { title: "Untitled", authors: [], year: new Date().getFullYear(), abstract: "", doi: null, pdfUrl: null };
  }
}

export class ImportService {
  static async importByDOI(input: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const cleanDoi = input
      .trim()
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
      .replace(/^doi:\s*/i, "")
      .replace(/\/+$/, "");

    // arXiv DataCite DOIs (10.48550/arXiv.*) return 404 from Crossref —
    // route them through the arXiv importer instead.
    if (cleanDoi.toLowerCase().startsWith("10.48550/arxiv.")) {
      return this.importByArxiv(cleanDoi, workspaceId, uploaderId);
    }
    if (!/^10\.\d{4,9}\/[\w.()/:;<>\[\]_-]+$/i.test(cleanDoi)) {
      throw new ApiError(400, `Invalid DOI: "${input}"`);
    }

    const existing = await findExistingPaper(workspaceId, { doi: cleanDoi });
    if (existing) {
      console.log(`[Import] DOI ${cleanDoi}: already imported — returning existing paper`);
      return {
        paper: existing,
        source: "doi",
        externalId: cleanDoi,
        hasPdf: await paperHasPdf(existing.id),
        alreadyImported: true,
      };
    }

    let title = "";
    let authors: string[] = [];
    let year: number | null = null;
    let abstract = "";
    let keywords: string[] = [];
    let citedBy = 0;

    try {
      const res = await axios.get(
        `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`,
        { headers: { "User-Agent": "ScholarFlow/1.0 (mailto:dev@scholarflow.com)" }, timeout: 10000 },
      );
      const msg = res.data.message;
      title = msg.title?.[0] || "";
      authors = (msg.author || [])
        .map((a: any) => `${a.given || ""} ${a.family || ""}`.trim())
        .filter(Boolean);
      year = msg.created?.["date-parts"]?.[0]?.[0] || msg.issued?.["date-parts"]?.[0]?.[0] || null;
      abstract = msg.abstract
        ? stripHtmlTags(decodeEntities(msg.abstract))
        : "";
      keywords = msg.subject || [];
      citedBy = msg["is-referenced-by-count"] || 0;
    } catch (err) {
      const status = (err as any)?.response?.status;
      if (status !== 404) throw err;
      try {
        const dc = await fetchDataCiteByDoi(cleanDoi);
        title = dc.title;
        authors = dc.authors;
        year = dc.year;
        abstract = dc.abstract;
      } catch (dcErr) {
        console.warn(`[Import] DOI ${cleanDoi}: DataCite fallback failed`, (dcErr as Error).message);
        throw new ApiError(404, `Paper not found for DOI ${cleanDoi} (Crossref and DataCite)`);
      }
    }

    // Gap-fill from OpenAlex when the primary source lacked abstract/authors.
    if (!abstract || !authors.length || !title) {
      try {
        const oa = await fetchOpenAlexByDoi(cleanDoi);
        if (oa) {
          if (!title) title = oa.title;
          if (!authors.length) authors = oa.authors;
          if (!year) year = oa.year;
          if (!abstract) abstract = oa.abstract;
          if (!citedBy) citedBy = oa.citedBy;
        }
      } catch {
        // OpenAlex enrichment is optional
      }
    }

    if (!title) {
      throw new ApiError(404, `Could not fetch metadata for DOI ${cleanDoi}`);
    }

    const metadata = { authors, year: year || new Date().getFullYear(), source: "doi", doi: cleanDoi, keywords };

    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'doi', ${cleanDoi}, ${keywords}::text[], null, ${citedBy}, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    const paperId = paper[0].id;

    let hasPdf = false;
    try {
      const pdfBuffer = await findOAPdfByDoi(cleanDoi);
      if (pdfBuffer) {
        if (!looksLikePdf(pdfBuffer)) throw new Error("OA PDF response was not a PDF");
        const filename = sanitizeFilename(`${title.substring(0, 50)}.pdf`);
        await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
        await tryQueueExtraction(paperId);
        hasPdf = true;
        console.log(`[Import] DOI ${cleanDoi}: PDF saved, extraction queued`);
      } else {
        console.log(`[Import] DOI ${cleanDoi}: no OA PDF found — metadata only`);
      }
    } catch (err) {
      console.warn(
        `[Import] DOI ${cleanDoi}: PDF save failed — metadata only`,
        (err as Error).message,
      );
    }

    return { paper: paper[0], source: "doi", externalId: cleanDoi, hasPdf, alreadyImported: false };
  }

  static async importByArxiv(input: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const cleanId = normalizeArxivId(input);
    if (!cleanId) {
      throw new ApiError(
        400,
        "Invalid arXiv ID. Expected e.g. 2511.11306, arxiv.org/abs/2511.11306 or 10.48550/arXiv.2511.11306",
      );
    }
    const paperDoi = `10.48550/arXiv.${cleanId}`;

    const existing = await findExistingPaper(workspaceId, {
      doi: paperDoi,
      arxivId: cleanId,
    });
    if (existing) {
      console.log(`[Import] arXiv ${cleanId}: already imported — returning existing paper`);
      return {
        paper: existing,
        source: "arxiv",
        externalId: cleanId,
        hasPdf: await paperHasPdf(existing.id),
        alreadyImported: true,
      };
    }

    const res = await axios.get(
      `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(cleanId)}&max_results=1`,
      { timeout: 15000 },
    );

    const parsed = parseArxivFeed(res.data as string);
    if (!parsed) {
      throw new ApiError(404, `arXiv paper "${cleanId}" not found`);
    }

    const metadata = { authors: parsed.authors, year: parsed.year, source: "arxiv", arxivId: cleanId };
    const abstract = parsed.abstract || null;

    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${parsed.title}, ${abstract}, ${JSON.stringify(metadata)}::jsonb, 'arxiv', ${paperDoi}, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    const paperId = paper[0].id;

    let hasPdf = false;
    try {
      console.log(`[Import] arXiv ${cleanId}: downloading PDF from https://arxiv.org/pdf/${cleanId}`);
      const pdfBuffer = await downloadPdf(`https://arxiv.org/pdf/${cleanId}`);
      const filename = sanitizeFilename(`${cleanId}.pdf`);
      await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
      await tryQueueExtraction(paperId);
      hasPdf = true;
      console.log(`[Import] arXiv ${cleanId}: PDF saved, extraction queued`);
    } catch (err) {
      console.warn(
        `[Import] arXiv ${cleanId}: PDF download failed — metadata only`,
        (err as Error).message,
      );
    }

    return { paper: paper[0], source: "arxiv", externalId: cleanId, hasPdf, alreadyImported: false };
  }

  static async importByURL(inputUrl: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const url = inputUrl.trim();
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new ApiError(400, `Invalid URL: "${url}"`);
    }
    const sourceType = detectSourceFromUrl(url);

    if (sourceType === "arxiv") {
      const arxivId = normalizeArxivId(url);
      if (arxivId) return this.importByArxiv(arxivId, workspaceId, uploaderId);
    }
    if (
      sourceType === "ieee" ||
      sourceType === "semantic_scholar" ||
      sourceType === "researchgate" ||
      sourceType === "google_scholar"
    ) {
      return this.importBySmartURL(url, workspaceId, uploaderId);
    }

    let buffer: Buffer;
    try {
      buffer = await downloadPdf(url);
    } catch {
      throw new ApiError(
        400,
        `Could not download content from ${parsedUrl.hostname}${parsedUrl.pathname}`,
      );
    }

    let title = "";
    let authors: string[] = [];
    let year: number | null = null;
    let abstract = "";
    let doi: string | null = null;
    let pdfBuffer: Buffer | null = null;

    if (looksLikePdf(buffer)) {
      pdfBuffer = buffer;
    } else {
      // HTML landing page (or a bot-wall): pull metadata, try citation_pdf_url.
      const meta = await extractMetadataFromHtml(url, buffer.toString("utf8"));
      title = meta.title === "Untitled" ? "" : meta.title;
      authors = meta.authors;
      year = meta.year;
      abstract = meta.abstract;
      doi = meta.doi;
      if (meta.pdfUrl) {
        try {
          const candidate = await downloadPdf(meta.pdfUrl);
          if (looksLikePdf(candidate)) pdfBuffer = candidate;
        } catch {
          // metadata-only fallback
        }
      }
    }

    if (!pdfBuffer && !title && sourceType === "pdf") {
      throw new ApiError(400, "The linked content is not a valid PDF");
    }
    if (!pdfBuffer && !title) {
      throw new ApiError(
        400,
        `No paper metadata or PDF found at ${parsedUrl.hostname}${parsedUrl.pathname}`,
      );
    }

    if (!title) {
      title =
        decodeURIComponent(parsedUrl.pathname.split("/").pop() || "")
          .replace(/\.pdf$/i, "")
          .replace(/[_-]+/g, " ")
          .trim() || "Untitled";
    }

    if (doi && (!authors.length || !abstract || !year)) {
      try {
        const crossRef = await axios.get(
          `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
          { headers: { "User-Agent": "ScholarFlow/1.0" }, timeout: 8000 },
        );
        const msg = crossRef.data.message;
        if (!authors.length)
          authors = (msg.author || [])
            .map((a: any) => `${a.given || ""} ${a.family || ""}`.trim())
            .filter(Boolean);
        if (!year) year = msg.created?.["date-parts"]?.[0]?.[0] || null;
        if (!abstract && msg.abstract) abstract = stripHtmlTags(decodeEntities(msg.abstract));
      } catch {
        // CrossRef enrichment is optional
      }
    }

    const existing = await findExistingPaper(workspaceId, { doi, url });
    if (existing) {
      console.log(`[Import] URL ${url}: already imported — returning existing paper`);
      return {
        paper: existing,
        source: "url",
        externalId: doi || undefined,
        hasPdf: await paperHasPdf(existing.id),
        alreadyImported: true,
      };
    }

    const metadata = {
      authors,
      year: year || new Date().getFullYear(),
      source: "url",
      doi,
      sourceUrl: url,
      sourceType,
    };

    const paper = await prisma.$queryRaw<any[]>`
      INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'url', ${doi}, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
      RETURNING id, title, source, doi
    `;
    const paperId = paper[0].id;

    let hasPdf = false;
    if (pdfBuffer) {
      try {
        const filename = sanitizeFilename(`${title.substring(0, 50)}.pdf`);
        await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
        await tryQueueExtraction(paperId);
        hasPdf = true;
        console.log(`[Import] URL ${url}: PDF saved, extraction queued`);
      } catch (err) {
        console.warn(`[Import] URL ${url}: PDF save failed — metadata only`, (err as Error).message);
      }
    } else {
      console.log(`[Import] URL ${url}: metadata-only import (no usable PDF at URL)`);
    }

    return { paper: paper[0], source: "url", externalId: doi || undefined, hasPdf, alreadyImported: false };
  }

  static async importBySmartURL(inputUrl: string, workspaceId: string, uploaderId: string): Promise<ImportResult> {
    const url = inputUrl.trim();
    const sourceType = detectSourceFromUrl(url);
    console.log(`[Import] Smart URL detected source: ${sourceType} — ${url}`);

    if (sourceType === "arxiv") {
      const arxivId = normalizeArxivId(url);
      if (arxivId) return this.importByArxiv(arxivId, workspaceId, uploaderId);
    }

    if (sourceType === "ieee") {
      const meta = await extractMetadataFromHtml(url);
      let pdfBuffer: Buffer | null = null;

      if (meta.pdfUrl) {
        try {
          const candidate = await downloadPdf(meta.pdfUrl);
          if (looksLikePdf(candidate)) pdfBuffer = candidate;
        } catch {
          console.warn(`[Import] IEEE PDF download failed from ${meta.pdfUrl}`);
        }
      }

      let doi = meta.doi;
      let title = meta.title === "Untitled" ? "" : meta.title;
      let authors = meta.authors;
      let year = meta.year;
      let abstract = meta.abstract;

      // CrossRef enrichment — only fill missing fields (avoids overwriting
      // publisher-provided metadata with stale registry records).
      if (doi && (!title || !authors.length || !abstract || !year)) {
        try {
          const crossRef = await axios.get(
            `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
            { headers: { "User-Agent": "ScholarFlow/1.0" }, timeout: 8000 },
          );
          const msg = crossRef.data.message;
          if (!title) title = msg.title?.[0] || "";
          if (!authors.length)
            authors = (msg.author || [])
              .map((a: any) => `${a.given || ""} ${a.family || ""}`.trim())
              .filter(Boolean);
          if (!year) year = msg.created?.["date-parts"]?.[0]?.[0] || new Date().getFullYear();
          if (!abstract && msg.abstract) abstract = stripHtmlTags(decodeEntities(msg.abstract));
        } catch {
          // CrossRef enrichment is optional
        }
      }

      const existing = await findExistingPaper(workspaceId, { doi, url });
      if (existing) {
        console.log(`[Import] IEEE ${url}: already imported — returning existing paper`);
        return {
          paper: existing,
          source: "ieee",
          externalId: doi || undefined,
          hasPdf: await paperHasPdf(existing.id),
          alreadyImported: true,
        };
      }

      const metadata = { authors, year: year || new Date().getFullYear(), source: "ieee", doi, sourceUrl: url };
      const paper = await prisma.$queryRaw<any[]>`
        INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
        VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'ieee', ${doi}, ARRAY[]::text[], null, 0, 'UPLOADED', NOW(), NOW(), false)
        RETURNING id, title, source, doi
      `;
      const paperId = paper[0].id;

      let hasPdf = false;
      try {
        if (!pdfBuffer && doi) {
          const oaPdf = await findOAPdfByDoi(doi);
          if (oaPdf && looksLikePdf(oaPdf)) pdfBuffer = oaPdf;
        }
        if (pdfBuffer) {
          const filename = sanitizeFilename(`${title.substring(0, 50)}.pdf`);
          await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
          await tryQueueExtraction(paperId);
          hasPdf = true;
        } else {
          console.log(`[Import] IEEE ${doi || url}: no PDF available — metadata only`);
        }
      } catch (err) {
        console.warn(`[Import] IEEE ${doi || url}: PDF save failed — metadata only`, (err as Error).message);
      }

      return {
        paper: paper[0],
        source: "ieee",
        externalId: doi || undefined,
        hasPdf,
        alreadyImported: false,
      };
    }

    if (sourceType === "semantic_scholar") {
      try {
        const paperIdMatch = url.match(/paper\/([A-Za-z0-9]+)/)?.[1];
        if (paperIdMatch) {
          const ssRes = await axios.get(
            `https://api.semanticscholar.org/graph/v1/paper/${paperIdMatch}?fields=title,authors,abstract,year,externalIds,openAccessPdf,citationCount`,
            { timeout: 10000 },
          );
          const data = ssRes.data;
          const title = data.title || "";
          const authors = (data.authors || []).map((a: any) => a?.name).filter(Boolean);
          const year = data.year || new Date().getFullYear();
          const abstract = data.abstract || "";
          const doi = data.externalIds?.DOI || null;
          const pdfUrl = data.openAccessPdf?.url || null;

          const existing = await findExistingPaper(workspaceId, { doi, sourceId: paperIdMatch, url });
          if (existing) {
            console.log(`[Import] Semantic Scholar ${paperIdMatch}: already imported — returning existing paper`);
            return {
              paper: existing,
              source: "semantic_scholar",
              externalId: doi || paperIdMatch,
              hasPdf: await paperHasPdf(existing.id),
              alreadyImported: true,
            };
          }

          const metadata = {
            authors,
            year,
            source: "semantic_scholar",
            doi,
            sourceId: paperIdMatch,
            sourceUrl: url,
          };

          const paper = await prisma.$queryRaw<any[]>`
            INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, language, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
            VALUES (gen_random_uuid(), ${workspaceId}, ${uploaderId}, ${title}, ${abstract || null}, ${JSON.stringify(metadata)}::jsonb, 'semantic_scholar', ${doi}, ARRAY[]::text[], null, ${data.citationCount || 0}, 'UPLOADED', NOW(), NOW(), false)
            RETURNING id, title, source, doi
          `;
          const paperId = paper[0].id;

          let hasPdf = false;
          if (pdfUrl) {
            try {
              const pdfBuffer = await downloadPdf(pdfUrl);
              if (looksLikePdf(pdfBuffer)) {
                const filename = sanitizeFilename(`${title.substring(0, 50)}.pdf`);
                await savePdfToS3(pdfBuffer, workspaceId, paperId, filename);
                await tryQueueExtraction(paperId);
                hasPdf = true;
              }
            } catch {
              console.warn(`[Import] Semantic Scholar PDF download failed for ${title}`);
            }
          }

          return {
            paper: paper[0],
            source: "semantic_scholar",
            externalId: doi || paperIdMatch,
            hasPdf,
            alreadyImported: false,
          };
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
