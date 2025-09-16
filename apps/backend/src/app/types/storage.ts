export type StorageProvider = 's3' | 'gcs' | 'local';

export interface FileUploadRequest {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  workspaceId: string;
  metadata?: Record<string, string>;
}

export interface FileUploadResponse {
  fileId: string;
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
}

export interface FileDownloadRequest {
  fileId: string;
  expiresIn?: number;
}

export interface FileDownloadResponse {
  downloadUrl: string;
  expiresIn: number;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface FileMetadata {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  checksum: string;
  storageProvider: StorageProvider;
  objectKey: string;
  uploadedAt: Date;
  uploadedBy: string;
  workspaceId: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export interface FileProcessingResult {
  success: boolean;
  fileId: string;
  extractedText?: string;
  pageCount?: number;
  error?: string;
}
