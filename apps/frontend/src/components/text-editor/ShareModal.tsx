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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useGetPaperSharesQuery,
  useRevokePaperShareMutation,
  useShareViaEmailMutation,
} from "@/redux/api/paperApi";
import { Copy, Link, Loader2, Mail, ShieldCheck, Share2, Trash2, Users } from "lucide-react";
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

  // Email sharing states
  const [recipientEmail, setRecipientEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [message, setMessage] = useState("");
  const [shareViaEmail, { isLoading: isEmailSharing }] =
    useShareViaEmailMutation();
  const { data: sharesResponse } = useGetPaperSharesQuery(paperId, {
    skip: !isOpen,
  });
  const [revokeShare] = useRevokePaperShareMutation();
  const shares = sharesResponse ?? [];

  React.useEffect(() => {
    if (isOpen && isPublished) {
      const url = `${window.location.origin}/public-view/${paperId}`;
      setShareUrl(url);
    } else if (!isOpen) {
      // Reset email form when modal closes
      setRecipientEmail("");
      setPermission("view");
      setMessage("");
      setShareUrl("");
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
      const url = `${window.location.origin}/public-view/${paperId}`;
      setShareUrl(url);
      showSuccessToast("Share link generated!");
    } catch (error) {
      console.error("Failed to generate share link:", error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleEmailShare = async () => {
    if (!recipientEmail) {
      return;
    }

    try {
      await shareViaEmail({
        paperId,
        recipientEmail,
        permission,
        message,
      }).unwrap();

      showSuccessToast(
        `Paper "${paperTitle}" shared with ${recipientEmail} successfully!`
      );

      // Reset form
      setRecipientEmail("");
      setMessage("");
      setPermission("view");
    } catch (error: any) {
      console.error("Share via email failed:", error);
      showApiErrorToast(error);
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

          {/* Email Share */}
          <div className="space-y-3">
            <Label>Share via Email</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="colleague@university.edu"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={permission}
                  onValueChange={(value: "view" | "edit") =>
                    setPermission(value)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="edit">Can Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Add a personal message (optional)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleEmailShare}
                disabled={!recipientEmail || isEmailSharing}
                className="w-full"
              >
                {isEmailSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email Invitation
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Shared with (active email shares — revocable) */}
          {shares.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Shared with
              </Label>
              <ul className="space-y-2">
                {shares.map((share) => (
                  <li
                    key={share.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-muted/60 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate font-medium">{share.email}</span>
                      <Badge
                        variant={share.permission === "edit" ? "default" : "secondary"}
                      >
                        {share.permission === "edit" ? "Can Edit" : "View Only"}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Revoke access"
                      onClick={async () => {
                        try {
                          await revokeShare(share.id).unwrap();
                          showSuccessToast(`Access revoked for ${share.email}`);
                        } catch (error: any) {
                          showApiErrorToast(error);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
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
