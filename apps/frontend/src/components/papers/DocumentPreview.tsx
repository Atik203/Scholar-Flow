"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PdfViewerFallback } from "./PdfViewerFallback";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName?: string;
  className?: string;
  originalFilename?: string;
  mimeType?: string;
  onError?: (error: string) => void;
}

export function DocumentPreview({
  fileUrl,
  fileName,
  className,
  originalFilename = "document",
  mimeType,
  onError,
}: DocumentPreviewProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [renderedByDocxPreview, setRenderedByDocxPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Enhanced DOCX styling
  useEffect(() => {
    // Add enhanced CSS for docx-preview when component mounts
    const styleId = "docx-preview-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .docx-preview {
          font-family: "Times New Roman", "Liberation Serif", serif !important;
          font-size: 12pt !important;
          line-height: 1.15 !important;
          color: #000000 !important;
          background-color: #ffffff !important;
        }
        .docx-preview .docx-wrapper {
          max-width: 8.5in !important;
          margin: 0 auto !important;
          background: white !important;
          padding: 1in !important;
          box-shadow: 0 0 5px rgba(0,0,0,0.1) !important;
        }
        .docx-preview p {
          margin: 0 0 6pt 0 !important;
          text-align: justify !important;
        }
        .docx-preview h1, .docx-preview h2, .docx-preview h3, .docx-preview h4, .docx-preview h5, .docx-preview h6 {
          font-family: "Times New Roman", serif !important;
          font-weight: bold !important;
          margin-top: 12pt !important;
          margin-bottom: 6pt !important;
        }
        .docx-preview table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 6pt 0 !important;
        }
        .docx-preview table td, .docx-preview table th {
          border: 1px solid #000000 !important;
          padding: 4pt !important;
          vertical-align: top !important;
        }
        .docx-preview .docx-num-decimal {
          list-style-type: decimal !important;
        }
        .docx-preview .docx-num-bullet {
          list-style-type: disc !important;
        }
        .docx-preview img {
          max-width: 100% !important;
          height: auto !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Clean up style when component unmounts
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Helpers: infer extension and type from available hints
  const extractExtensionFromName = (name?: string) => {
    if (!name) return "";
    const lower = name.toLowerCase().trim();
    const parts = lower.split(".");
    return parts.length > 1 ? parts.pop() || "" : "";
  };

  const extractFilenameFromUrlDisposition = (url: string) => {
    try {
      const u = new URL(url);
      const cd =
        u.searchParams.get("response-content-disposition") ||
        u.searchParams.get("content-disposition");
      if (!cd) return "";
      const decoded = decodeURIComponent(cd);
      // filename*=UTF-8''name.docx OR filename="name.pdf"
      const starMatch = decoded.match(/filename\*=(?:UTF-8''|)([^;\r\n"]+)/i);
      if (starMatch && starMatch[1]) return starMatch[1].replace(/"/g, "");
      const simpleMatch = decoded.match(/filename=\"?([^;\r\n\"]+)/i);
      if (simpleMatch && simpleMatch[1])
        return simpleMatch[1].replace(/"/g, "");
    } catch {}
    return "";
  };

  const extractExtensionFromUrlPath = (url: string) => {
    try {
      const u = new URL(url);
      const pathname = decodeURIComponent(u.pathname.toLowerCase());
      const last = pathname.split("/").pop() || "";
      const dotIdx = last.lastIndexOf(".");
      if (dotIdx > -1) return last.slice(dotIdx + 1);
    } catch {}
    return "";
  };

  const getEffectiveExtension = () => {
    const fromName = extractExtensionFromName(fileName || originalFilename);
    if (fromName) return fromName;
    const fromDisposition = extractFilenameFromUrlDisposition(fileUrl);
    const fromDispositionExt = extractExtensionFromName(fromDisposition);
    if (fromDispositionExt) return fromDispositionExt;
    const fromPath = extractExtensionFromUrlPath(fileUrl);
    return fromPath;
  };

  const fileExtension = getEffectiveExtension();

  const getEffectiveType = () => {
    const mt = (mimeType || "").toLowerCase();
    if (mt.includes("application/pdf")) return "pdf" as const;
    if (mt.includes("officedocument.wordprocessingml.document"))
      return "docx" as const;
    if (mt.includes("application/msword")) return "doc" as const;
    // Fallback to extension
    const ext = fileExtension;
    if (ext === "pdf") return "pdf" as const;
    if (ext === "docx") return "docx" as const;
    if (ext === "doc") return "doc" as const;
    return "unknown" as const;
  };

  const effectiveType = getEffectiveType();

  // Debug logging to understand MIME type detection
  console.log("[DocumentPreview] Debug info:", {
    mimeType,
    fileExtension,
    effectiveType,
    fileUrl: fileUrl?.substring(0, 100) + "...",
    fileName,
    originalFilename,
  });

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = originalFilename || `document.${fileExtension}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, "_blank");
  };

  const convertDocxToHtml = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate fileUrl
      if (!fileUrl || typeof fileUrl !== "string" || fileUrl.trim() === "") {
        console.error("Invalid file URL:", fileUrl);
        throw new Error("Invalid file URL provided");
      }

      // Dynamic import to avoid SSR issues
      const mammoth = await import("mammoth");

      // Fetch the DOCX file with better error handling
      const response = await fetch(fileUrl, {
        method: "GET",
        mode: "cors", // Enable CORS
        credentials: "omit", // Don't send credentials for S3 URLs
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied - file URL may have expired");
        } else if (response.status === 404) {
          throw new Error("Document not found");
        } else {
          throw new Error(`Failed to fetch document (${response.status})`);
        }
      }

      const arrayBuffer = await response.arrayBuffer();

      // Convert DOCX to HTML
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (result.messages && result.messages.length > 0) {
        console.warn("DOCX conversion warnings:", result.messages);
      }

      setDocxHtml(result.value);
    } catch (err) {
      console.error("DOCX conversion error:", err);
      console.error("File URL:", fileUrl);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      const errorMsg = `Failed to preview document: ${errorMessage}`;
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [fileUrl, onError]);

  // High-fidelity DOCX rendering using docx-preview; falls back to mammoth on failure
  const renderDocxHighFidelity = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!fileUrl || typeof fileUrl !== "string" || fileUrl.trim() === "") {
        throw new Error("Invalid file URL provided");
      }

      const response = await fetch(fileUrl, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied - file URL may have expired");
        } else if (response.status === 404) {
          throw new Error("Document not found");
        } else {
          throw new Error(`Failed to fetch document (${response.status})`);
        }
      }

      const arrayBuffer = await response.arrayBuffer();

      // Dynamic import to avoid SSR issues
      const docx = await import("docx-preview").catch(() => null as any);
      if (!docx || typeof (docx as any).renderAsync !== "function") {
        throw new Error("High-fidelity DOCX renderer not available");
      }

      // Clear previous content before rendering
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      await (docx as any).renderAsync(
        arrayBuffer,
        containerRef.current,
        undefined,
        {
          className: "docx-preview",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreLastRenderedPageBreak: true,
          breakPages: false,
          experimental: true,
          useMathMLPolyfill: true,
          useBase64URL: false,
          renderChanges: false,
          renderComments: false,
          renderEndnotes: true,
          renderFootnotes: true,
          renderHeaders: true,
          renderFooters: true,
          trimXmlDeclaration: true,
        }
      );

      setRenderedByDocxPreview(true);
      setDocxHtml(null); // ensure mammoth content isn't shown
    } catch (err) {
      console.warn(
        "docx-preview rendering failed, falling back to mammoth:",
        err
      );
      setRenderedByDocxPreview(false);
      // Fallback to mammoth conversion
      await convertDocxToHtml();
    } finally {
      setIsLoading(false);
    }
  }, [fileUrl, convertDocxToHtml]);

  useEffect(() => {
    // Safety check: ensure we're not trying to process a PDF as DOCX
    const isProbablyPdf =
      mimeType?.toLowerCase().includes("pdf") ||
      fileUrl?.toLowerCase().includes(".pdf") ||
      fileExtension === "pdf";

    if (
      effectiveType === "docx" &&
      !isProbablyPdf && // Additional safety check
      !error &&
      fileUrl &&
      typeof fileUrl === "string" &&
      fileUrl.trim() !== ""
    ) {
      // Try high-fidelity renderer first; it will fallback to mammoth on failure
      renderDocxHighFidelity();
    }
  }, [
    effectiveType,
    fileUrl,
    error,
    renderDocxHighFidelity,
    mimeType,
    fileExtension,
  ]);

  // Validate fileUrl after hooks but before rendering
  if (!fileUrl || typeof fileUrl !== "string" || fileUrl.trim() === "") {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 text-center ${className}`}
      >
        <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Invalid document URL
        </p>
        <p className="text-xs text-muted-foreground">
          Unable to load document preview
        </p>
      </div>
    );
  }

  // Handle PDF files
  if (effectiveType === "pdf") {
    return (
      <PdfViewerFallback
        fileUrl={fileUrl}
        className={className}
        originalFilename={originalFilename}
      />
    );
  }

  // Handle DOCX files
  if (effectiveType === "docx") {
    // Safety check: ensure we're not trying to process a PDF as DOCX
    const isProbablyPdf =
      mimeType?.toLowerCase().includes("pdf") ||
      fileUrl?.toLowerCase().includes(".pdf") ||
      fileExtension === "pdf";

    if (isProbablyPdf) {
      console.warn(
        "[DocumentPreview] Detected PDF file but effectiveType is docx, redirecting to PDF viewer"
      );
      return (
        <PdfViewerFallback
          fileUrl={fileUrl}
          className={className}
          originalFilename={originalFilename}
        />
      );
    }

    if (isLoading) {
      return (
        <div
          className={`flex flex-col items-center justify-center h-64 ${className}`}
        >
          <Loader2 className="h-8 w-8 mb-2 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">
            Preparing document preview...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className={`flex flex-col items-center justify-center h-64 text-center ${className}`}
        >
          <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const officeUrl =
                  "https://view.officeapps.live.com/op/view.aspx?src=" +
                  encodeURIComponent(fileUrl);
                window.open(officeUrl, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Office Viewer
            </Button>
          </div>
        </div>
      );
    }

    // Rendered by docx-preview
    if (renderedByDocxPreview) {
      return (
        <div className={className}>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 border-b p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Document Preview</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const officeUrl =
                      "https://view.officeapps.live.com/op/view.aspx?src=" +
                      encodeURIComponent(fileUrl);
                    window.open(officeUrl, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Office
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="p-0 max-h-96 overflow-auto">
              <div
                ref={containerRef}
                className="docx-wrapper p-6"
                style={{
                  backgroundColor: "#ffffff",
                  fontFamily: "Times New Roman, serif",
                  lineHeight: "1.6",
                  color: "#000000",
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    // Fallback: mammoth-rendered HTML
    if (docxHtml) {
      return (
        <div className={className}>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 border-b p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Document Preview</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const officeUrl =
                      "https://view.officeapps.live.com/op/view.aspx?src=" +
                      encodeURIComponent(fileUrl);
                    window.open(officeUrl, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Office
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div
              className="p-6 max-h-96 overflow-y-auto prose prose-sm max-w-none prose-headings:font-serif prose-p:text-justify prose-p:leading-relaxed prose-table:border-collapse prose-td:border prose-td:border-gray-300 prose-td:p-2"
              style={{
                backgroundColor: "#ffffff",
                fontFamily: "Times New Roman, serif",
                fontSize: "12pt",
                lineHeight: "1.15",
                color: "#000000",
              }}
              dangerouslySetInnerHTML={{ __html: docxHtml }}
            />
          </div>
        </div>
      );
    }
  }

  // Handle DOC files and other unsupported formats
  if (effectiveType === "doc") {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 text-center ${className}`}
      >
        <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          DOC file preview is not supported
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Please convert to DOCX format or download to view
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    );
  }

  // Fallback for other file types
  return (
    <div
      className={`flex flex-col items-center justify-center h-64 text-center ${className}`}
    >
      <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-2">
        Preview not available for this file type
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}
