"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { useGetSessionsQuery, useTerminateSessionMutation } from "@/redux/api/userApi";
import { Monitor, Clock, LogOut, Loader2, ArrowLeft, Shield, KeyRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SessionRow {
  id: string;
  expires: string | null;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// better-auth stores the current session id in this cookie.
function readCurrentSessionId(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)better-auth.session_token=([^;]*)/);
  return match ? match[1] : null;
}

export default function ActiveSessionsPage() {
  const { data, isLoading, error } = useGetSessionsQuery();
  const [terminateSession, { isLoading: isTerminating }] = useTerminateSessionMutation();
  const [showDialog, setShowDialog] = useState<SessionRow | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentSessionId(readCurrentSessionId());
  }, []);

  const sessions = data?.data ?? [];

  const handleTerminate = async (session: SessionRow) => {
    try {
      await terminateSession(session.id).unwrap();
      showSuccessToast("Session terminated", "That device is now signed out.");
      setShowDialog(null);
    } catch (terminateError: unknown) {
      const message =
        (terminateError as { data?: { message?: string } })?.data?.message ??
        "Failed to terminate session";
      showErrorToast("Terminate failed", message);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-2xl">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/security" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Monitor className="h-7 w-7 text-primary" />Active Sessions</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        These are the sessions currently signed into your account. Terminate any you no longer use.
      </p>

      {error ? (
        <Card><CardContent className="flex flex-col items-center py-12 text-center"><Shield className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-sm font-medium text-destructive">Failed to load sessions</p><p className="text-xs text-muted-foreground mt-1">Please try again later.</p></CardContent></Card>
      ) : sessions.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12 text-center"><Shield className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-sm font-medium">No active sessions</p><p className="text-xs text-muted-foreground mt-1">Your sessions will appear here when you sign in on other devices.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const isCurrent = currentSessionId !== null && currentSessionId === session.id;
            return (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Monitor className="h-5 w-5 text-muted-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">Session {session.id.slice(0, 8)}</p>
                        {isCurrent && <Badge variant="default" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200">Current Session</Badge>}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(session.createdAt)}</span>
                        {session.expires && (
                          <span className="flex items-center gap-1"><KeyRound className="h-3 w-3" />Expires {new Date(session.expires).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    {!isCurrent && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isTerminating} onClick={() => setShowDialog(session)}>
                        <LogOut className="h-4 w-4 mr-1" />Terminate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!showDialog} onOpenChange={(open) => !open && setShowDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Session?</DialogTitle>
            <DialogDescription>
              This will sign out session <strong>{showDialog?.id.slice(0, 8)}</strong>.
              You can sign in again from that device at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>Cancel</Button>
            <Button variant="destructive" disabled={isTerminating} onClick={() => showDialog && handleTerminate(showDialog)}>
              {isTerminating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Terminate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
