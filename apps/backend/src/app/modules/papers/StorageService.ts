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
        requestTimeout: 10000, // 10 second timeout (reduced)
        connectionTimeout: 3000, // 3 second connection timeout (reduced)
      },
      maxAttempts: 2, // Reduce retry attempts for faster failure
      retryMode: "standard", // Use standard retry mode for better predictability
    });
    this.bucket = bucket;

    console.log(
      `[StorageService] Initialized with bucket: ${bucket}, region: ${region}`
    );
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
        ContentType: params.contentType,
        ACL: "private",
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
      // Upload to S3 without ACL (since bucket doesn't support them)
      const result = await this.putObject({
        key: filename,
        body: buffer,
        contentType: contentType,
      });

      const uploadTime = Date.now() - uploadStart;
      console.log(`[StorageService] S3 putObject completed in ${uploadTime}ms`);

      // Generate presigned URL for frontend access (shorter expiry for faster generation)
      const presignedStart = Date.now();
      const url = await this.getSignedUrl(filename, 1800); // 30 minutes expiry
      const presignedTime = Date.now() - presignedStart;

      const totalTime = Date.now() - uploadStart;
      console.log(
        `[StorageService] Presigned URL generated in ${presignedTime}ms`
      );
      console.log(`[StorageService] Image upload completed in ${totalTime}ms`);

      return {
        url: url,
        filename: originalName,
        key: result.key,
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
