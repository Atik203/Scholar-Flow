import { exec } from "child_process";
import { promisify } from "util";
import config from "../config";

const execAsync = promisify(exec);

export type DocxToPdfQuality = "draft" | "screen" | "print" | "prepress";

export interface DocxToPdfResult {
  success: boolean;
  pdfBuffer?: Buffer;
  error?: string;
  conversionTimeMs?: number;
  /** True when input was already a PDF — no conversion needed */
  passthrough?: boolean;
  /** Ratio of output size to input size (compression info) */
  compressionRatio?: number;
}

export interface DocxToPdfOptions {
  timeoutMs?: number;
  quality?: DocxToPdfQuality;
  /** Page range: e.g. "1-5" converts only pages 1-5 */
  pageRange?: string;
}

/** PDF magic bytes: %PDF */
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]);

const QUALITY_FLAGS: Record<DocxToPdfQuality, string> = {
  draft:
    "--convert-to pdf:writer_pdf_Export:SelectPdfVersion=1:Quality=50:MaxImageResolution=150",
  screen:
    "--convert-to pdf:writer_pdf_Export:SelectPdfVersion=1:Quality=75:MaxImageResolution=200",
  print:
    "--convert-to pdf:writer_pdf_Export:SelectPdfVersion=1:Quality=90:MaxImageResolution=300",
  prepress:
    "--convert-to pdf:writer_pdf_Export:SelectPdfVersion=2:Quality=100:MaxImageResolution=600:UseLosslessCompression=true:PDFUACompliance=true",
};

/**
 * Service for converting DOCX files to PDF using Gotenberg or LibreOffice (soffice).
 * Handles PDF passthrough, quality settings, and robust cleanup.
 */
export class DocxToPdfService {
  private readonly gotenbergUrl: string;
  private readonly engine: string;
  private readonly defaultQuality: DocxToPdfQuality;
  private readonly defaultTimeoutMs: number;

  constructor() {
    this.engine = config.docxToPdf?.engine || "soffice";
    this.gotenbergUrl = config.docxToPdf?.gotenbergUrl || "";
    this.defaultQuality = config.docxToPdf?.quality || "print";
    this.defaultTimeoutMs = config.docxToPdf?.requestTimeoutMs || 120000;
  }

