import Bull from "bull";

// Check if Redis is configured
const isRedisConfigured = Boolean(
  process.env.REDIS_HOST && process.env.REDIS_PORT
);

let pdfProcessingQueue: Bull.Queue | null = null;
let queueReady = false;
let queueDisabledReason: string | null = null;

const disableQueue = (reason: string) => {
  if (queueDisabledReason) {
    return;
  }

  queueDisabledReason = reason;
  queueReady = false;

  if (pdfProcessingQueue) {
    const queueInstance = pdfProcessingQueue;
    pdfProcessingQueue = null;

    queueInstance.removeAllListeners();
    void queueInstance
      .close()
      .catch((error) =>
        console.warn(
          "[PDFQueue] Failed to close queue gracefully:",
          error instanceof Error ? error.message : error
        )
      );
  }

  console.warn(`[PDFQueue] Queue disabled: ${reason}`);
};

// Only initialize queue if Redis is configured
if (isRedisConfigured) {
  // Create a queue for document processing with Redis Cloud connection
  const redisConfig = {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    db: parseInt(process.env.REDIS_DB || "0"),
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || undefined,
    connectTimeout: 10000, // 10 seconds for Redis Cloud
    retryStrategy: (times: number) => {
      // Stop retrying after 3 attempts
      if (times > 3) {
        disableQueue("Max retry attempts reached");
        return null;
      }
      return Math.min(times * 1000, 3000); // Exponential backoff up to 3 seconds
    },
  };

  console.log(
    `[PDFQueue] Initializing queue with Redis: ${redisConfig.host}:${redisConfig.port}, DB: ${redisConfig.db}`
  );

  try {
    pdfProcessingQueue = new Bull("document-processing", {
      redis: redisConfig,
      settings: {
        stalledInterval: 30000,
        maxStalledCount: 1,
      },
    });

    // Add Redis connection event listeners
    pdfProcessingQueue.on("ready", () => {
      queueReady = true;
      queueDisabledReason = null;
      console.log("✅ [PDFQueue] Redis connection established successfully");
    });

    pdfProcessingQueue.on("error", (error) => {
      const message = error instanceof Error ? error.message : String(error);

      if (
        message.includes("Stream isn't writeable") ||
        message.includes("ECONNREFUSED") ||
        message.includes("WRONGPASS") ||
        message.includes("ENOTFOUND")
      ) {
        disableQueue(message);
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn("[PDFQueue] Redis error:", message);
      }
    });

    // Handle job failure gracefully
    pdfProcessingQueue.on("failed", (job, error) => {
      console.error(`[PDFQueue] Job ${job.id} failed:`, error.message);
    });
  } catch (error) {
    console.error("[PDFQueue] Failed to initialize queue:", error);
    pdfProcessingQueue = null;
  }
} else {
  console.log(
    "[PDFQueue] Redis not configured (REDIS_HOST/REDIS_PORT missing). Queue disabled - using synchronous processing."
  );
}

// Export helper to check if queue is ready
export const isQueueReady = () => queueReady && pdfProcessingQueue !== null;

