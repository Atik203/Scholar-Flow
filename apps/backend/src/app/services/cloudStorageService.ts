import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { StorageProvider } from '../types/storage';

export interface FileUploadOptions {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  userId: string;
  workspaceId: string;
  metadata?: Record<string, string>;
}

export interface FileMetadata {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  checksum: string;
  storageProvider: StorageProvider;
  objectKey: string;
  url?: string;
  uploadedAt: Date;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
  fields?: Record<string, string>;
}

export interface FileDownloadResponse {
  url: string;
  expiresIn: number;
}

export class CloudStorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;
  private baseUrl: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'scholar-flow-dev';
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.baseUrl = process.env.AWS_S3_BASE_URL || `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Generate a presigned URL for direct client upload to S3
   */
  async generatePresignedUploadUrl(options: FileUploadOptions): Promise<PresignedUploadResponse> {
    const objectKey = this.generateObjectKey(options);
    const expiresIn = 3600; // 1 hour

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        ContentType: options.contentType,
        Metadata: {
          userId: options.userId,
          workspaceId: options.workspaceId,
          originalFileName: options.fileName,
          uploadedAt: new Date().toISOString(),
          ...options.metadata,
        },
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

      return {
        uploadUrl,
        objectKey,
        expiresIn,
      };
    } catch (error) {
      console.error('Error generating presigned upload URL:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  /**
   * Generate a presigned URL for file download
   */
  async generatePresignedDownloadUrl(objectKey: string, expiresIn: number = 3600): Promise<FileDownloadResponse> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      return {
        url,
        expiresIn,
      };
    } catch (error) {
      console.error('Error generating presigned download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  /**
   * Upload file directly to S3 (server-side upload)
   */
  async uploadFile(
    buffer: Buffer,
    options: FileUploadOptions
  ): Promise<{ objectKey: string; url: string; checksum: string }> {
    const objectKey = this.generateObjectKey(options);
    const checksum = this.calculateChecksum(buffer);

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: buffer,
        ContentType: options.contentType,
        Metadata: {
          userId: options.userId,
          workspaceId: options.workspaceId,
          originalFileName: options.fileName,
          uploadedAt: new Date().toISOString(),
          checksum,
          ...options.metadata,
        },
      });

      await this.s3Client.send(command);

      return {
        objectKey,
        url: `${this.baseUrl}/${objectKey}`,
        checksum,
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(objectKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Get file metadata from S3
   */
  async getFileMetadata(objectKey: string): Promise<{
    contentType: string;
    sizeBytes: number;
    lastModified: Date;
    metadata: Record<string, string>;
  }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      const response = await this.s3Client.send(command);

      return {
        contentType: response.ContentType || 'application/octet-stream',
        sizeBytes: response.ContentLength || 0,
        lastModified: response.LastModified || new Date(),
        metadata: response.Metadata || {},
      };
    } catch (error) {
      console.error('Error getting file metadata from S3:', error);
      throw new Error('Failed to get file metadata');
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(objectKey: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a unique object key for file storage
   */
  private generateObjectKey(options: FileUploadOptions): string {
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = options.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return `uploads/${options.workspaceId}/${options.userId}/${timestamp}-${randomId}-${sanitizedFileName}`;
  }

  /**
   * Calculate MD5 checksum for file integrity
   */
  private calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  /**
   * Validate file type and size
   */
  validateFile(file: { name: string; size: number; type: string }): {
    isValid: boolean;
    error?: string;
  } {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'application/rtf',
    ];

    const maxSizeBytes = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Only PDF, DOCX, DOC, TXT, and RTF files are allowed.',
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: 'File size exceeds maximum limit of 50MB.',
      };
    }

    return { isValid: true };
  }

  /**
   * Get public URL for file (if bucket is public)
   */
  getPublicUrl(objectKey: string): string {
    return `${this.baseUrl}/${objectKey}`;
  }
}

// Export singleton instance
export const cloudStorageService = new CloudStorageService();
