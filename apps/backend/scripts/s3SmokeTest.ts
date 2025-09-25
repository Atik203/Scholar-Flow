/**
 * S3 Smoke Test Script
 *
 * Purpose: Quickly verify that the configured AWS S3 credentials, region, and bucket
 * (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION) are valid
 * and support basic operations (PUT -> HEAD -> GET -> DELETE).
 *
 * Usage (from repository root or backend package directory):
 *   yarn ts-node scripts/s3SmokeTest.ts
 * Or add an npm script alias if desired.
 *
 * This script uses AWS SDK v3 modular clients for better performance and tree-shaking.
 */
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import "dotenv/config";

// -------- Configuration & Validation --------
const requiredEnv = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_BUCKET_NAME",
  "AWS_REGION",
];

const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const bucket = process.env.AWS_BUCKET_NAME as string;
const region = process.env.AWS_REGION as string;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// -------- Test PDF Payload (Tiny Minimal PDF) --------
// A very small valid PDF header/footer to avoid large binary inclusion.
const minimalPdf = Buffer.from(
  `%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n`,
  "utf-8"
);

const run = async () => {
  const randomId = crypto.randomBytes(8).toString("hex");
  const key = `smoke-test/s3-test-${randomId}.pdf`;
  console.log(
    `ℹ️  Starting S3 smoke test against bucket='${bucket}' region='${region}' key='${key}'`
  );

  try {
    // 1. PUT Object
    console.log("➡️  Uploading test PDF...");
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: minimalPdf,
      ContentType: "application/pdf",
      ACL: "private",
    });
    await s3.send(putCommand);
    console.log("✅ Upload successful.");

    // 2. HEAD Object
    console.log("➡️  Verifying object with HEAD...");
    const headCommand = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const head = await s3.send(headCommand);
    console.log("✅ HEAD successful. Size =", head.ContentLength, "bytes");

    // 3. GET Object
    console.log("➡️  Downloading object...");
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const getRes = await s3.send(getCommand);
    if (!getRes.Body) {
      throw new Error("Downloaded object Body is empty");
    }

    // Convert stream to buffer for AWS SDK v3
    const chunks: Buffer[] = [];
    const stream = getRes.Body as NodeJS.ReadableStream;

    const downloaded = await new Promise<Buffer>((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

    if (downloaded.length !== minimalPdf.length) {
      console.warn(
        `⚠️  Downloaded size (${downloaded.length}) differs from uploaded (${minimalPdf.length}).`
      );
    } else {
      console.log("✅ Download size matches uploaded size.");
    }

    // 4. Generate Signed URL (optional demonstration)
    console.log("➡️  Generating a signed URL (60s)...");
    const signedGetCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const signedUrl = await getSignedUrl(s3, signedGetCommand, {
      expiresIn: 60,
    });
    console.log("🔗 Signed URL:", signedUrl);

    // 5. DELETE Object
    console.log("➡️  Deleting test object...");
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3.send(deleteCommand);
    console.log("✅ Deletion successful.");

    console.log("\n🎉 S3 Smoke Test PASSED. Basic operations functioning.");
  } catch (err: any) {
    console.error("\n❌ S3 Smoke Test FAILED.");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    if (err.code) console.error("AWS Error code:", err.code);
    console.error("Stack:", err.stack?.split("\n").slice(0, 5).join("\n"));
    process.exit(1);
  }
};

run();
