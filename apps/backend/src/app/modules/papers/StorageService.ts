import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface PutObjectParams {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}

export class StorageService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    const bucket = process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET;
    if (!bucket)
      throw new Error(
        "StorageService: bucket env var (AWS_BUCKET_NAME or S3_BUCKET) not set"
      );
    const region = process.env.AWS_REGION || "us-east-1";

    // Configure AWS SDK v3 client with performance optimizations
    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId:
          process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY || "",
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY || "",
      },
      requestHandler: {
        requestTimeout: 60000, // 60 second timeout for large uploads
        connectionTimeout: 15000, // 15 second connection timeout
      },
      maxAttempts: 3, // Allow more retries for reliability
      retryMode: "adaptive", // Use adaptive retry mode for better handling
    });
    this.bucket = bucket;

    console.log(
      `[StorageService] Initialized with bucket: ${bucket}, region: ${region}`
    );

    // Test connectivity on initialization (optional, for debugging)
    this.testConnection().catch((error) => {
      console.warn(
        `[StorageService] Initial connection test failed:`,
        error.message
      );
    });
  }

  /**
   * Test S3 connectivity and permissions
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log(`[StorageService] Testing S3 connection...`);
      const { HeadBucketCommand } = await import("@aws-sdk/client-s3");
      const command = new HeadBucketCommand({ Bucket: this.bucket });
      await this.s3.send(command);
      console.log(`[StorageService] S3 connection test successful`);
      return true;
    } catch (error) {
      console.error(`[StorageService] S3 connection test failed:`, error);
      return false;
    }
  }

  async putObject(params: PutObjectParams) {
    const uploadStart = Date.now();
    console.log(
      `[StorageService] Starting S3 putObject for key: ${params.key}, size: ${params.body.length} bytes`
    );

    try {
      const putObjectInput: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType || "application/octet-stream",
        // Remove ACL as it might not be supported by all S3 configurations
      };

      const command = new PutObjectCommand(putObjectInput);
      await this.s3.send(command);

      const uploadTime = Date.now() - uploadStart;
      const sizeMB = (params.body.length / 1024 / 1024).toFixed(2);
      console.log(
        `[StorageService] S3 putObject completed in ${uploadTime}ms for ${sizeMB}MB file`
      );

      return { key: params.key };
    } catch (error) {
      const uploadTime = Date.now() - uploadStart;
      console.error(
        `[StorageService] S3 putObject failed after ${uploadTime}ms:`,
        error
      );

      // Add more specific error information for debugging
      if (error instanceof Error) {
        console.error(`[StorageService] Error name: ${error.name}`);
        console.error(`[StorageService] Error message: ${error.message}`);
        if ("code" in error) {
          console.error(`[StorageService] Error code: ${(error as any).code}`);
        }
        if ("$metadata" in error) {
          console.error(
            `[StorageService] Error metadata:`,
            (error as any).$metadata
          );
        }
      }

      throw error;
    }
  }

  async getObject(key: string): Promise<Buffer> {
    const getObjectInput: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
    };

    const command = new GetObjectCommand(getObjectInput);
    const result = await this.s3.send(command);

    // Convert the readable stream to a buffer
    const chunks: Buffer[] = [];
    const stream = result.Body as NodeJS.ReadableStream;

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  async getSignedUrl(key: string, expiresSeconds = 300): Promise<string> {
    const getObjectInput: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
    };

    const command = new GetObjectCommand(getObjectInput);
    return await getSignedUrl(this.s3, command, {
      expiresIn: expiresSeconds,
    });
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    contentType: string
  ): Promise<{ url: string; filename: string; key: string }> {
    const uploadStart = Date.now();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = originalName.split(".").pop();
    const filename = `editor-images/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    console.log(
      `[StorageService] Uploading image: ${filename}, size: ${buffer.length} bytes, type: ${contentType}`
    );

    try {
      // Upload to S3
      const putObjectInput: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(putObjectInput);
      await this.s3.send(command);

      const uploadTime = Date.now() - uploadStart;
      console.log(`[StorageService] S3 putObject completed in ${uploadTime}ms`);

      // Generate presigned URL with 7-day expiry (604800 seconds)
      // This provides a good balance between security and usability
      const presignedStart = Date.now();
      const url = await this.getSignedUrl(filename, 604800); // 7 days
      const presignedTime = Date.now() - presignedStart;

      const totalTime = Date.now() - uploadStart;
      console.log(
        `[StorageService] Presigned URL generated in ${presignedTime}ms with 7-day expiry`
      );
      console.log(`[StorageService] Image upload completed in ${totalTime}ms`);

      return {
        url: url,
        filename: originalName,
        key: filename,
      };
    } catch (error) {
      const uploadTime = Date.now() - uploadStart;
      console.error(
        `[StorageService] Image upload failed after ${uploadTime}ms:`,
        error
      );
      throw error;
    }
  }
}
