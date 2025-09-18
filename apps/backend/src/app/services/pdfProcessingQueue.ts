import Bull from 'bull';
import { pdfExtractionService } from '../services/pdfExtractionService';
import prisma from '../shared/prisma';

// Create a queue for PDF processing
const pdfProcessingQueue = new Bull('pdf-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

// Process PDF extraction jobs
pdfProcessingQueue.process('extract-pdf', async (job) => {
  const { paperId } = job.data;
  
  try {
    console.log(`Processing PDF extraction for paper: ${paperId}`);
    
    const result = await pdfExtractionService.extractTextFromPDF(paperId);
    
    if (result.success) {
      console.log(`Successfully processed PDF for paper: ${paperId}`);
      return { success: true, result };
    } else {
      console.error(`Failed to process PDF for paper: ${paperId}`, result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(`Error processing PDF for paper: ${paperId}`, error);
    throw error;
  }
});

// Handle job completion
pdfProcessingQueue.on('completed', (job, result) => {
  console.log(`PDF processing job ${job.id} completed successfully`);
});

// Handle job failure
pdfProcessingQueue.on('failed', (job, err) => {
  console.error(`PDF processing job ${job.id} failed:`, err.message);
});

// Add a job to process a specific paper
export async function queuePDFExtraction(paperId: string): Promise<void> {
  try {
    await pdfProcessingQueue.add('extract-pdf', { paperId }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 10,
      removeOnFail: 5,
    });
    console.log(`Queued PDF extraction for paper: ${paperId}`);
  } catch (error) {
    console.error(`Failed to queue PDF extraction for paper: ${paperId}`, error);
    throw error;
  }
}

// Process all unprocessed papers (for batch processing)
export async function processAllUnprocessedPapers(): Promise<void> {
  try {
    await pdfExtractionService.processUnprocessedPapers();
  } catch (error) {
    console.error('Error processing unprocessed papers:', error);
    throw error;
  }
}

// Clean up old jobs
export async function cleanupOldJobs(): Promise<void> {
  try {
    await pdfProcessingQueue.clean(24 * 60 * 60 * 1000, 'completed'); // Clean completed jobs older than 24 hours
    await pdfProcessingQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // Clean failed jobs older than 7 days
  } catch (error) {
    console.error('Error cleaning up old jobs:', error);
  }
}

export { pdfProcessingQueue };
