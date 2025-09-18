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
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY,
      secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY,
      region,
      signatureVersion: "v4",
    });
    this.s3 = new AWS.S3({ apiVersion: "2006-03-01" });
    this.bucket = bucket;
  }

  async putObject(params: PutObjectParams) {
    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
        ACL: "private",
      })
      .promise();
    return { key: params.key };
  }

  getSignedUrl(key: string, expiresSeconds = 300) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresSeconds,
    });
  }
}
