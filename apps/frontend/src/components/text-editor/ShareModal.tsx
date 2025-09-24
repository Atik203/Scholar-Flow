"use client";

import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Link, Mail, Share2, Users } from "lucide-react";
import React, { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: string;
  paperTitle: string;
  isPublished: boolean;
}

export function ShareModal({
  isOpen,
  onClose,
  paperId,
  paperTitle,
  isPublished,
}: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  React.useEffect(() => {
    if (isOpen && isPublished) {
      // Generate shareable link for published papers
      const url = `${window.location.origin}/shared/paper/${paperId}`;
      setShareUrl(url);
    }
  }, [isOpen, isPublished, paperId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const generateShareLink = async () => {
    setIsGeneratingLink(true);
    try {
      // TODO: Implement API call to generate temporary share link
      // For now, use a simple URL
      const url = `${window.location.origin}/shared/paper/${paperId}`;
      setShareUrl(url);
      showSuccessToast("Share link generated!");
    } catch (error) {
      console.error("Failed to generate share link:", error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Paper
          </DialogTitle>
          <DialogDescription>
            Share "{paperTitle}" with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Paper Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Paper Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={isPublished ? "default" : "secondary"}>
                  {isPublished ? "Published" : "Draft"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {isPublished
                    ? "This paper is published and can be shared publicly"
                    : "Publish your paper to enable public sharing"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Share Link */}
          {isPublished ? (
            <div className="space-y-3">
              <Label htmlFor="share-url">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(shareUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Label>Generate Share Link</Label>
              <div className="text-sm text-muted-foreground mb-3">
                Create a temporary shareable link for this draft paper.
              </div>
              <Button
                onClick={generateShareLink}
                disabled={isGeneratingLink}
                className="w-full"
              >
                <Link className="mr-2 h-4 w-4" />
                {isGeneratingLink ? "Generating..." : "Generate Share Link"}
              </Button>
              {shareUrl && (
                <div className="flex gap-2 mt-3">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(shareUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quick Share Actions */}
          <div className="space-y-3">
            <Label>Quick Share</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const subject = encodeURIComponent(
                    `Check out: ${paperTitle}`
                  );
                  const body = encodeURIComponent(
                    shareUrl
                      ? `I wanted to share this paper with you: ${shareUrl}`
                      : `I'm working on a research paper titled "${paperTitle}".`
                  );
                  window.open(`mailto:?subject=${subject}&body=${body}`);
                }}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement team sharing
                  console.log("Team sharing not implemented yet");
                }}
                className="flex items-center gap-2"
                disabled
              >
                <Users className="h-4 w-4" />
                Team
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
