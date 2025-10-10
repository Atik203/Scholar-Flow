import { PrismaClient, AnnotationType } from "@prisma/client";
import { CreateAnnotationInput, UpdateAnnotationInput, CreateAnnotationReplyInput, GetAnnotationsQuery } from "./annotation.types";

const prisma = new PrismaClient();

export class AnnotationService {
  /**
   * Create a new annotation
   */
  static async createAnnotation(
    userId: string,
    data: CreateAnnotationInput
  ) {
    const annotation = await prisma.annotation.create({
      data: {
        paperId: data.paperId,
        userId,
        type: data.type,
        anchor: data.anchor as any, // Store as JSON
        text: data.text,
        parentId: data.parentId,
        version: 1,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        paper: {
          select: {
            id: true,
            title: true,
          },
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        children: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return annotation;
  }

  /**
   * Get annotations for a paper
   */
  static async getPaperAnnotations(query: GetAnnotationsQuery) {
    const where: any = {
      paperId: query.paperId,
      isDeleted: false,
    };

    if (query.page) {
      where.anchor = {
        path: ['page'],
        equals: query.page,
      };
    }

    if (query.type) {
      where.type = query.type;
    }

    const annotations = await prisma.annotation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        children: query.includeReplies ? {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        } : false,
        versions: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 5, // Last 5 versions
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return annotations;
  }

  /**
   * Update an annotation
   */
  static async updateAnnotation(
    annotationId: string,
    userId: string,
    data: UpdateAnnotationInput
  ) {
    // Get current annotation
    const currentAnnotation = await prisma.annotation.findUnique({
      where: { id: annotationId },
    });

    if (!currentAnnotation) {
      throw new Error('Annotation not found');
    }

    if (currentAnnotation.userId !== userId) {
      throw new Error('Unauthorized to update this annotation');
    }

    // Create version record
    await prisma.annotationVersion.create({
      data: {
        annotationId,
        version: currentAnnotation.version,
        text: currentAnnotation.text,
        changedById: userId,
      },
    });

    // Update annotation
    const updatedAnnotation = await prisma.annotation.update({
      where: { id: annotationId },
      data: {
        text: data.text,
        version: currentAnnotation.version + 1,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        children: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return updatedAnnotation;
  }

  /**
   * Delete an annotation
   */
  static async deleteAnnotation(annotationId: string, userId: string) {
    const annotation = await prisma.annotation.findUnique({
      where: { id: annotationId },
    });

    if (!annotation) {
      throw new Error('Annotation not found');
    }

    if (annotation.userId !== userId) {
      throw new Error('Unauthorized to delete this annotation');
    }

    // Soft delete
    await prisma.annotation.update({
      where: { id: annotationId },
      data: { isDeleted: true },
    });

    return { success: true };
  }

  /**
   * Create a reply to an annotation
   */
  static async createAnnotationReply(
    annotationId: string,
    userId: string,
    data: CreateAnnotationReplyInput
  ) {
    // Verify parent annotation exists
    const parentAnnotation = await prisma.annotation.findUnique({
      where: { id: annotationId },
    });

    if (!parentAnnotation) {
      throw new Error('Parent annotation not found');
    }

    const reply = await prisma.annotation.create({
      data: {
        paperId: parentAnnotation.paperId,
        userId,
        type: AnnotationType.COMMENT,
        anchor: parentAnnotation.anchor as any, // Inherit anchor from parent
        text: data.text,
        parentId: annotationId,
        version: 1,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return reply;
  }

  /**
   * Get annotation versions/history
   */
  static async getAnnotationVersions(annotationId: string) {
    const versions = await prisma.annotationVersion.findMany({
      where: { annotationId },
      include: {
        changedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return versions;
  }

  /**
   * Get user's annotations across all papers
   */
  static async getUserAnnotations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const annotations = await prisma.annotation.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        paper: {
          select: {
            id: true,
            title: true,
          },
        },
        children: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await prisma.annotation.count({
      where: {
        userId,
        isDeleted: false,
      },
    });

    return {
      annotations,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
}
