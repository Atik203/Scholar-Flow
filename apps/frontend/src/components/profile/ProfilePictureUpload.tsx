"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploadProfilePictureMutation } from "@/redux/api/userApi";
import { Camera, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ProfilePictureUploadProps {
  currentImage?: string;
  userName?: string;
  userEmail?: string;
  onUploadSuccess?: () => void;
}

export function ProfilePictureUpload({
  currentImage,
  userName,
  userEmail,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProfilePicture, { isLoading: isUploading }] =
    useUploadProfilePictureMutation();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail?.[0]?.toUpperCase() || "U";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showErrorToast(
        "Invalid File Type",
        "Please select a JPEG, PNG, or WebP image"
      );
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showErrorToast("File Too Large", "Maximum file size is 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await uploadProfilePicture(formData).unwrap();

      showSuccessToast(
        "Profile Picture Updated",
        "Your profile picture has been updated successfully"
      );

      setIsDialogOpen(false);
      setPreviewUrl(null);
      setSelectedFile(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.data?.message ||
        "Failed to upload profile picture. Please try again.";
      showErrorToast("Upload Failed", errorMessage);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="relative inline-block">
        <Avatar className="h-24 w-24 ring-4 ring-primary/20">
          <AvatarImage
            src={currentImage || ""}
            alt={userName || "User"}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg dark:bg-primary/20">
            {initials}
          </AvatarFallback>
        </Avatar>
        <Button
          size="sm"
          variant="outline"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 dark:border-gray-600 hover:bg-primary hover:text-white transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. Supported formats: JPEG, PNG, WebP
              (max 5MB)
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {previewUrl ? (
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {selectedFile && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
