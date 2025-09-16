'use client';

import React, { useState, useEffect } from 'react';
import { FileUpload } from '@/components/customUI/FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Trash2, 
  Calendar,
  User,
  HardDrive
} from 'lucide-react';
import { useAuth } from '@/redux/auth/useAuth';

interface FileMetadata {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  checksum: string;
  storageProvider: string;
  uploadedAt: string;
  uploadedBy: string;
  workspaceId: string;
}

export default function FileManagementPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock workspace ID - in real app, this would come from routing or context
  const workspaceId = 'default-workspace';

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call
      // const response = await fetch('/api/files');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockFiles: FileMetadata[] = [
        {
          id: '1',
          fileName: 'research-paper.pdf',
          contentType: 'application/pdf',
          sizeBytes: 2048576,
          checksum: 'abc123',
          storageProvider: 's3',
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.id || 'user-1',
          workspaceId,
        },
        {
          id: '2',
          fileName: 'thesis-draft.docx',
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          sizeBytes: 1024000,
          checksum: 'def456',
          storageProvider: 's3',
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          uploadedBy: user?.id || 'user-1',
          workspaceId,
        },
      ];
      
      setFiles(mockFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (fileId: string) => {
    console.log('File uploaded successfully:', fileId);
    // Refresh the file list
    fetchFiles();
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch('/api/files/download-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const { data } = await response.json();
      const { downloadUrl } = data;

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('text')) return '📄';
    return '📁';
  };

  const getFileTypeBadge = (type: string) => {
    if (type.includes('pdf')) return <Badge variant="destructive">PDF</Badge>;
    if (type.includes('word') || type.includes('document')) return <Badge variant="default">DOCX</Badge>;
    if (type.includes('text')) return <Badge variant="secondary">TXT</Badge>;
    return <Badge variant="outline">FILE</Badge>;
  };

  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">File Management</h1>
            <p className="text-muted-foreground mt-2">
              Upload, manage, and organize your research files
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Cloud Storage Enabled
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setError(null)}
                className="mt-2"
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        <FileUpload
          workspaceId={workspaceId}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No files uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your first research file to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-3xl">{getFileIcon(file.contentType)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{file.fileName}</h3>
                          {getFileTypeBadge(file.contentType)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.sizeBytes)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(file.uploadedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {file.uploadedBy === user?.id ? 'You' : 'Team Member'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {file.storageProvider.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(file.id, file.fileName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
