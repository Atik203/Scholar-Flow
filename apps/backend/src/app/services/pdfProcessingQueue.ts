import Bull from "bull";

// Create a queue for document processing with Redis Cloud connection
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

const pdfProcessingQueue = new Bull("document-processing", {
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
    const result = await documentExtractionService.extractFromDocument(paperId);

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

// Add a job to process a specific document (PDF, DOCX, etc.)
export async function queueDocumentExtraction(paperId: string): Promise<void> {
  const queueStart = Date.now();
  try {
    console.log(
      `[DocumentQueue] Attempting to queue document extraction for paper: ${paperId}`
    );

    // Test Redis connection first
    await pdfProcessingQueue.isReady();
    console.log(
      `[DocumentQueue] Redis connection verified for paper: ${paperId}`
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
      throw error; // Throw to trigger fallback in controller
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
  try {
    await pdfProcessingQueue.clean(24 * 60 * 60 * 1000, "completed"); // Clean completed jobs older than 24 hours
    await pdfProcessingQueue.clean(7 * 24 * 60 * 60 * 1000, "failed"); // Clean failed jobs older than 7 days
  } catch (error) {
    console.error("Error cleaning up old jobs:", error);
  }
}

export { pdfProcessingQueue };
