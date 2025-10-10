import prisma from "../shared/prisma";
import ApiError from "../errors/ApiError";
import { AuthRequest } from "../middleware/auth";

export interface CitationData {
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  publisher?: string;
  abstract?: string;
  keywords?: string[];
}

export interface CitationExportRequest {
  paperIds?: string[];
  collectionId?: string;
  format: 'BIBTEX' | 'ENDNOTE' | 'APA' | 'MLA' | 'IEEE' | 'CHICAGO' | 'HARVARD';
  includeAbstract?: boolean;
  includeKeywords?: boolean;
}

export class CitationExportService {
  /**
   * Export citations for papers or collections
   */
  static async exportCitations(
    req: AuthRequest,
    data: CitationExportRequest
  ): Promise<{ content: string; format: string; count: number }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      let papers: any[] = [];

      if (data.collectionId) {
        // Export papers from collection
        const collection = await prisma.collection.findFirst({
          where: {
            id: data.collectionId,
            isDeleted: false,
            OR: [
              { ownerId: userId },
              {
                members: {
                  some: {
                    userId: userId,
                    status: 'ACCEPTED',
                    isDeleted: false
                  }
                }
              }
            ]
          },
          include: {
            papers: {
              include: {
                paper: {
                  include: {
                    uploader: true
                  }
                }
              }
            }
          }
        });

        if (!collection) {
          throw new ApiError(404, 'Collection not found or access denied');
        }

        papers = collection.papers.map((cp: any) => cp.paper);
      } else if (data.paperIds && data.paperIds.length > 0) {
        // Export specific papers
        papers = await prisma.paper.findMany({
          where: {
            id: { in: data.paperIds },
            isDeleted: false,
            OR: [
              { uploaderId: userId },
              {
                workspace: {
                  members: {
                    some: {
                      userId: userId,
                      isDeleted: false
                    }
                  }
                }
              }
            ]
          },
          include: {
            uploader: true
          }
        });

        if (papers.length !== data.paperIds.length) {
          throw new ApiError(404, 'Some papers not found or access denied');
        }
      } else {
        throw new ApiError(400, 'Either paperIds or collectionId must be provided');
      }

      if (papers.length === 0) {
        throw new ApiError(404, 'No papers found to export');
      }

      // Generate citations
      const citations = papers.map(paper => this.extractCitationData(paper, data));
      const content = this.formatCitations(citations, data.format);

      // Save export record
      await prisma.citationExport.create({
        data: {
          userId,
          paperId: data.paperIds?.[0] || null,
          collectionId: data.collectionId || null,
          format: data.format,
          content,
          metadata: {
            paperCount: papers.length,
            includeAbstract: data.includeAbstract,
            includeKeywords: data.includeKeywords,
            exportedAt: new Date().toISOString()
          }
        }
      });

