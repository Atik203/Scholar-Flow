import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockS3Send = jest.fn<() => Promise<any>>();
const mockS3Client = jest.fn().mockImplementation(() => ({ send: mockS3Send }));

jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: mockS3Client,
  GetObjectCommand: jest.fn(),
  PutObjectCommand: jest.fn(),
  HeadBucketCommand: jest.fn(),
}));

const mockGetSignedUrl = jest.fn<Promise<string>, any[]>();
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: mockGetSignedUrl,
}));

import { StorageService } from "../app/modules/papers/storage.service";

describe("StorageService", () => {
  let storage: StorageService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_BUCKET_NAME = "test-bucket";
    process.env.AWS_REGION = "us-east-1";
    process.env.AWS_ACCESS_KEY_ID = "test-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret";
    mockS3Send.mockRejectedValue(new Error("connection test skip"));
    storage = new StorageService();
  });

  describe("putObject", () => {
    it("calls S3 PutObjectCommand with correct bucket and key", async () => {
      mockS3Send.mockResolvedValueOnce({});
      const result = await storage.putObject({ key: "uploads/test.pdf", body: Buffer.from("data"), contentType: "application/pdf" });
      expect(result).toEqual({ key: "uploads/test.pdf" });
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it("propagates S3 errors", async () => {
      mockS3Send.mockRejectedValueOnce(new Error("S3 upload failed"));
      await expect(storage.putObject({ key: "fail.pdf", body: Buffer.from("x") })).rejects.toThrow("S3 upload failed");
    });
  });

  describe("getSignedUrl", () => {
    it("generates presigned URL with correct expiry", async () => {
      mockGetSignedUrl.mockResolvedValueOnce("https://test-bucket.s3.us-east-1.amazonaws.com/test.pdf?signed");
      const url = await storage.getSignedUrl("test.pdf", 600);
      expect(url).toContain("test-bucket");
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
      const callArgs = mockGetSignedUrl.mock.calls[0] as unknown[];
      const opts = callArgs[2] as { expiresIn: number };
      expect(opts.expiresIn).toBe(600);
    });
  });
});
