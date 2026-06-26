import { execFile } from "child_process";
import { randomUUID } from "crypto";
import { mkdtemp, rm, writeFile, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface ExtractionResult {
  success: boolean;
  text?: string;
  pageCount?: number;
  method: "poppler" | "ocr" | "unpdf" | "fallback";
  error?: string;
}

let popplerAvailable: boolean | null = null;

async function checkPoppler(): Promise<boolean> {
  if (popplerAvailable !== null) return popplerAvailable;
  try {
    await execFileAsync("pdftotext", ["-v"], { timeout: 5000 });
    popplerAvailable = true;
  } catch {
    popplerAvailable = false;
  }
  return popplerAvailable;
}

function isScannedText(text: string): boolean {
  const cleaned = text.replace(/\s/g, "");
  return cleaned.length < 100;
}

/**
 * Tier 1: poppler pdftotext — native C extraction (~50ms per page)
 */
export async function extractWithPoppler(
  buffer: Buffer
): Promise<ExtractionResult> {
  const start = Date.now();
  let tmpDir: string | null = null;

  try {
    tmpDir = await mkdtemp(join(tmpdir(), "sf-poppler-"));
    const inputPath = join(tmpDir, "input.pdf");
    await writeFile(inputPath, buffer);

    const { stdout } = await execFileAsync(
      "pdftotext",
      ["-layout", "-nopgbrk", inputPath, "-"],
      { timeout: 120000, maxBuffer: 50 * 1024 * 1024 }
    );

    const text = stdout;
    const elapsed = Date.now() - start;
    console.log(
      `[pdfExtraction] poppler completed in ${elapsed}ms, text length: ${text.length}`
    );

    if (isScannedText(text)) {
      console.log(
        "[pdfExtraction] poppler returned very little text — likely a scanned PDF"
      );
      return { success: false, method: "poppler", error: "scanned_pdf" };
    }

    return { success: true, text, method: "poppler" };
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(
      `[pdfExtraction] poppler failed after ${elapsed}ms:`,
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      method: "poppler",
      error: error instanceof Error ? error.message : "poppler failed",
    };
  } finally {
    if (tmpDir) await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Tier 2: tesseract.js OCR — for scanned PDFs
 * Converts PDF pages to images via pdftoppm, then OCRs each page
 */
export async function extractWithOCR(
  buffer: Buffer
): Promise<ExtractionResult> {
  const start = Date.now();
  let tmpDir: string | null = null;

  try {
    tmpDir = await mkdtemp(join(tmpdir(), "sf-ocr-"));
    const inputPath = join(tmpDir, "input.pdf");
    await writeFile(inputPath, buffer);

    await execFileAsync(
      "pdftoppm",
      ["-png", "-r", "300", inputPath, join(tmpDir, "page")],
      { timeout: 180000 }
    );

    const tesseract = await import("tesseract.js");
    const { readdir } = await import("fs/promises");
    const files = (await readdir(tmpDir))
      .filter((f) => f.startsWith("page-") && f.endsWith(".png"))
      .sort();

    if (files.length === 0) {
      return {
        success: false,
        method: "ocr",
        error: "No page images generated for OCR",
      };
    }

    const pageTexts: string[] = [];
    let worker: any = null;

    try {
      worker = await tesseract.createWorker("eng");

      for (const file of files) {
        const { data } = await worker.recognize(join(tmpDir, file));
        pageTexts.push(data.text);
      }
    } finally {
      if (worker) await worker.terminate().catch(() => {});
    }

    const text = pageTexts.join("\n\n");
    const elapsed = Date.now() - start;
    console.log(
      `[pdfExtraction] OCR completed in ${elapsed}ms, pages: ${files.length}, text length: ${text.length}`
    );

    if (isScannedText(text)) {
      return {
        success: false,
        method: "ocr",
        error: "OCR could not extract readable text",
      };
    }

    return {
      success: true,
      text,
      pageCount: files.length,
      method: "ocr",
    };
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(
      `[pdfExtraction] OCR failed after ${elapsed}ms:`,
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      method: "ocr",
      error: error instanceof Error ? error.message : "OCR failed",
    };
  } finally {
    if (tmpDir) await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Tier 3: unpdf — modern PDF.js wrapper (JavaScript fallback)
 */
export async function extractWithUnpdf(
  buffer: Buffer
): Promise<ExtractionResult> {
  const start = Date.now();

  try {
    const { extractText } = await import("unpdf");
    const result = await extractText(buffer as any);

    const text = typeof result === "string" ? result : (result as any).text || "";
    const elapsed = Date.now() - start;
    console.log(
      `[pdfExtraction] unpdf completed in ${elapsed}ms, text length: ${text.length}`
    );

    if (!text || text.trim().length === 0) {
      return {
        success: false,
        method: "unpdf",
        error: "No text content found in PDF",
      };
    }

    return { success: true, text, method: "unpdf" };
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(
      `[pdfExtraction] unpdf failed after ${elapsed}ms:`,
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      method: "unpdf",
      error: error instanceof Error ? error.message : "unpdf failed",
    };
  }
}

/**
 * Tier 4: pdf-parse — legacy fallback (kept for compatibility)
 */
export async function extractWithPdfParse(
  buffer: Buffer
): Promise<ExtractionResult> {
  const start = Date.now();

  try {
    const pdf = await import("pdf-parse");
    const pdfData = await pdf.default(buffer, {
      max: 0,
      version: "v1.10.100",
    });

    const text = pdfData.text;
    const elapsed = Date.now() - start;
    console.log(
      `[pdfExtraction] pdf-parse completed in ${elapsed}ms, text length: ${text.length}`
    );

    if (!text || text.trim().length === 0) {
      return {
        success: false,
        method: "fallback",
        error: "No text content found in PDF",
      };
    }

    return {
      success: true,
      text,
      pageCount: pdfData.numpages,
      method: "fallback",
    };
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(
      `[pdfExtraction] pdf-parse failed after ${elapsed}ms:`,
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      method: "fallback",
      error: error instanceof Error ? error.message : "pdf-parse failed",
    };
  }
}

/**
 * Run the tiered extraction pipeline:
 *  1. poppler (fastest — C-based, ~50ms)
 *  2. OCR (for scanned PDFs — requires poppler-utils for pdftoppm)
 *  3. unpdf (modern JS fallback — better maintained than pdf-parse)
 *  4. pdf-parse (legacy fallback, always available)
 */
export async function extractPdfText(
  buffer: Buffer
): Promise<ExtractionResult> {
  const hasPoppler = await checkPoppler();

  if (hasPoppler) {
    const popplerResult = await extractWithPoppler(buffer);
    if (popplerResult.success) return popplerResult;

    if (popplerResult.error === "scanned_pdf") {
      console.log("[pdfExtraction] Detected scanned PDF — attempting OCR...");
      const ocrResult = await extractWithOCR(buffer);
      if (ocrResult.success) return ocrResult;
      console.log("[pdfExtraction] OCR failed — falling back to unpdf...");
    }
  }

  const unpdfResult = await extractWithUnpdf(buffer);
  if (unpdfResult.success) return unpdfResult;

  console.log("[pdfExtraction] unpdf failed — falling back to pdf-parse...");
  return extractWithPdfParse(buffer);
}
