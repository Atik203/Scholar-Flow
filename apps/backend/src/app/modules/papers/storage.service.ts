import type { NodeHttpHandlerOptions } from "@smithy/node-http-handler";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import http from "http";
import https from "https";

export interface PutObjectParams {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}

class StorageServiceClass {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    const bucket = process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET;
    if (!bucket)
      throw new Error(
        "StorageService: bucket env var (AWS_BUCKET_NAME or S3_BUCKET) not set"
      );
    const region = process.env.AWS_REGION || "us-east-1";
    const isDev = process.env.NODE_ENV !== "production";

    // Persistent keep-alive agents for connection reuse across requests
    const httpAgent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 30000,
      maxSockets: 10,
      maxFreeSockets: 5,
      timeout: 60000,
    });
    const httpsAgent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: 30000,
      maxSockets: 10,
      maxFreeSockets: 5,
      timeout: 60000,
    });

    // NodeHttpHandlerOptions is accepted as a plain object by S3Client
    const requestHandlerConfig = {
      requestTimeout: isDev ? 30000 : 60000,
      connectionTimeout: isDev ? 10000 : 15000,
      httpAgent,
      httpsAgent,
    } as NodeHttpHandlerOptions;

    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId:
          process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY || "",
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY || "",
      },
      requestHandler: requestHandlerConfig,
      maxAttempts: isDev ? 1 : 3,
      retryMode: isDev ? "standard" : "adaptive",
      followRegionRedirects: true,
      systemClockOffset: 0,
    });

    this.bucket = bucket;

    console.log(
      `[StorageService] Initialized bucket=${bucket} region=${region} env=${isDev ? "dev" : "prod"} keepAlive=true maxAttempts=${isDev ? 1 : 3}`
    );
  }

  /**
   * Test S3 connectivity and permissions (call explicitly, not on every construction)
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
    const sizeMB = (params.body.length / 1024 / 1024).toFixed(2);
    console.log(
      `[StorageService] S3 putObject key=${params.key} size=${sizeMB}MB`
    );

    try {
      const putObjectInput: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType || "application/octet-stream",
      };

      const command = new PutObjectCommand(putObjectInput);
      await this.s3.send(command);

      const uploadTime = Date.now() - uploadStart;
      console.log(
        `[StorageService] S3 putObject done ${uploadTime}ms (${sizeMB}MB)`
      );
      return { key: params.key };
    } catch (error) {
      const uploadTime = Date.now() - uploadStart;
      console.error(
        `[StorageService] S3 putObject FAILED after ${uploadTime}ms:`,
        error instanceof Error ? error.message : error
      );
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
    const timestamp = Date.now();
    const fileExtension = originalName.split(".").pop();
    const filename = `editor-images/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    console.log(
      `[StorageService] uploadFile key=${filename} size=${buffer.length} type=${contentType}`
    );

    const putObjectInput: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(putObjectInput);
    await this.s3.send(command);

    const url = await this.getSignedUrl(filename, 604800); // 7 days

    return {
      url,
      filename: originalName,
      key: filename,
    };
  }
}

// Singleton via globalThis (same pattern as prisma.ts)
const globalForStorage = globalThis as unknown as {
  __storageService?: StorageServiceClass;
};

export const StorageService = globalForStorage.__storageService
  ? globalForStorage.__storageService
  : (globalForStorage.__storageService = new StorageServiceClass());

export { StorageServiceClass };
