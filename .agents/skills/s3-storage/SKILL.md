# AWS S3 Storage Skill

## When to use this skill
Any task involving: file upload, PDF storage, image storage,
presigned URLs, S3 bucket operations, file deletion.

## Pre-task checklist
1. Read the upload/storage route file first
2. Check presigned URL generation pattern
3. Verify AWS credentials are backend-only
4. Check file size and type validation

## Key patterns
Upload flow: frontend requests presigned URL → backend generates → 
  frontend uploads directly to S3 → backend saves S3 key to DB
Image resize: backend resizes before upload (not after)
PDF: uploaded through backend S3 route
Deletion: always delete S3 object AND remove DB record together

## Critical constraints
- NEVER stream large files through backend — use presigned URLs
- NEVER expose AWS_ACCESS_KEY or AWS_SECRET_KEY in frontend
- NEVER hardcode S3 bucket names in frontend code
- ALWAYS validate file type and size on backend before generating URL
- ALWAYS use the existing S3 client instance — never create a new one
- S3 keys follow a consistent naming pattern — preserve it

## Files to read first
apps/backend/src/app/ → upload or storage routes
