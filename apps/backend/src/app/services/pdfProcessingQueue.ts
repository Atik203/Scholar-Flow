import Bull from "bull";
import prisma from "../shared/prisma";

// Create a queue for PDF processing with Redis Cloud connection
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  db: parseInt(process.env.REDIS_DB || "0"),
  password: process.env.REDIS_PASSWORD || undefined,
  connectTimeout: 10000, // 10 second connection timeout for cloud Redis
  commandTimeout: 5000, // 5 second command timeout
  lazyConnect: true, // Don't connect immediately
  maxRetriesPerRequest: 3, // Allow more retries for cloud connections
};

console.log(
  `[PDFQueue] Connecting to Redis: ${redisConfig.host}:${redisConfig.port}, DB: ${redisConfig.db}`
);

const pdfProcessingQueue = new Bull("pdf-processing", {
  redis: redisConfig,
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  },
});

// Add Redis connection event listeners
pdfProcessingQueue.on("ready", () => {
  console.log("[PDFQueue] Redis connection established successfully");
});

pdfProcessingQueue.on("error", (error) => {
  console.error("[PDFQueue] Redis connection error:", error.message);
});

// Process PDF extraction jobs
pdfProcessingQueue.process("extract-pdf", async (job) => {
  const { paperId } = job.data;

  try {
    console.log(`Processing PDF extraction for paper: ${paperId}`);
    
    // Import the service dynamically to avoid circular dependency
    const { pdfExtractionService } = await import('./pdfExtractionService');
    const result = await pdfExtractionService.extractTextFromPDF(paperId);

    if (result.success) {
      console.log(`Successfully processed PDF for paper: ${paperId}`);
      return { success: true, result };
    } else {
      console.error(
        `Failed to process PDF for paper: ${paperId}`,
        result.error
      );
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(`Error processing PDF for paper: ${paperId}`, error);
    throw error;
  }
});

// Handle job completion
pdfProcessingQueue.on("completed", (job, _result) => {
  console.log(`PDF processing job ${job.id} completed successfully`);
});

// Handle job failure
pdfProcessingQueue.on("failed", (job, err) => {
  console.error(`PDF processing job ${job.id} failed:`, err.message);
});

// Add a job to process a specific paper
export async function queuePDFExtraction(paperId: string): Promise<void> {
  const queueStart = Date.now();
  try {
    console.log(
      `[PDFQueue] Attempting to queue PDF extraction for paper: ${paperId}`
    );

    await pdfProcessingQueue.add(
      "extract-pdf",
      { paperId },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 10,
        removeOnFail: 5,
        timeout: 5000, // 5 second timeout for queue operations
      }
    );

    const queueTime = Date.now() - queueStart;
    console.log(
      `[PDFQueue] Successfully queued PDF extraction for paper: ${paperId} in ${queueTime}ms`
    );
  } catch (error) {
    const queueTime = Date.now() - queueStart;
    console.error(
      `[PDFQueue] Failed to queue PDF extraction for paper: ${paperId} after ${queueTime}ms:`,
      error
    );
    // Check if it's a Redis connection issue
    const errorCode = (error as any)?.code;
    if (errorCode === "ECONNREFUSED" || errorCode === "ETIMEDOUT") {
      console.warn(
        `[PDFQueue] Redis connection issue detected. PDF processing will be skipped for paper: ${paperId}`
      );
      return; // Don't throw - allow upload to continue
    }
    throw error;
  }
}

// Process all unprocessed papers (for batch processing)
export async function processAllUnprocessedPapers(): Promise<void> {
  try {
    // Import the service dynamically to avoid circular dependency
    const { pdfExtractionService } = await import('./pdfExtractionService');
    await pdfExtractionService.processUnprocessedPapers();
  } catch (error) {
    console.error("Error processing unprocessed papers:", error);
    throw error;
  }
}

// Clean up old jobs
export async function cleanupOldJobs(): Promise<void> {
  try {
    await pdfProcessingQueue.clean(24 * 60 * 60 * 1000, "completed"); // Clean completed jobs older than 24 hours
    await pdfProcessingQueue.clean(7 * 24 * 60 * 60 * 1000, "failed"); // Clean failed jobs older than 7 days
  } catch (error) {
    console.error("Error cleaning up old jobs:", error);
  }
}

export { pdfProcessingQueue };
