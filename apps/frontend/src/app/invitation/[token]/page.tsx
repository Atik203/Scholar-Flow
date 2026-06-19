"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Loader2, Mail, Users, Shield, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

interface InvitationData {
  id: string;
  workspaceName: string;
  inviterName: string;
  role: string;
  email: string;
}

export default function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<"accept" | "decline" | null>(null);
  const router = useRouter();
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = Boolean(accessToken);

  const fetchInvitation = useCallback(async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/invitations/${token}`);
      if (!res.ok) throw new Error("Invitation not found or expired");
      const data = await res.json();
      setInvitation(data.data ?? data);
    } catch (err: any) {
      setError(err.message || "Failed to load invitation");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    params.then(({ token }) => fetchInvitation(token));
  }, [params, fetchInvitation]);

  const handleAction = async (action: "accept" | "decline") => {
    if (!accessToken || !invitation) return;
    setActionLoading(action);
    try {
      const res = await fetch(
        `${API_BASE_URL}/invitations/${invitation.id}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to ${action} invitation`);
      }
      showSuccessToast(
        action === "accept"
          ? "Invitation accepted!"
          : "Invitation declined",
        action === "accept"
          ? `You are now a member of ${invitation.workspaceName}`
          : "You have declined the invitation"
      );
      router.push("/dashboard/workspaces");
    } catch (err: any) {
      showErrorToast(err.message || `Failed to ${action} invitation`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Invitation Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="text-center mb-6">
          <div className="h-14 w-14 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            You&apos;ve been invited
          </h1>
          <p className="text-muted-foreground mt-1">
            to join a workspace on ScholarFlow
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-5 mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Workspace</p>
              <p className="font-semibold">{invitation.workspaceName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Invited by</p>
              <p className="font-medium">{invitation.inviterName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <Badge variant="secondary" className="mt-0.5">
                {invitation.role}
              </Badge>
            </div>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="flex gap-3">
            <Button
              onClick={() => handleAction("accept")}
              disabled={actionLoading !== null}
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {actionLoading === "accept" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Accept Invitation
            </Button>
            <Button
              onClick={() => handleAction("decline")}
              disabled={actionLoading !== null}
              variant="outline"
              className="flex-1 border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              {actionLoading === "decline" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Decline
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign in to accept this invitation
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href={`/login?callbackUrl=/invitation/${invitation.id}`}>
                Log in to Accept
              </Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