  /**
   * Convert DOCX buffer to PDF buffer. Automatically skips conversion
   * if the input is already a PDF (detected by magic bytes).
   */
  async convertDocxToPdf(
    docxBuffer: Buffer,
    options: DocxToPdfOptions = {}
  ): Promise<DocxToPdfResult> {
    const startTime = Date.now();
    const timeoutMs = options.timeoutMs || this.defaultTimeoutMs;

    // PDF passthrough: if the input is already a PDF, return it directly
    if (this.isPdfBuffer(docxBuffer)) {
      const elapsed = Date.now() - startTime;
      console.log(
        `[DocxToPdf] PDF passthrough — input already a PDF (${docxBuffer.length} bytes, ${elapsed}ms)`
      );
      return {
        success: true,
        pdfBuffer: docxBuffer,
        conversionTimeMs: elapsed,
        passthrough: true,
        compressionRatio: 1,
      };
    }

    console.log(
      `[DocxToPdf] Starting conversion: engine=${this.engine}, timeout=${timeoutMs}ms, quality=${options.quality ?? this.defaultQuality}`
    );

    try {
      let result: DocxToPdfResult;

      if (this.engine === "gotenberg" && this.gotenbergUrl) {
        result = await this.convertWithGotenberg(
          docxBuffer,
          timeoutMs,
          options
        );
      } else {
        result = await this.convertWithLibreOffice(
          docxBuffer,
          timeoutMs,
          options
        );
      }

      if (result.success && result.pdfBuffer) {
        result.compressionRatio = parseFloat(
          (result.pdfBuffer.length / docxBuffer.length).toFixed(3)
        );
      }

      return result;
    } catch (error) {
      const elapsed = Date.now() - startTime;
      console.error(
        `[DocxToPdf] Conversion failed after ${elapsed}ms:`,
        error
      );

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown conversion error",
        conversionTimeMs: elapsed,
      };
    }
  }

  /**
   * Detect PDF by magic bytes
   */
  private isPdfBuffer(buffer: Buffer): boolean {
    if (buffer.length < 4) return false;
    return (
      buffer[0] === PDF_MAGIC[0] &&
      buffer[1] === PDF_MAGIC[1] &&
      buffer[2] === PDF_MAGIC[2] &&
      buffer[3] === PDF_MAGIC[3]
    );
  }

  /**
   * Convert using Gotenberg service
   */
  private async convertWithGotenberg(
    docxBuffer: Buffer,
    timeoutMs: number,
    options: DocxToPdfOptions
  ): Promise<DocxToPdfResult> {
    const startTime = Date.now();

    if (!this.gotenbergUrl) {
      throw new Error("GOTENBERG_URL is not configured");
    }

    try {
      const formData = new FormData();
      const docxBlob = new Blob([docxBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      formData.append("files", docxBlob, "document.docx");

      const quality = options.quality ?? this.defaultQuality;
      const pdfFormat = quality === "prepress" ? "PDF/A-2b" : "PDF/A-1b";
      formData.append("pdfFormat", pdfFormat);
      formData.append("landscape", "false");

      if (options.pageRange) {
        formData.append("nativePageRanges", options.pageRange);
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(
        `${this.gotenbergUrl}/forms/libreoffice/convert`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Gotenberg conversion failed: ${response.status} ${errorText}`
        );
      }

      const pdfBuffer = Buffer.from(await response.arrayBuffer());
      const elapsed = Date.now() - startTime;

      console.log(
        `[DocxToPdf] Gotenberg success: ${elapsed}ms, ${docxBuffer.length}→${pdfBuffer.length} bytes`
      );

      return { success: true, pdfBuffer, conversionTimeMs: elapsed };
    } catch (error) {
      console.warn(
        `[DocxToPdf] Gotenberg failed, falling back to LibreOffice:`,
        error
      );
      return await this.convertWithLibreOffice(docxBuffer, timeoutMs, options);
    }
  }

  /**
   * Convert using LibreOffice (soffice) with quality flags
   */
  private async convertWithLibreOffice(
    docxBuffer: Buffer,
    timeoutMs: number,
    options: DocxToPdfOptions
  ): Promise<DocxToPdfResult> {
    const startTime = Date.now();
    const fs = await import("fs/promises");
    const path = await import("path");
    const os = await import("os");

    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "docx2pdf-")
    );
    const inputPath = path.join(tempDir, "input.docx");
    const outputDir = path.join(tempDir, "output");

    try {
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(inputPath, docxBuffer);

      const quality = options.quality ?? this.defaultQuality;
      const qualityFlag = QUALITY_FLAGS[quality];
      const command = `soffice --headless ${qualityFlag} --outdir "${outputDir}" "${inputPath}"`;

      console.log(`[DocxToPdf] LibreOffice: ${command}`);

      const { stderr } = await execAsync(command, { timeout: timeoutMs });

      if (stderr && !stderr.includes("Warning")) {
        console.warn(`[DocxToPdf] LibreOffice stderr:`, stderr);
      }

      const outputPath = path.join(outputDir, "input.pdf");
      const pdfBuffer = await fs.readFile(outputPath);
      const elapsed = Date.now() - startTime;

      console.log(
        `[DocxToPdf] LibreOffice success: ${elapsed}ms, ${docxBuffer.length}→${pdfBuffer.length} bytes`
      );

      return { success: true, pdfBuffer, conversionTimeMs: elapsed };
    } finally {
      // Always cleanup — even on crash
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  /**
   * Check if conversion is available (health check)
   */
  async isAvailable(): Promise<boolean> {
    try {
      if (this.engine === "gotenberg" && this.gotenbergUrl) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${this.gotenbergUrl}/health`, {
          signal: controller.signal,
        }).catch(() => null);

        clearTimeout(timeout);
        return response?.ok ?? false;
      }

      const { stdout } = await execAsync("soffice --version", {
        timeout: 5000,
      });
      return stdout.includes("LibreOffice");
    } catch {
      return false;
    }
  }
}

export const docxToPdfService = new DocxToPdfService();
