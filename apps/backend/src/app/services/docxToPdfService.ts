import { exec } from "child_process";
import { promisify } from "util";
import config from "../config";

const execAsync = promisify(exec);

export interface DocxToPdfResult {
  success: boolean;
  pdfBuffer?: Buffer;
  error?: string;
  conversionTimeMs?: number;
}

export interface DocxToPdfOptions {
  timeoutMs?: number;
  quality?: "low" | "medium" | "high";
}

/**
 * Service for converting DOCX files to PDF using Gotenberg or LibreOffice (soffice) fallback
 * Follows senior-level patterns: proper error handling, timeouts, performance monitoring
 */
export class DocxToPdfService {
  private readonly gotenbergUrl: string;
  private readonly engine: string;
  private readonly defaultTimeoutMs: number;

  constructor() {
    this.engine = config.docxToPdf?.engine || "soffice";
    this.gotenbergUrl = config.docxToPdf?.gotenbergUrl || "";
    this.defaultTimeoutMs = config.docxToPdf?.requestTimeoutMs || 120000; // 2 minutes default
  }

  /**
   * Convert DOCX buffer to PDF buffer
   */
  async convertDocxToPdf(
    docxBuffer: Buffer,
    options: DocxToPdfOptions = {}
  ): Promise<DocxToPdfResult> {
    const startTime = Date.now();
    const timeoutMs = options.timeoutMs || this.defaultTimeoutMs;

    console.log(
      `[DocxToPdf] Starting conversion using engine: ${this.engine}, timeout: ${timeoutMs}ms`
    );

    try {
      if (this.engine === "gotenberg" && this.gotenbergUrl) {
        return await this.convertWithGotenberg(docxBuffer, timeoutMs);
      } else {
        return await this.convertWithLibreOffice(docxBuffer, timeoutMs);
      }
    } catch (error) {
      const conversionTimeMs = Date.now() - startTime;
      console.error(
        `[DocxToPdf] Conversion failed after ${conversionTimeMs}ms:`,
        error
      );

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown conversion error",
        conversionTimeMs,
      };
    }
  }

  /**
   * Convert using Gotenberg service (primary method)
   */
  private async convertWithGotenberg(
    docxBuffer: Buffer,
    timeoutMs: number
  ): Promise<DocxToPdfResult> {
    const startTime = Date.now();

    if (!this.gotenbergUrl) {
      throw new Error("GOTENBERG_URL is not configured");
    }

    try {
      // Create FormData for Gotenberg API
      const formData = new FormData();
      const docxBlob = new Blob([docxBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      formData.append("files", docxBlob, "document.docx");

      // Optional: Add conversion parameters
      formData.append("pdfFormat", "PDF/A-1b"); // For archival quality
      formData.append("landscape", "false");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(
        `${this.gotenbergUrl}/forms/libreoffice/convert`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
          headers: {
            // Don't set Content-Type - let fetch set it with boundary for FormData
          },
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
      const conversionTimeMs = Date.now() - startTime;

      console.log(
        `[DocxToPdf] Gotenberg conversion successful: ${conversionTimeMs}ms, output: ${pdfBuffer.length} bytes`
      );

      return {
        success: true,
        pdfBuffer,
        conversionTimeMs,
      };
    } catch (error) {
      // If Gotenberg fails, try LibreOffice fallback
      console.warn(
        `[DocxToPdf] Gotenberg failed, trying LibreOffice fallback:`,
        error
      );
      return await this.convertWithLibreOffice(docxBuffer, timeoutMs);
    }
  }

  /**
   * Convert using LibreOffice (soffice) - fallback method
   */
  private async convertWithLibreOffice(
    docxBuffer: Buffer,
    timeoutMs: number
  ): Promise<DocxToPdfResult> {
    const startTime = Date.now();
    const fs = await import("fs/promises");
    const path = await import("path");
    const os = await import("os");

    try {
      // Create temporary directory and files
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "docx-to-pdf-"));
      const inputPath = path.join(tempDir, "input.docx");
      const outputDir = path.join(tempDir, "output");

      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(inputPath, docxBuffer);

      // Run LibreOffice conversion
      const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
      console.log(`[DocxToPdf] Running LibreOffice command: ${command}`);

      const { stderr } = await execAsync(command, { timeout: timeoutMs });

      if (stderr && !stderr.includes("Warning")) {
        console.warn(`[DocxToPdf] LibreOffice warnings:`, stderr);
      }

      // Read the generated PDF
      const outputPath = path.join(outputDir, "input.pdf");
      const pdfBuffer = await fs.readFile(outputPath);

      // Cleanup
      await fs.rm(tempDir, { recursive: true, force: true });

      const conversionTimeMs = Date.now() - startTime;
      console.log(
        `[DocxToPdf] LibreOffice conversion successful: ${conversionTimeMs}ms, output: ${pdfBuffer.length} bytes`
      );

      return {
        success: true,
        pdfBuffer,
        conversionTimeMs,
      };
    } catch (error) {
      const conversionTimeMs = Date.now() - startTime;
      console.error(
        `[DocxToPdf] LibreOffice conversion failed after ${conversionTimeMs}ms:`,
        error
      );

      throw new Error(
        `LibreOffice conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
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
        return response?.ok || false;
      } else {
        // Test LibreOffice availability
        const { stdout } = await execAsync("soffice --version", {
          timeout: 5000,
        });
        return stdout.includes("LibreOffice");
      }
    } catch (error) {
      console.warn(`[DocxToPdf] Availability check failed:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const docxToPdfService = new DocxToPdfService();