// Only set up processors if queue is initialized
if (pdfProcessingQueue) {
  // Process document extraction jobs (PDF, DOCX, etc.)
  pdfProcessingQueue.process("extract-document", async (job) => {
    const { paperId } = job.data;

    try {
      console.log(`Processing document extraction for paper: ${paperId}`);

      // Import the service dynamically to avoid circular dependency
      const { documentExtractionService } = await import(
        "./documentExtractionService"
      );
      const result = await documentExtractionService.extractFromDocument(
        paperId,
        {
          preserveFormatting: true,
          includeHtml: true,
        }
      );

      if (result.success) {
        console.log(`Successfully processed document for paper: ${paperId}`);
        return { success: true, result };
      } else {
        console.error(
          `Failed to process document for paper: ${paperId}`,
          result.error
        );
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Error processing document for paper: ${paperId}`, error);
      throw error;
    }
  });

  // Keep the old PDF extraction job for backward compatibility
  pdfProcessingQueue.process("extract-pdf", async (job) => {
    const { paperId } = job.data;

    try {
      console.log(`Processing PDF extraction for paper: ${paperId} (legacy)`);

      // Import the new service
      const { documentExtractionService } = await import(
        "./documentExtractionService"
      );
      const result =
        await documentExtractionService.extractFromDocument(paperId);

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
  pdfProcessingQueue.on("completed", (job, result) => {
    console.log(
      `[DocumentQueue] Job ${job.id} completed successfully for paper: ${job.data.paperId}`
    );
    console.log(
      `[DocumentQueue] Result:`,
      result?.success ? "SUCCESS" : "FAILED"
    );
  });

  // Handle job failure
  pdfProcessingQueue.on("failed", (job, err) => {
    console.error(
      `[DocumentQueue] Job ${job.id} failed for paper: ${job.data.paperId}:`,
      err.message
    );
  });

  // Handle job progress and other events
  pdfProcessingQueue.on("active", (job) => {
    console.log(
      `[DocumentQueue] Job ${job.id} started processing for paper: ${job.data.paperId}`
    );
  });

  pdfProcessingQueue.on("stalled", (job) => {
    console.warn(
      `[DocumentQueue] Job ${job.id} stalled for paper: ${job.data.paperId}`
    );
  });

  pdfProcessingQueue.on("waiting", (jobId) => {
    console.log(`[DocumentQueue] Job ${jobId} is waiting to be processed`);
  });
}

// Add a job to process a specific document (PDF, DOCX, etc.)
export async function queueDocumentExtraction(paperId: string): Promise<void> {
  // Check if queue is ready before attempting to queue
  if (!queueReady || !pdfProcessingQueue) {
    console.warn(
      `[DocumentQueue] Redis not available${
        queueDisabledReason ? ` (${queueDisabledReason})` : ""
      }, falling back to synchronous processing for paper: ${paperId}`
    );
    throw new Error("QUEUE_NOT_AVAILABLE");
  }

  const queueStart = Date.now();
  try {
    console.log(
      `[DocumentQueue] Attempting to queue document extraction for paper: ${paperId}`
    );

    await pdfProcessingQueue.add(
      "extract-document",
      { paperId },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 10,
        removeOnFail: 5,
        // Allow enough time for document extraction (5 minutes for large documents)
        timeout: 300000,
      }
    );

    const queueTime = Date.now() - queueStart;
    console.log(
      `[DocumentQueue] Successfully queued document extraction for paper: ${paperId} in ${queueTime}ms`
    );
  } catch (error) {
    const queueTime = Date.now() - queueStart;
    console.error(
      `[DocumentQueue] Failed to queue document extraction for paper: ${paperId} after ${queueTime}ms:`,
      error
    );

    // Check if it's a Redis connection issue
    const errorCode = (error as any)?.code;
    const errorMessage = (error as any)?.message || "";

    if (
      errorCode === "ECONNREFUSED" ||
      errorCode === "ETIMEDOUT" ||
      errorMessage.includes("Redis") ||
      errorMessage.includes("connection")
    ) {
      console.warn(
        `[DocumentQueue] Redis connection issue detected for paper: ${paperId}. Throwing error to trigger fallback.`
      );
      throw new Error("QUEUE_NOT_AVAILABLE");
    }
    throw error;
  }
}

// Legacy function for backward compatibility
export async function queuePDFExtraction(paperId: string): Promise<void> {
  return queueDocumentExtraction(paperId);
}

// Process all unprocessed papers (for batch processing)
export async function processAllUnprocessedPapers(): Promise<void> {
  try {
    // Import the new service dynamically to avoid circular dependency
    const { documentExtractionService } = await import(
      "./documentExtractionService"
    );
    await documentExtractionService.processUnprocessedPapers();
  } catch (error) {
    console.error("Error processing unprocessed papers:", error);
    throw error;
  }
}

// Clean up old jobs
export async function cleanupOldJobs(): Promise<void> {
  if (!pdfProcessingQueue) {
    console.log("[DocumentQueue] Queue not initialized, skipping cleanup");
    return;
  }

  try {
    await pdfProcessingQueue.clean(24 * 60 * 60 * 1000, "completed"); // Clean completed jobs older than 24 hours
    await pdfProcessingQueue.clean(7 * 24 * 60 * 60 * 1000, "failed"); // Clean failed jobs older than 7 days
    console.log("[DocumentQueue] Successfully cleaned up old jobs");
  } catch (error) {
    console.error("[DocumentQueue] Error cleaning up old jobs:", error);
  }
}

export { pdfProcessingQueue };
