// Cloud Storage Configuration
export const cloudStorageConfig = {
  // AWS S3 Configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    bucketName: process.env.AWS_S3_BUCKET_NAME || 'scholar-flow-dev',
    baseUrl: process.env.AWS_S3_BASE_URL || `https://scholar-flow-dev.s3.us-east-1.amazonaws.com`,
  },
  
  // File Upload Configuration
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '50'),
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain,application/rtf').split(','),
    uploadUrlExpiresIn: parseInt(process.env.UPLOAD_URL_EXPIRES_IN || '3600'),
    downloadUrlExpiresIn: parseInt(process.env.DOWNLOAD_URL_EXPIRES_IN || '3600'),
  },
  
  // Alternative: Google Cloud Storage
  gcs: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
    keyFile: process.env.GOOGLE_CLOUD_KEY_FILE || '',
    bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME || 'scholar-flow-dev',
  },
};

export default cloudStorageConfig;
