# Document Extraction Workflow

## Overview

Scholar-Flow now features a **preview-first extraction workflow** that ensures formatting preservation and provides users with better control over the extraction process.

## Architecture

### Backend Components

1. **Document Extraction Service** (`documentExtractionService.ts`)
   - Handles PDF and DOCX text extraction
   - Generates preview PDFs for DOCX files using Gotenberg
   - Stores preview files in S3 with separate keys
   - Sanitizes extracted HTML content
   - Updates Paper records with preview information

2. **DOCX-to-PDF Service** (`docxToPdfService.ts`)
   - Primary: Gotenberg API for cloud-based conversion
   - Fallback: LibreOffice `soffice` command-line tool
   - Robust error handling and retry logic

3. **Preview URL API** (`paper.controller.ts`)
   - Generates signed S3 URLs for preview files
   - Handles both original and preview file access
   - Proper error handling for missing files

### Frontend Components

1. **ExtractionViewer** (`ExtractionViewer.tsx`)
   - Preview-first UI that shows document before extraction
   - Supports both PDF and DOCX files
   - Handles preview generation for DOCX files
   - Loading states and error handling
   - Extract/Re-extract functionality

2. **DocumentPreview** (`DocumentPreview.tsx`)
   - Enhanced with error handling props
   - Supports both original and preview file display
   - Fallback UI for unsupported formats

## Workflow

### 1. Document Upload

- User uploads PDF or DOCX file
- File stored in S3 with original formatting
- Paper record created with basic metadata

### 2. Preview Generation (DOCX only)

- When user visits paper detail page
- If DOCX file and no preview exists:
  - Backend converts DOCX → PDF using Gotenberg
  - Preview PDF stored in S3
  - Paper record updated with preview information

### 3. Preview Display

- ExtractionViewer shows document preview
- For PDF: shows original file
- For DOCX: shows generated preview PDF
- User can see formatting before extraction

### 4. Text Extraction

- User clicks "Extract Text" button
- Backend extracts text using appropriate service:
  - PDF: `pdf-parse` library
  - DOCX: `mammoth` library with HTML output
- Extracted content stored in Paper record
- HTML content sanitized for security

### 5. Content Management

- User can re-extract if needed
- Preview files cached for performance
- Original files always preserved

## Key Features

### Formatting Preservation

- DOCX files converted to PDF for consistent preview
- HTML extraction preserves basic formatting
- Content sanitization prevents XSS attacks

### Error Handling

- Graceful fallbacks for conversion failures
- User-friendly error messages
- Retry mechanisms for transient failures

### Performance

- Preview files cached in S3
- Signed URLs for secure access
- Lazy loading of preview generation

### Security

- Content sanitization with DOMPurify
- Signed S3 URLs with expiration
- Input validation on all endpoints

## Environment Configuration

Required environment variables for cloud deployment:

```bash
# DOCX to PDF Conversion
DOCX_TO_PDF_ENGINE=gotenberg  # or 'soffice'
GOTENBERG_URL=http://your-gotenberg-instance:3000

# AWS S3 Configuration
AWS_S3_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

## API Endpoints

### Get Preview URL

```
GET /api/papers/{paperId}/preview-url
```

Returns signed URL for document preview (original for PDF, preview for DOCX).

### Extract Text

```
POST /api/papers/{paperId}/extract
```

Triggers text extraction and stores result in Paper record.

## Database Schema

### Paper Model Updates

```prisma
model Paper {
  // ... existing fields

  // Preview and extraction fields
  previewFileKey     String?   // S3 key for preview file (DOCX->PDF)
  previewMimeType    String?   // MIME type of preview file
  originalMimeType   String?   // Original file MIME type
  contentHtml        String?   // Extracted HTML content
  extractionVersion  Int?      // Version tracking for re-extraction
}
```

## Testing

### Manual Testing

1. Upload a DOCX file
2. Navigate to paper detail page
3. Verify preview PDF generation
4. Test text extraction
5. Verify HTML content display

### Automated Testing

- Unit tests for extraction services
- Integration tests for API endpoints
- Frontend component tests for ExtractionViewer

## Future Enhancements

1. **Rich Text Editor Integration**
   - Edit extracted HTML content
   - Save changes back to Paper record
   - Version control for content changes

2. **Advanced Preview Features**
   - Thumbnail generation
   - Page-by-page navigation
   - Zoom and annotation tools

3. **Batch Processing**
   - Background processing for large files
   - Queue-based extraction system
   - Progress tracking for long operations

4. **Format Support**
   - Additional document formats (RTF, ODT)
   - Image-based PDF OCR
   - Table and figure extraction
