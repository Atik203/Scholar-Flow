import { Request, Response } from 'express';
import { cloudStorageService } from '../services/cloudStorageService';
import { prisma } from '../shared/prisma';
import { authMiddleware } from '../middleware/auth';
import { FileUploadRequest, FileDownloadRequest } from '../types/storage';
import { ApiResponse } from '../types/common';

/**
 * Generate presigned URL for direct file upload to cloud storage
 * POST /api/files/upload-url
 */
export const generateUploadUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
    }

    const { fileName, contentType, sizeBytes, workspaceId, metadata }: FileUploadRequest = req.body;

    // Validate required fields
    if (!fileName || !contentType || !sizeBytes || !workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fileName, contentType, sizeBytes, workspaceId',
      } as ApiResponse);
    }

    // Validate file
    const validation = cloudStorageService.validateFile({
      name: fileName,
      size: sizeBytes,
      type: contentType,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      } as ApiResponse);
    }

    // Check if user has access to workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
        isDeleted: false,
      },
    });

    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to workspace',
      } as ApiResponse);
    }

    // Generate presigned upload URL
    const uploadResponse = await cloudStorageService.generatePresignedUploadUrl({
      fileName,
      contentType,
      sizeBytes,
      userId,
      workspaceId,
      metadata,
    });

    // Create file record in database
    const fileRecord = await prisma.paperFile.create({
      data: {
        objectKey: uploadResponse.objectKey,
        contentType,
        sizeBytes,
        storageProvider: 's3',
        paper: {
          create: {
            title: fileName,
            workspaceId,
            uploaderId: userId,
            metadata: {
              originalFileName: fileName,
              uploadMethod: 'direct',
              ...metadata,
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        uploadUrl: uploadResponse.uploadUrl,
        objectKey: uploadResponse.objectKey,
        expiresIn: uploadResponse.expiresIn,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } as ApiResponse);
  }
};

/**
 * Confirm file upload completion and update metadata
 * POST /api/files/confirm-upload
 */
export const confirmUpload = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
    }

    const { fileId, checksum } = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required',
      } as ApiResponse);
    }

    // Get file record
    const fileRecord = await prisma.paperFile.findUnique({
      where: { id: fileId },
      include: { paper: true },
    });

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      } as ApiResponse);
    }

    // Check if user has access
    if (fileRecord.paper.uploaderId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      } as ApiResponse);
    }

    // Verify file exists in storage
    const exists = await cloudStorageService.fileExists(fileRecord.objectKey);
    if (!exists) {
      return res.status(400).json({
        success: false,
        message: 'File not found in storage',
      } as ApiResponse);
    }

    // Get file metadata from storage
    const storageMetadata = await cloudStorageService.getFileMetadata(fileRecord.objectKey);

    // Update file record with checksum and metadata
    const updatedFile = await prisma.paperFile.update({
      where: { id: fileId },
      data: {
        checksum: checksum || storageMetadata.metadata.checksum,
        contentType: storageMetadata.contentType,
        sizeBytes: storageMetadata.sizeBytes,
      },
    });

    res.json({
      success: true,
      data: {
        fileId: updatedFile.id,
        message: 'File upload confirmed successfully',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error confirming upload:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } as ApiResponse);
  }
};

/**
 * Generate presigned URL for file download
 * POST /api/files/download-url
 */
export const generateDownloadUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
    }

    const { fileId, expiresIn = 3600 }: FileDownloadRequest = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required',
      } as ApiResponse);
    }

    // Get file record
    const fileRecord = await prisma.paperFile.findUnique({
      where: { id: fileId },
      include: { 
        paper: { 
          include: { 
            workspace: { 
              include: { members: true } 
            } 
          } 
        } 
      },
    });

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      } as ApiResponse);
    }

    // Check if user has access to workspace
    const hasAccess = fileRecord.paper.uploaderId === userId ||
      fileRecord.paper.workspace.ownerId === userId ||
      fileRecord.paper.workspace.members.some(member => member.userId === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      } as ApiResponse);
    }

    // Generate presigned download URL
    const downloadResponse = await cloudStorageService.generatePresignedDownloadUrl(
      fileRecord.objectKey,
      expiresIn
    );

    res.json({
      success: true,
      data: {
        downloadUrl: downloadResponse.url,
        expiresIn: downloadResponse.expiresIn,
        fileName: fileRecord.paper.title,
        contentType: fileRecord.contentType,
        sizeBytes: fileRecord.sizeBytes,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } as ApiResponse);
  }
};

/**
 * Get file metadata
 * GET /api/files/:fileId/metadata
 */
export const getFileMetadata = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
    }

    const { fileId } = req.params;

    // Get file record
    const fileRecord = await prisma.paperFile.findUnique({
      where: { id: fileId },
      include: { 
        paper: { 
          include: { 
            workspace: { 
              include: { members: true } 
            } 
          } 
        } 
      },
    });

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      } as ApiResponse);
    }

    // Check if user has access to workspace
    const hasAccess = fileRecord.paper.uploaderId === userId ||
      fileRecord.paper.workspace.ownerId === userId ||
      fileRecord.paper.workspace.members.some(member => member.userId === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: {
        id: fileRecord.id,
        fileName: fileRecord.paper.title,
        contentType: fileRecord.contentType,
        sizeBytes: fileRecord.sizeBytes,
        checksum: fileRecord.checksum,
        storageProvider: fileRecord.storageProvider,
        uploadedAt: fileRecord.createdAt,
        uploadedBy: fileRecord.paper.uploaderId,
        workspaceId: fileRecord.paper.workspaceId,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting file metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } as ApiResponse);
  }
};

/**
 * Delete file
 * DELETE /api/files/:fileId
 */
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
    }

    const { fileId } = req.params;

    // Get file record
    const fileRecord = await prisma.paperFile.findUnique({
      where: { id: fileId },
      include: { paper: true },
    });

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      } as ApiResponse);
    }

    // Check if user has permission to delete (only uploader or workspace owner)
    const workspace = await prisma.workspace.findUnique({
      where: { id: fileRecord.paper.workspaceId },
    });

    const canDelete = fileRecord.paper.uploaderId === userId ||
      workspace?.ownerId === userId;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      } as ApiResponse);
    }

    // Delete from cloud storage
    await cloudStorageService.deleteFile(fileRecord.objectKey);

    // Soft delete file record
    await prisma.paperFile.update({
      where: { id: fileId },
      data: { isDeleted: true },
    });

    // Soft delete paper record
    await prisma.paper.update({
      where: { id: fileRecord.paperId },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      data: {
        message: 'File deleted successfully',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } as ApiResponse);
  }
};
