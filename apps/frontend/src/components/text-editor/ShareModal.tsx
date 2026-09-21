"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
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
import { useGetTeamMembersQuery } from "@/redux/api/teamApi";
import { Copy, Loader2, Mail, ShieldCheck, Share2, Trash2, Users, X } from "lucide-react";
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

  // Team sharing
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [sharingMemberId, setSharingMemberId] = useState<string | null>(null);
  const { data: teamData, isLoading: teamLoading } = useGetTeamMembersQuery(
    { limit: 50 },
    { skip: !isOpen || !showTeamPicker }
  );
  const teamMembers = teamData?.data ?? [];
  const sharedEmails = new Set(shares.map((share) => share.email.toLowerCase()));

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
      setShowTeamPicker(false);
    }
  }, [isOpen, isPublished, paperId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Copied to clipboard!");
    } catch {
      showErrorToast("Failed to copy to clipboard");
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
      showApiErrorToast(error);
    }
  };

  const handleTeamShare = async (member: {
    id: string;
    email: string;
    name: string;
  }) => {
    setSharingMemberId(member.id);
    try {
      await shareViaEmail({
        paperId,
        recipientEmail: member.email,
        permission,
        message,
      }).unwrap();
      showSuccessToast(`Shared with ${member.name || member.email}`);
    } catch (error: any) {
      showApiErrorToast(error);
    } finally {
      setSharingMemberId(null);
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
            <div className="space-y-2 rounded-md border border-muted/60 bg-muted/30 p-3">
              <Label>Public link unavailable</Label>
              <p className="text-sm text-muted-foreground">
                This paper is a draft, so it has no public page yet. Publish it
                to get a shareable public link — email invitations below work
                for drafts too.
              </p>
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
                onClick={() => setShowTeamPicker((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Team
              </Button>
            </div>

            {showTeamPicker && (
              <div className="space-y-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Share with team members ({permission === "edit" ? "Can Edit" : "View Only"})
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowTeamPicker(false)}
                    aria-label="Close team picker"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {teamLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 animate-pulse rounded bg-muted"
                      />
                    ))}
                  </div>
                ) : teamMembers.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No team members yet. Invite people from the Team page.
                  </p>
                ) : (
                  <div className="max-h-56 space-y-2 overflow-y-auto">
                    {teamMembers.map((member) => {
                      const alreadyShared = sharedEmails.has(
                        member.email.toLowerCase()
                      );
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {member.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={alreadyShared ? "secondary" : "outline"}
                            disabled={
                              alreadyShared || sharingMemberId === member.id
                            }
                            onClick={() => void handleTeamShare(member)}
                          >
                            {sharingMemberId === member.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : alreadyShared ? (
                              "Shared"
                            ) : (
                              "Share"
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
