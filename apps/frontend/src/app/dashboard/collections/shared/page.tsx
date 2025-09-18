"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useGetInvitesReceivedQuery,
  useGetInvitesSentQuery,
  useGetSharedCollectionsQuery,
} from "@/redux/api/collectionApi";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Loader2,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";

export default function SharedCollectionsPage() {
  const isProtected = useProtectedRoute();
  const { data: shared, isLoading: loadingShared } =
    useGetSharedCollectionsQuery({ page: 1, limit: 50 });
  const { data: sent, isLoading: loadingSent } = useGetInvitesSentQuery({
    page: 1,
    limit: 50,
  });
  const { data: received, isLoading: loadingReceived } =
    useGetInvitesReceivedQuery({ page: 1, limit: 50 });
  const [acceptInvite, { isLoading: accepting }] = useAcceptInviteMutation();
  const [declineInvite, { isLoading: declining }] = useDeclineInviteMutation();

  if (!isProtected) return null;

  const handleAccept = async (collectionId: string) => {
    try {
      await acceptInvite(collectionId).unwrap();
      showSuccessToast("Invitation accepted");
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed to accept invite");
    }
  };

  const handleDecline = async (collectionId: string) => {
    try {
      await declineInvite(collectionId).unwrap();
      showSuccessToast("Invitation declined");
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed to decline invite");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/collections">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Collections
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shared Collections
            </h1>
            <p className="text-muted-foreground">
              Invitations and collections shared with you
            </p>
          </div>
        </div>

        <Tabs defaultValue="shared">
          <TabsList>
            <TabsTrigger value="shared">Accepted</TabsTrigger>
            <TabsTrigger value="received">Received Invites</TabsTrigger>
            <TabsTrigger value="sent">Sent Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Collections shared with me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingShared ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : shared?.result?.length ? (
                  <ul className="space-y-3">
                    {shared.result.map((c: any) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between border rounded p-3"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Status: {c.memberStatus}
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/dashboard/collections/${c.id}`}>
                            Open
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No shared collections yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="received">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Received invites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingReceived ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : received?.result?.length ? (
                  <ul className="space-y-3">
                    {received.result.map((i: any) => (
                      <li
                        key={i.id}
                        className="flex items-center justify-between border rounded p-3"
                      >
                        <div>
                          <div className="font-medium">{i.collectionName}</div>
                          <div className="text-xs text-muted-foreground">
                            Invited by {i.inviterName || i.inviterEmail}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAccept(i.collectionId)}
                            disabled={accepting}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecline(i.collectionId)}
                            disabled={declining}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No invites.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invites I sent</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSent ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : sent?.result?.length ? (
                  <ul className="space-y-3">
                    {sent.result.map((i: any) => (
                      <li
                        key={i.id}
                        className="flex items-center justify-between border rounded p-3"
                      >
                        <div>
                          <div className="font-medium">{i.collectionName}</div>
                          <div className="text-xs text-muted-foreground">
                            To: {i.inviteeName || i.inviteeEmail}
                          </div>
                        </div>
                        <span className="text-xs uppercase">{i.status}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No invites sent.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
