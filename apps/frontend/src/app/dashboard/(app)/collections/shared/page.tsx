"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSharedCollectionsQuery, useGetInvitesReceivedQuery, useGetInvitesSentQuery, useAcceptInviteMutation, useDeclineInviteMutation } from "@/redux/api/collectionApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Check, Eye, Loader2, Share2, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

type TabType = "shared" | "received" | "sent";

export default function SharedCollectionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("shared");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: sharedData, isLoading: sharedLoading } = useGetSharedCollectionsQuery({ page: 1, limit: 20 });
  const { data: receivedData, isLoading: receivedLoading } = useGetInvitesReceivedQuery({ page: 1, limit: 20 });
  const { data: sentData, isLoading: sentLoading } = useGetInvitesSentQuery({ page: 1, limit: 20 });
  const [acceptInvite] = useAcceptInviteMutation();
  const [declineInvite] = useDeclineInviteMutation();

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try { await acceptInvite(id).unwrap(); showSuccessToast("Invitation accepted"); } catch { showErrorToast("Failed to accept"); }
    setProcessingId(null);
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    try { await declineInvite(id).unwrap(); showSuccessToast("Invitation declined"); } catch { showErrorToast("Failed to decline"); }
    setProcessingId(null);
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "shared", label: "Shared With Me", count: sharedData?.result?.length || 0 },
    { key: "received", label: "Pending Invites", count: receivedData?.result?.length || 0 },
    { key: "sent", label: "Sent Invites", count: sentData?.result?.length || 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/collections" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        <div><h1 className="text-3xl font-bold tracking-tight">Shared Collections</h1><p className="text-muted-foreground">Invitations and collections shared with you</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn("flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === tab.key ? "bg-background shadow-sm" : "hover:bg-background/50")}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Shared With Me */}
      {activeTab === "shared" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Shared With Me</CardTitle></CardHeader>
          <CardContent>
            {sharedLoading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> :
              (sharedData?.result || []).length === 0 ? (
                <div className="text-center py-8"><Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No collections shared with you yet</p></div>
              ) : (
                <div className="space-y-3">{(sharedData?.result || []).map((c: any) => (
                  <motion.div key={c.id} whileHover={{ y: -1 }} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div><p className="font-medium">{c.name || c.collectionName}</p>
                        <p className="text-sm text-muted-foreground">by {c.ownerName || c.owner?.name || c.ownerEmail || "Unknown"} — {c.paperCount || 0} papers</p></div>
                    </div>
                    <Button size="sm" variant="outline" asChild><Link href={`/dashboard/collections/${c.id || c.collectionId}`}><Eye className="mr-1 h-4 w-4" />View</Link></Button>
                  </motion.div>
                ))}</div>
              )
            }
          </CardContent>
        </Card>
      )}

      {/* Pending Invites */}
      {activeTab === "received" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Pending Invitations</CardTitle></CardHeader>
          <CardContent>
            {receivedLoading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> :
              (receivedData?.result || []).length === 0 ? (
                <div className="text-center py-8"><UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No pending invitations</p></div>
              ) : (
                <div className="space-y-3">{(receivedData?.result || []).map((inv: any) => (
                  <motion.div key={inv.id} whileHover={{ y: -1 }} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{inv.collectionName}</p>
                      <p className="text-sm text-muted-foreground">Invited by {inv.inviterName || inv.inviterEmail || "Unknown"} · {inv.permission || "EDIT"} access</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(inv.collectionId)} disabled={processingId === inv.collectionId}>
                        {processingId === inv.collectionId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />}Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDecline(inv.collectionId)} disabled={processingId === inv.collectionId}><X className="mr-1 h-4 w-4" />Decline</Button>
                    </div>
                  </motion.div>
                ))}</div>
              )
            }
          </CardContent>
        </Card>
      )}

      {/* Sent Invites */}
      {activeTab === "sent" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Sent Invitations</CardTitle></CardHeader>
          <CardContent>
            {sentLoading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> :
              (sentData?.result || []).length === 0 ? (
                <div className="text-center py-8"><UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No sent invitations</p></div>
              ) : (
                <div className="space-y-3">{(sentData?.result || []).map((inv: any) => (
                  <motion.div key={inv.id} whileHover={{ y: -1 }} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{inv.collectionName}</p>
                      <p className="text-sm text-muted-foreground">Sent to {inv.inviteeEmail || inv.inviteeName} · <Badge variant={inv.status === "ACCEPTED" ? "default" : "secondary"} className="text-xs">{inv.status}</Badge></p>
                    </div>
                  </motion.div>
                ))}</div>
              )
            }
          </CardContent>
        </Card>
      )}
    </div>
  );
}
