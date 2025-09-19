import AWS from "aws-sdk";

export interface PutObjectParams {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}

export class StorageService {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    const bucket = process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET;
    if (!bucket)
      throw new Error(
        "StorageService: bucket env var (AWS_BUCKET_NAME or S3_BUCKET) not set"
      );
    const region = process.env.AWS_REGION || "us-east-1";

    // Configure AWS with performance optimizations
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY,
      secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY,
      region,
      signatureVersion: "v4",
      httpOptions: {
        timeout: 30000, // 30 second timeout
        connectTimeout: 5000, // 5 second connection timeout
      },
      maxRetries: 2, // Reduce retry attempts for faster failure
      retryDelayOptions: {
        customBackoff: (retryCount: number) => Math.pow(2, retryCount) * 100, // Faster backoff
      },
    });

    this.s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      // Additional S3-specific optimizations
      params: { Bucket: bucket }, // Set default bucket
      httpOptions: {
        timeout: 30000,
      },
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
      await this.s3
        .putObject({
          Bucket: this.bucket,
          Key: params.key,
          Body: params.body,
          ContentType: params.contentType,
          ACL: "private",
        })
        .promise();

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
    const result = await this.s3
      .getObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();

    return result.Body as Buffer;
  }

  getSignedUrl(key: string, expiresSeconds = 300) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresSeconds,
    });
  }
}
