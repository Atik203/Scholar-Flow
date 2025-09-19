import pdf from 'pdf-parse';
import { StorageService } from '../modules/papers/StorageService';
import prisma from '../shared/prisma';

export interface PDFExtractionResult {
  success: boolean;
  text?: string;
  pageCount?: number;
  error?: string;
  chunks?: Array<{
    idx: number;
    page?: number;
    content: string;
    tokenCount?: number;
  }>;
}

export class PDFExtractionService {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService();
  }

  /**
   * Extract text from PDF and chunk it for processing
   */
  async extractTextFromPDF(paperId: string): Promise<PDFExtractionResult> {
    try {
      console.log(`[PDFExtraction] Starting extraction for paper: ${paperId}`);
      
      // Get paper and file info
      const paper = await prisma.paper.findUnique({
        where: { id: paperId },
        include: { file: true },
      });

      if (!paper || !paper.file) {
        console.error(`[PDFExtraction] Paper or file not found for ID: ${paperId}`);
        return {
          success: false,
          error: 'Paper or file not found',
        };
      }

      console.log(`[PDFExtraction] Found paper: ${paper.title}, file: ${paper.file.objectKey}`);

      // Update processing status
      await prisma.paper.update({
        where: { id: paperId },
        data: { processingStatus: 'PROCESSING' },
      });

      console.log(`[PDFExtraction] Updated status to PROCESSING for paper: ${paperId}`);

      // Download PDF from S3
      console.log(`[PDFExtraction] Downloading PDF from S3: ${paper.file.objectKey}`);
      const pdfBuffer = await this.storage.getObject(paper.file.objectKey);
      console.log(`[PDFExtraction] Downloaded PDF buffer size: ${pdfBuffer.length} bytes`);
      
      // Extract text using pdf-parse
      console.log(`[PDFExtraction] Starting text extraction with pdf-parse`);
      const pdfData = await pdf(pdfBuffer, {
        // Options for better text extraction
        max: 0, // Parse all pages
        version: 'v1.10.100', // Use specific version for consistency
      });

      const extractedText = pdfData.text;
      const pageCount = pdfData.numpages;

      console.log(`[PDFExtraction] Extracted text length: ${extractedText.length}, pages: ${pageCount}`);

      if (!extractedText || extractedText.trim().length === 0) {
        console.error(`[PDFExtraction] No text content found in PDF for paper: ${paperId}`);
        await prisma.paper.update({
          where: { id: paperId },
          data: {
            processingStatus: 'FAILED',
            processingError: 'No text content found in PDF',
          },
        });

        return {
          success: false,
          error: 'No text content found in PDF',
        };
      }

      // Chunk the text for better processing
      console.log(`[PDFExtraction] Creating chunks for paper: ${paperId}`);
      const chunks = this.chunkText(extractedText, pageCount);
      console.log(`[PDFExtraction] Created ${chunks.length} chunks`);

      // Store chunks in database
      console.log(`[PDFExtraction] Storing chunks in database for paper: ${paperId}`);
      await this.storeChunks(paperId, chunks);

      // Update paper processing status and file info
      console.log(`[PDFExtraction] Updating paper status to PROCESSED for paper: ${paperId}`);
      await Promise.all([
        prisma.paper.update({
          where: { id: paperId },
          data: {
            processingStatus: 'PROCESSED',
            processedAt: new Date(),
            abstract: this.sanitizeText(this.extractAbstract(extractedText)),
          },
        }),
        prisma.paperFile.update({
          where: { paperId },
          data: {
            pageCount,
            extractedAt: new Date(),
          },
        }),
      ]);

      console.log(`[PDFExtraction] Successfully completed extraction for paper: ${paperId}`);

      return {
        success: true,
        text: extractedText,
        pageCount,
        chunks,
      };
    } catch (error) {
      console.error(`[PDFExtraction] Error processing PDF for paper ${paperId}:`, error);
      
      // Update processing status to failed
      try {
        await prisma.paper.update({
          where: { id: paperId },
          data: {
            processingStatus: 'FAILED',
            processingError: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      } catch (updateError) {
        console.error(`[PDFExtraction] Failed to update error status for paper ${paperId}:`, updateError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Chunk text into manageable pieces for processing
   */
  private chunkText(text: string, pageCount: number): Array<{
    idx: number;
    page?: number;
    content: string;
    tokenCount?: number;
  }> {
    const chunks: Array<{
      idx: number;
      page?: number;
      content: string;
      tokenCount?: number;
    }> = [];

    // Split text into pages first (approximate)
    const textPerPage = Math.ceil(text.length / pageCount);
    const pages = [];
    
    for (let i = 0; i < pageCount; i++) {
      const start = i * textPerPage;
      const end = Math.min(start + textPerPage, text.length);
      pages.push(text.slice(start, end));
    }

    // Create chunks from each page
    let chunkIndex = 0;
    pages.forEach((pageText, pageIndex) => {
      // Split page into smaller chunks (max 2000 characters)
      const maxChunkSize = 2000;
      const pageChunks = this.splitIntoChunks(pageText, maxChunkSize);
      
      pageChunks.forEach((chunkText) => {
        chunks.push({
          idx: chunkIndex++,
          page: pageIndex + 1,
          content: this.sanitizeText(chunkText),
          tokenCount: this.estimateTokenCount(chunkText),
        });
      });
    });

    return chunks;
  }

  /**
   * Split text into chunks of specified size
   */
  private splitIntoChunks(text: string, maxSize: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '.';
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
   * Extract abstract from the beginning of the text
   */
  private extractAbstract(text: string): string {
    // Look for common abstract patterns
    const abstractPatterns = [
      /abstract\s*:?\s*(.+?)(?:\n\n|\n\s*\n|introduction|1\.|background)/is,
      /summary\s*:?\s*(.+?)(?:\n\n|\n\s*\n|introduction|1\.|background)/is,
      /overview\s*:?\s*(.+?)(?:\n\n|\n\s*\n|introduction|1\.|background)/is,
    ];

    for (const pattern of abstractPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const abstract = match[1].trim();
        // Limit abstract length
        return abstract.length > 500 ? abstract.substring(0, 500) + '...' : abstract;
      }
    }

    // Fallback: take first paragraph
    const firstParagraph = text.split('\n\n')[0];
    if (firstParagraph && firstParagraph.length > 50) {
      return firstParagraph.length > 500 
        ? firstParagraph.substring(0, 500) + '...' 
        : firstParagraph;
    }

    return '';
  }

  /**
   * Sanitize text content to remove null bytes and other problematic characters
   */
  private sanitizeText(text: string): string {
    if (!text) return '';
    
    // Remove null bytes (0x00) and other control characters that can cause PostgreSQL issues
    return text
      .replace(/\0/g, '') // Remove null bytes
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove other control characters
      .trim();
  }

  /**
   * Store chunks in database
   */
  private async storeChunks(
    paperId: string,
    chunks: Array<{
      idx: number;
      page?: number;
      content: string;
      tokenCount?: number;
    }>
  ): Promise<void> {
    // Delete existing chunks first
    await prisma.paperChunk.deleteMany({
      where: { paperId },
    });

    // Insert new chunks with sanitized content
    await prisma.paperChunk.createMany({
      data: chunks.map((chunk) => ({
        paperId,
        idx: chunk.idx,
        page: chunk.page,
        content: this.sanitizeText(chunk.content),
        tokenCount: chunk.tokenCount,
      })),
    });
  }

  /**
   * Process all unprocessed papers
   */
  async processUnprocessedPapers(): Promise<void> {
    const unprocessedPapers = await prisma.paper.findMany({
      where: {
        processingStatus: 'UPLOADED',
        isDeleted: false,
      },
      include: { file: true },
    });

    console.log(`Found ${unprocessedPapers.length} unprocessed papers`);

    for (const paper of unprocessedPapers) {
      if (paper.file) {
        console.log(`Processing paper: ${paper.title}`);
        await this.extractTextFromPDF(paper.id);
      }
    }
  }
}

export const pdfExtractionService = new PDFExtractionService();