      return {
        content,
        format: data.format,
        count: papers.length
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to export citations');
    }
  }

  /**
   * Get export history for user
   */
  static async getExportHistory(
    req: AuthRequest,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ exports: any[]; total: number }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const [exports, total] = await Promise.all([
        prisma.citationExport.findMany({
          where: {
            userId,
            isDeleted: false
          },
          include: {
            paper: {
              select: {
                id: true,
                title: true
              }
            },
            collection: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            exportedAt: 'desc'
          },
          take: limit,
          skip: offset
        }),
        prisma.citationExport.count({
          where: {
            userId,
            isDeleted: false
          }
        })
      ]);

      return { exports, total };
    } catch (error) {
      throw new ApiError(500, 'Failed to fetch export history');
    }
  }

  /**
   * Extract citation data from paper
   */
  private static extractCitationData(paper: any, options: CitationExportRequest): CitationData {
    const metadata = paper.metadata as any || {};
    
    return {
      title: paper.title,
      authors: this.parseAuthors(metadata.authors || paper.uploader?.name || 'Unknown Author'),
      journal: metadata.journal || metadata.publication,
      year: metadata.year || metadata.publicationYear || new Date(paper.createdAt).getFullYear(),
      volume: metadata.volume,
      issue: metadata.issue,
      pages: metadata.pages,
      doi: paper.doi || metadata.doi,
      url: metadata.url || metadata.link,
      publisher: metadata.publisher,
      abstract: options.includeAbstract ? paper.abstract : undefined,
      keywords: options.includeKeywords ? metadata.keywords : undefined
    };
  }

  /**
   * Parse authors from various formats
   */
  private static parseAuthors(authors: any): string[] {
    if (typeof authors === 'string') {
      return authors.split(/[,;]/).map(a => a.trim()).filter(a => a);
    }
    if (Array.isArray(authors)) {
      return authors.map(a => typeof a === 'string' ? a : a.name || a).filter(a => a);
    }
    return ['Unknown Author'];
  }

  /**
   * Format citations according to specified format
   */
  private static formatCitations(citations: CitationData[], format: string): string {
    switch (format) {
      case 'BIBTEX':
        return this.formatBibTeX(citations);
      case 'ENDNOTE':
        return this.formatEndNote(citations);
      case 'APA':
        return this.formatAPA(citations);
      case 'MLA':
        return this.formatMLA(citations);
      case 'IEEE':
        return this.formatIEEE(citations);
      case 'CHICAGO':
        return this.formatChicago(citations);
      case 'HARVARD':
        return this.formatHarvard(citations);
      default:
        throw new ApiError(400, 'Unsupported citation format');
    }
  }

  private static formatBibTeX(citations: CitationData[]): string {
    return citations.map((citation, index) => {
      const key = `paper${index + 1}`;
      const authors = citation.authors.join(' and ');
      
      let bibtex = `@article{${key},\n`;
      bibtex += `  title = {${citation.title}},\n`;
      bibtex += `  author = {${authors}},\n`;
      
      if (citation.journal) bibtex += `  journal = {${citation.journal}},\n`;
      if (citation.year) bibtex += `  year = {${citation.year}},\n`;
      if (citation.volume) bibtex += `  volume = {${citation.volume}},\n`;
      if (citation.issue) bibtex += `  number = {${citation.issue}},\n`;
      if (citation.pages) bibtex += `  pages = {${citation.pages}},\n`;
      if (citation.doi) bibtex += `  doi = {${citation.doi}},\n`;
      if (citation.url) bibtex += `  url = {${citation.url}},\n`;
      if (citation.publisher) bibtex += `  publisher = {${citation.publisher}},\n`;
      if (citation.abstract) bibtex += `  abstract = {${citation.abstract}},\n`;
      
      bibtex += '}';
      return bibtex;
    }).join('\n\n');
  }

  private static formatEndNote(citations: CitationData[]): string {
    return citations.map(citation => {
      let endnote = `%0 Journal Article\n`;
      endnote += `%T ${citation.title}\n`;
      endnote += `%A ${citation.authors.join('\n%A ')}\n`;
      
      if (citation.journal) endnote += `%J ${citation.journal}\n`;
      if (citation.year) endnote += `%D ${citation.year}\n`;
      if (citation.volume) endnote += `%V ${citation.volume}\n`;
      if (citation.issue) endnote += `%N ${citation.issue}\n`;
      if (citation.pages) endnote += `%P ${citation.pages}\n`;
      if (citation.doi) endnote += `%R ${citation.doi}\n`;
      if (citation.url) endnote += `%U ${citation.url}\n`;
      if (citation.publisher) endnote += `%I ${citation.publisher}\n`;
      if (citation.abstract) endnote += `%X ${citation.abstract}\n`;
      
      return endnote;
    }).join('\n\n');
  }

  private static formatAPA(citations: CitationData[]): string {
    return citations.map(citation => {
      const authors = this.formatAuthorsAPA(citation.authors);
      const year = citation.year || 'n.d.';
      const title = citation.title;
      
      let apa = `${authors} (${year}). ${title}.`;
      
      if (citation.journal) {
        apa += ` ${citation.journal}`;
        if (citation.volume) {
          apa += `, ${citation.volume}`;
          if (citation.issue) {
            apa += `(${citation.issue})`;
          }
        }
        if (citation.pages) {
          apa += `, ${citation.pages}`;
        }
        apa += '.';
      }
      
      if (citation.doi) {
        apa += ` https://doi.org/${citation.doi}`;
      } else if (citation.url) {
        apa += ` ${citation.url}`;
      }
      
      return apa;
    }).join('\n\n');
  }

  private static formatMLA(citations: CitationData[]): string {
    return citations.map(citation => {
      const authors = this.formatAuthorsMLA(citation.authors);
      const title = citation.title;
      const journal = citation.journal || '';
      const year = citation.year || 'n.d.';
      
      let mla = `${authors}. "${title}."`;
      
      if (journal) {
        mla += ` ${journal}`;
        if (citation.volume) {
          mla += `, vol. ${citation.volume}`;
          if (citation.issue) {
            mla += `, no. ${citation.issue}`;
          }
        }
        if (citation.year) {
          mla += `, ${year}`;
        }
        if (citation.pages) {
          mla += `, pp. ${citation.pages}`;
        }
        mla += '.';
      }
      
      if (citation.doi) {
        mla += ` doi:${citation.doi}`;
      } else if (citation.url) {
        mla += ` ${citation.url}`;
      }
      
      return mla;
    }).join('\n\n');
  }

  private static formatIEEE(citations: CitationData[]): string {
    return citations.map((citation, index) => {
      const authors = this.formatAuthorsIEEE(citation.authors);
      const title = citation.title;
      const journal = citation.journal || '';
      const year = citation.year || 'n.d.';
      
      let ieee = `${authors}, "${title},"`;
      
      if (journal) {
        ieee += ` ${journal}`;
        if (citation.volume) {
          ieee += `, vol. ${citation.volume}`;
          if (citation.issue) {
            ieee += `, no. ${citation.issue}`;
          }
        }
        if (citation.pages) {
          ieee += `, pp. ${citation.pages}`;
        }
        ieee += `, ${year}`;
      }
      
      if (citation.doi) {
        ieee += `. doi: ${citation.doi}`;
      }
      
      return `[${index + 1}] ${ieee}`;
    }).join('\n');
  }

  private static formatChicago(citations: CitationData[]): string {
    return citations.map(citation => {
      const authors = this.formatAuthorsChicago(citation.authors);
      const title = citation.title;
      const journal = citation.journal || '';
      const year = citation.year || 'n.d.';
      
      let chicago = `${authors}. "${title}."`;
      
      if (journal) {
        chicago += ` ${journal}`;
        if (citation.volume) {
          chicago += ` ${citation.volume}`;
          if (citation.issue) {
            chicago += `, no. ${citation.issue}`;
          }
        }
        if (citation.year) {
          chicago += ` (${year})`;
        }
        if (citation.pages) {
          chicago += `: ${citation.pages}`;
        }
        chicago += '.';
      }
      
      if (citation.doi) {
        chicago += ` https://doi.org/${citation.doi}`;
      }
      
      return chicago;
    }).join('\n\n');
  }

  private static formatHarvard(citations: CitationData[]): string {
    return citations.map(citation => {
      const authors = this.formatAuthorsHarvard(citation.authors);
      const title = citation.title;
      const journal = citation.journal || '';
      const year = citation.year || 'n.d.';
      
      let harvard = `${authors} ${year}, '${title}',`;
      
      if (journal) {
        harvard += ` ${journal}`;
        if (citation.volume) {
          harvard += `, vol. ${citation.volume}`;
          if (citation.issue) {
            harvard += `, no. ${citation.issue}`;
          }
        }
        if (citation.pages) {
          harvard += `, pp. ${citation.pages}`;
        }
        harvard += '.';
      }
      
      if (citation.doi) {
        harvard += ` doi: ${citation.doi}`;
      }
      
      return harvard;
    }).join('\n\n');
  }

  private static formatAuthorsAPA(authors: string[]): string {
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    if (authors.length <= 7) return `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`;
    return `${authors.slice(0, 6).join(', ')}, ... ${authors[authors.length - 1]}`;
  }

  private static formatAuthorsMLA(authors: string[]): string {
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
  }

  private static formatAuthorsIEEE(authors: string[]): string {
    if (authors.length === 1) return authors[0];
    if (authors.length <= 6) return authors.join(', ');
    return `${authors.slice(0, 3).join(', ')}, et al.`;
  }

  private static formatAuthorsChicago(authors: string[]): string {
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
  }

  private static formatAuthorsHarvard(authors: string[]): string {
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
  }
}
