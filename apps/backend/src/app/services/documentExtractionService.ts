import mammoth from "mammoth";
import pdf from "pdf-parse";
import { aiService } from "../modules/AI/ai.service";
import { StorageService } from "../modules/papers/StorageService";
import prisma from "../shared/prisma";
import { docxToPdfService } from "./docxToPdfService";

export interface DocumentExtractionResult {
  success: boolean;
  text?: string;
  htmlContent?: string;
  pageCount?: number;
  error?: string;
  chunks?: Array<{
    idx: number;
    page?: number;
    content: string;
    htmlContent?: string;
    tokenCount?: number;
  }>;
}

export interface DocumentProcessingOptions {
  preserveFormatting?: boolean;
  chunkSize?: number;
  includeHtml?: boolean;
}

export class DocumentExtractionService {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService();
  }

  /**
   * Extract text from document (PDF or DOCX) with format preservation
   */
  async extractFromDocument(
    paperId: string,
    options: DocumentProcessingOptions = {}
  ): Promise<DocumentExtractionResult> {
    try {
      console.log(
        `[DocumentExtraction] Starting extraction for paper: ${paperId}`
      );

      // Get paper and file info
      const paper = await prisma.paper.findUnique({
        where: { id: paperId },
        include: { file: true },
      });

      if (!paper || !paper.file) {
        console.error(
          `[DocumentExtraction] Paper or file not found for ID: ${paperId}`
        );
        return {
          success: false,
          error: "Paper or file not found",
        };
      }

      console.log(
        `[DocumentExtraction] Found paper: ${paper.title}, file: ${paper.file.objectKey}`
      );

      // Update processing status
      await prisma.paper.update({
        where: { id: paperId },
        data: { processingStatus: "PROCESSING" },
      });

      // Download file from S3
      console.log(
        `[DocumentExtraction] Downloading file from S3: ${paper.file.objectKey}`
      );
      const fileBuffer = await this.storage.getObject(paper.file.objectKey);
      console.log(
        `[DocumentExtraction] Downloaded file buffer size: ${fileBuffer.length} bytes`
      );

      // Determine file type and extract accordingly
      const fileName = paper.file.originalFilename || paper.file.objectKey;
      const fileExtension = fileName.toLowerCase().split(".").pop();
      let extractionResult: DocumentExtractionResult;

      switch (fileExtension) {
        case "pdf":
          extractionResult = await this.extractFromPDF(fileBuffer, options);
          break;
        case "docx":
          extractionResult = await this.extractFromDOCX(fileBuffer, options);
          break;
        case "doc":
          throw new Error(
            "DOC files are not currently supported. Please convert to DOCX format."
          );
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      if (!extractionResult.success) {
        await prisma.paper.update({
          where: { id: paperId },
          data: {
            processingStatus: "FAILED",
            processingError: extractionResult.error,
          },
        });
        return extractionResult;
      }

      // Generate preview PDF for DOCX files (for better format preservation in UI)
      let previewFileKey: string | null = null;
      let previewMimeType: string | null = null;

      if (fileExtension === "docx") {
        try {
          console.log(
            `[DocumentExtraction] Generating preview PDF for DOCX: ${paperId}`
          );
          const previewResult = await this.generatePreviewPdf(
            paperId,
            fileBuffer,
            fileName
          );
          if (previewResult.success && previewResult.previewFileKey) {
            previewFileKey = previewResult.previewFileKey;
            previewMimeType = "application/pdf";
            console.log(
              `[DocumentExtraction] Preview PDF generated: ${previewFileKey}`
            );
          } else {
            console.warn(
              `[DocumentExtraction] Preview generation failed: ${previewResult.error}`
            );
          }
        } catch (previewError) {
          console.error(
            `[DocumentExtraction] Preview generation error:`,
            previewError
          );
          // Don't fail the entire extraction if preview generation fails
        }
      }

      // Store chunks in database
      console.log(
        `[DocumentExtraction] Storing chunks in database for paper: ${paperId}`
      );
      await this.storeChunks(paperId, extractionResult.chunks!);

      // Update paper processing status and file info including preview data
      console.log(
        `[DocumentExtraction] Updating paper status to PROCESSED for paper: ${paperId}`
      );

      const paperUpdateData: any = {
        processingStatus: "PROCESSED",
        processedAt: new Date(),
        originalMimeType:
          paper.file?.contentType ||
          `application/${fileExtension === "docx" ? "vnd.openxmlformats-officedocument.wordprocessingml.document" : fileExtension}`,
        extractionVersion: 1,
      };

      // Add preview data if available
      if (previewFileKey && previewMimeType) {
        paperUpdateData.previewFileKey = previewFileKey;
        paperUpdateData.previewMimeType = previewMimeType;
      }

      // Store sanitized HTML content for rich text editor (future use)
      if (extractionResult.htmlContent) {
        paperUpdateData.contentHtml = this.sanitizeHtmlForEditor(
          extractionResult.htmlContent
        );
      }

      await Promise.all([
        prisma.paper.update({
          where: { id: paperId },
          data: paperUpdateData,
        }),
        prisma.paperFile.update({
          where: { paperId },
          data: {
            pageCount: extractionResult.pageCount,
            extractedAt: new Date(),
          },
        }),
      ]);

      const metadataText =
        extractionResult.text ||
        extractionResult.chunks?.map((chunk) => chunk.content).join("\n") ||
        "";

      if (metadataText.trim().length > 0) {
        try {
          await aiService.extractAndPersistMetadata({
            paperId,
            text: metadataText,
            originalTitle: paper.title,
            currentTitle: paper.title,
            currentAbstract: paper.abstract,
            existingMetadata: paper.metadata as unknown as Record<
              string,
              unknown
            > | null,
            workspaceId: paper.workspaceId,
            uploaderId: paper.uploaderId,
          });
          console.log(
            `[DocumentExtraction] AI metadata enrichment applied for paper: ${paperId}`
          );
        } catch (metadataError) {
          console.error(
            `[DocumentExtraction] AI metadata enrichment failed for paper: ${paperId}`,
            metadataError
          );
        }
      } else {
        console.warn(
          `[DocumentExtraction] Skipping AI metadata enrichment for paper: ${paperId} (no text available)`
        );
      }

      console.log(
        `[DocumentExtraction] Successfully completed extraction for paper: ${paperId}`
      );

      return extractionResult;
    } catch (error) {
      console.error(
        `[DocumentExtraction] Error processing document for paper ${paperId}:`,
        error
      );

      // Update processing status to failed
      try {
        await prisma.paper.update({
          where: { id: paperId },
          data: {
            processingStatus: "FAILED",
            processingError:
              error instanceof Error ? error.message : "Unknown error",
          },
        });
      } catch (updateError) {
        console.error(
          `[DocumentExtraction] Failed to update error status for paper ${paperId}:`,
          updateError
        );
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Extract text from PDF with enhanced format preservation
   */
  private async extractFromPDF(
    buffer: Buffer,
    options: DocumentProcessingOptions
  ): Promise<DocumentExtractionResult> {
    try {
      console.log(
        `[DocumentExtraction] Starting PDF extraction with pdf-parse`
      );

      // Extract text using pdf-parse with enhanced options
      const pdfData = await pdf(buffer, {
        max: 0, // Parse all pages
        version: "v1.10.100",
      });

      const extractedText = pdfData.text;
      const pageCount = pdfData.numpages;

      console.log(
        `[DocumentExtraction] PDF extraction completed. Text length: ${extractedText.length}, pages: ${pageCount}`
      );

      if (!extractedText || extractedText.trim().length === 0) {
        return {
          success: false,
          error: "No text content found in PDF",
        };
      }

      // Sanitize and process the text
      const sanitizedText = this.sanitizeText(extractedText);

      // Enhanced chunking that tries to preserve structure
      const chunks = this.createStructuredChunks(
        sanitizedText,
        pageCount,
        options.chunkSize || 2000
      );

      return {
        success: true,
        text: sanitizedText,
        pageCount,
        chunks,
      };
    } catch (error) {
      console.error(`[DocumentExtraction] PDF extraction failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "PDF extraction failed",
      };
    }
  }

  /**
   * Extract text from DOCX with full format preservation
   */
  private async extractFromDOCX(
    buffer: Buffer,
    options: DocumentProcessingOptions
  ): Promise<DocumentExtractionResult> {
    try {
      console.log(`[DocumentExtraction] Starting DOCX extraction with mammoth`);

      // Convert buffer to proper format for mammoth
      const mammothBuffer = {
        buffer: buffer,
      };

      // Extract with mammoth for high-quality HTML output
      const mammothResult = await mammoth.convertToHtml(mammothBuffer, {
        styleMap: [
          // Preserve common document structures
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Title'] => h1.title:fresh",
          "p[style-name='Quote'] => blockquote:fresh",
        ],
      });

      const htmlContent = mammothResult.value;

      // Also extract plain text for compatibility
      const plainTextResult = await mammoth.extractRawText(mammothBuffer);
      const extractedText = plainTextResult.value;

      console.log(
        `[DocumentExtraction] DOCX extraction completed. Text length: ${extractedText.length}, HTML length: ${htmlContent.length}`
      );

      if (!extractedText || extractedText.trim().length === 0) {
        return {
          success: false,
          error: "No text content found in DOCX",
        };
      }

      // Log any conversion warnings
      if (mammothResult.messages.length > 0) {
        console.log(
          `[DocumentExtraction] DOCX conversion warnings:`,
          mammothResult.messages
        );
      }

      // Sanitize texts
      const sanitizedText = this.sanitizeText(extractedText);
      const sanitizedHtml = this.sanitizeText(htmlContent);

      // Create chunks that preserve HTML structure when possible
      const chunks = this.createStructuredChunksFromHtml(
        sanitizedText,
        sanitizedHtml,
        options.chunkSize || 2000
      );

      return {
        success: true,
        text: sanitizedText,
        htmlContent: sanitizedHtml,
        pageCount: 1, // DOCX doesn't have fixed pages like PDF
        chunks,
      };
    } catch (error) {
      console.error(`[DocumentExtraction] DOCX extraction failed:`, error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "DOCX extraction failed",
      };
    }
  }

  /**
   * Create structured chunks that preserve document hierarchy
   */
  private createStructuredChunks(
    text: string,
    pageCount: number,
    chunkSize: number
  ): Array<{
    idx: number;
    page?: number;
    content: string;
    tokenCount?: number;
  }> {
    if (!text) return [];

    const chunks: Array<{
      idx: number;
      page?: number;
      content: string;
      tokenCount?: number;
    }> = [];

    // Try to identify document structure
    const sections = this.identifyDocumentSections(text);

    let chunkIndex = 0;
    const safePageCount = Math.max(1, pageCount);

    // Process each section
    for (const section of sections) {
      const sectionChunks = this.splitIntoChunks(section.content, chunkSize);

      for (const chunkText of sectionChunks) {
        const sanitized = this.sanitizeText(chunkText);
        if (sanitized.length > 0) {
          // Estimate which page this content belongs to
          const estimatedPage = Math.min(
            Math.ceil((chunkIndex + 1) * (safePageCount / sections.length)),
            safePageCount
          );

          chunks.push({
            idx: chunkIndex++,
            page: estimatedPage,
            content: sanitized,
            tokenCount: this.estimateTokenCount(sanitized),
          });
        }
      }
    }

    return chunks;
  }

  /**
   * Create structured chunks from HTML content
   */
  private createStructuredChunksFromHtml(
    plainText: string,
    htmlContent: string,
    chunkSize: number
  ): Array<{
    idx: number;
    page?: number;
    content: string;
    htmlContent?: string;
    tokenCount?: number;
  }> {
    if (!plainText) return [];

    const chunks: Array<{
      idx: number;
      page?: number;
      content: string;
      htmlContent?: string;
      tokenCount?: number;
    }> = [];

    // Extract structured content from HTML
    const htmlSections = this.parseHtmlSections(htmlContent);
    const textSections = this.identifyDocumentSections(plainText);

    let chunkIndex = 0;

    // Match HTML sections with text sections when possible
    for (
      let i = 0;
      i < Math.max(htmlSections.length, textSections.length);
      i++
    ) {
      const htmlSection = htmlSections[i];
      const textSection = textSections[i];

      const content = textSection?.content || "";
      const htmlPart = htmlSection?.html || "";

      if (content.length > 0) {
        const contentChunks = this.splitIntoChunks(content, chunkSize);
        const htmlChunks = htmlPart
          ? this.splitHtmlIntoChunks(htmlPart, chunkSize)
          : [];

        for (let j = 0; j < contentChunks.length; j++) {
          const sanitizedContent = this.sanitizeText(contentChunks[j]);
          const sanitizedHtml = htmlChunks[j]
            ? this.sanitizeText(htmlChunks[j])
            : undefined;

          if (sanitizedContent.length > 0) {
            chunks.push({
              idx: chunkIndex++,
              page: 1, // DOCX is treated as single page
              content: sanitizedContent,
              htmlContent: sanitizedHtml,
              tokenCount: this.estimateTokenCount(sanitizedContent),
            });
          }
        }
      }
    }

    return chunks;
  }

  /**
   * Identify document sections based on headings and structure
   */
  private identifyDocumentSections(
    text: string
  ): Array<{ type: string; content: string }> {
    const sections: Array<{ type: string; content: string }> = [];

    // Split by common section patterns
    const sectionPatterns = [
      /^(abstract|summary|introduction|background|methodology|results|conclusion|references?|bibliography)[\s\n]/im,
      /^[IVX]+\.\s+/m, // Roman numerals
      /^\d+\.\s+/m, // Numbered sections
      /^#+\s+/m, // Markdown-style headers
    ];

    let currentSection = { type: "content", content: "" };
    const lines = text.split("\n");

    for (const line of lines) {
      let isNewSection = false;

      for (const pattern of sectionPatterns) {
        if (pattern.test(line)) {
          // Save current section if it has content
          if (currentSection.content.trim().length > 0) {
            sections.push(currentSection);
          }

          // Start new section
          currentSection = {
            type: line
              .trim()
              .toLowerCase()
              .replace(/[^\w\s]/g, "")
              .substring(0, 20),
            content: line + "\n",
          };
          isNewSection = true;
          break;
        }
      }

      if (!isNewSection) {
        currentSection.content += line + "\n";
      }
    }

    // Add final section
    if (currentSection.content.trim().length > 0) {
      sections.push(currentSection);
    }

    // If no sections were identified, treat entire text as one section
    if (sections.length === 0) {
      sections.push({ type: "content", content: text });
    }

    return sections;
  }

  /**
   * Parse HTML into structured sections
   */
  private parseHtmlSections(
    html: string
  ): Array<{ type: string; html: string }> {
    const sections: Array<{ type: string; html: string }> = [];

    // Simple HTML parsing - look for headings and block elements
    const htmlSectionRegex =
      /<(h[1-6]|div|section|article|p)([^>]*)>(.*?)<\/\1>/gis;
    let match;
    let lastIndex = 0;

    while ((match = htmlSectionRegex.exec(html)) !== null) {
      const [fullMatch, tag] = match;

      // Add any content before this match
      if (match.index > lastIndex) {
        const beforeContent = html.slice(lastIndex, match.index).trim();
        if (beforeContent) {
          sections.push({ type: "content", html: beforeContent });
        }
      }

      sections.push({
        type: tag.toLowerCase(),
        html: fullMatch,
      });

      lastIndex = match.index + fullMatch.length;
    }

    // Add any remaining content
    if (lastIndex < html.length) {
      const remainingContent = html.slice(lastIndex).trim();
      if (remainingContent) {
        sections.push({ type: "content", html: remainingContent });
      }
    }

    return sections;
  }

  /**
   * Split HTML content into chunks while preserving structure
   */
  private splitHtmlIntoChunks(html: string, maxSize: number): string[] {
    const chunks: string[] = [];

    // Simple approach: split by major HTML elements
    const elements = html.split(/(<\/(?:p|div|h[1-6]|section|article)>)/i);
    let currentChunk = "";

    for (const element of elements) {
      if (
        currentChunk.length + element.length > maxSize &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());
        currentChunk = element;
      } else {
        currentChunk += element;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Split text into chunks while preserving sentence boundaries
   */
  private splitIntoChunks(text: string, maxSize: number): string[] {
    const chunks: string[] = [];
    let currentChunk = "";

    // Split by sentences first, then by paragraphs if needed
    const sentences = text.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      if (
        currentChunk.length + sentence.length > maxSize &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Sanitize text content to remove problematic characters
   */
  private sanitizeText(text: string): string {
    if (!text) return "";

    // Fast path: replace explicit null bytes first
    let cleaned = text.replace(/\0/g, "");

    // Filter out remaining problematic code points while preserving common whitespace
    const builder: string[] = [];
    for (const ch of cleaned) {
      const code = ch.codePointAt(0)!;
      // Remove C0 controls except tab (9), LF (10), CR (13)
      if (code < 32 && code !== 9 && code !== 10 && code !== 13) continue;
      // Delete DEL
      if (code === 127) continue;
      // Remove surrogate halves (invalid in UTF-8/UTF-32 strings)
      if (code >= 0xd800 && code <= 0xdfff) continue;
      // Remove non-characters U+FFFE, U+FFFF
      if (code === 0xfffe || code === 0xffff) continue;
      builder.push(ch);
    }
    cleaned = builder.join("");
    return cleaned.trim();
  }

  /**
   * Store chunks in database with enhanced content support
   */
  private async storeChunks(
    paperId: string,
    chunks: Array<{
      idx: number;
      page?: number;
      content: string;
      htmlContent?: string;
      tokenCount?: number;
    }>
  ): Promise<void> {
    // Delete existing chunks first
    await prisma.paperChunk.deleteMany({
      where: { paperId },
    });

    // Prepare chunks for insertion
    const prepared = chunks
      .map((chunk) => ({
        paperId,
        idx: chunk.idx,
        page: chunk.page,
        content: this.sanitizeText(chunk.content),
        // Note: Add htmlContent field to schema if needed for HTML storage
        tokenCount: chunk.tokenCount,
      }))
      .filter((c) => c.content && c.content.length > 0);

    if (prepared.length > 0) {
      await prisma.paperChunk.createMany({ data: prepared });
    }
  }

  /**
   * Process all unprocessed papers with the new extraction service
   */
  async processUnprocessedPapers(): Promise<void> {
    const unprocessedPapers = await prisma.paper.findMany({
      where: {
        processingStatus: "UPLOADED",
        isDeleted: false,
      },
      include: { file: true },
    });

    console.log(
      `[DocumentExtraction] Found ${unprocessedPapers.length} unprocessed papers`
    );

    for (const paper of unprocessedPapers) {
      if (paper.file) {
        console.log(`[DocumentExtraction] Processing paper: ${paper.title}`);
        await this.extractFromDocument(paper.id, {
          preserveFormatting: true,
          includeHtml: true,
        });
      }
    }
  }

  /**
   * Generate preview PDF for DOCX files using docxToPdfService
   */
  private async generatePreviewPdf(
    paperId: string,
    docxBuffer: Buffer,
    originalFilename: string
  ): Promise<{ success: boolean; previewFileKey?: string; error?: string }> {
    try {
      console.log(
        `[DocumentExtraction] Converting DOCX to PDF for preview: ${paperId}`
      );

      const conversionResult = await docxToPdfService.convertDocxToPdf(
        docxBuffer,
        {
          timeoutMs: 180000, // 3 minutes for large documents
        }
      );

      if (!conversionResult.success || !conversionResult.pdfBuffer) {
        return {
          success: false,
          error: conversionResult.error || "PDF conversion failed",
        };
      }

      // Upload preview PDF to S3 in a dedicated previews folder
      const previewFileName = originalFilename.replace(
        /\.(docx|doc)$/i,
        ".pdf"
      );
      const previewObjectKey = `previews/${paperId}/${Date.now()}-${previewFileName}`;

      console.log(
        `[DocumentExtraction] Uploading preview PDF to S3: ${previewObjectKey}`
      );

      await this.storage.putObject({
        key: previewObjectKey,
        body: conversionResult.pdfBuffer,
        contentType: "application/pdf",
      });

      console.log(
        `[DocumentExtraction] Preview PDF generated successfully in ${conversionResult.conversionTimeMs}ms`
      );

      return {
        success: true,
        previewFileKey: previewObjectKey,
      };
    } catch (error) {
      console.error(
        `[DocumentExtraction] Preview PDF generation failed:`,
        error
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown preview generation error",
      };
    }
  }

  /**
   * Sanitize HTML content for rich text editor storage
   * This is a basic implementation - consider using a library like DOMPurify for production
   */
  private sanitizeHtmlForEditor(html: string): string {
    try {
      // Basic HTML sanitization for editor content
      // Remove script tags and potentially dangerous attributes
      let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/on\w+="[^"]*"/gi, "") // Remove event handlers
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/data:/gi, "") // Remove data: protocol for security
        .replace(/<iframe\b[^>]*>/gi, "") // Remove iframes
        .replace(/<embed\b[^>]*>/gi, "") // Remove embeds
        .replace(/<object\b[^>]*>.*?<\/object>/gi, ""); // Remove objects

      // Limit the size to prevent abuse (100KB limit)
      if (sanitized.length > 102400) {
        sanitized = sanitized.substring(0, 102400) + "... [content truncated]";
      }

      return sanitized;
    } catch (error) {
      console.error(`[DocumentExtraction] HTML sanitization failed:`, error);
      return ""; // Return empty string if sanitization fails
    }
  }
}

export const documentExtractionService = new DocumentExtractionService();
