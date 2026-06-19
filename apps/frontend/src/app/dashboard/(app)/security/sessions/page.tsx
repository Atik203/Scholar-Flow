"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { Smartphone, Laptop, Monitor, Clock, MapPin, LogOut, Loader2, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const deviceIcons: Record<string, React.ElementType> = { mobile: Smartphone, tablet: Smartphone, desktop: Monitor, laptop: Laptop };

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<Session | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/sessions");
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : data.sessions ?? []);
    } catch {
      showErrorToast("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleTerminate = useCallback(async (session: Session) => {
    setTerminating(session.id);
    try {
      const res = await fetch(`/api/user/sessions/${session.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).message ?? "Unknown error");
      setSessions((prev) => prev.filter((s) => s.id !== session.id));
      showSuccessToast("Session terminated", `${session.browser} on ${session.location}`);
    } catch (e: unknown) {
      showErrorToast("Failed to terminate session", (e as Error).message);
    } finally {
      setTerminating(null);
      setShowDialog(null);
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/security" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Laptop className="h-7 w-7 text-primary" />Active Sessions</h1>
      </div>
      <p className="text-sm text-muted-foreground">These are the devices currently signed into your account. Terminate any you no longer use.</p>

      {sessions.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12 text-center"><Shield className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-sm font-medium">No active sessions</p><p className="text-xs text-muted-foreground mt-1">Your sessions will appear here when you sign in on other devices.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const Icon = deviceIcons[session.device.toLowerCase()] || Laptop;
            return (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Icon className="h-5 w-5 text-muted-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{session.browser}</p>
                        {session.current && <Badge variant="default" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200">Current Session</Badge>}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{session.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(session.lastActive)}</span>
                      </div>
                      {session.ip && <p className="text-[10px] text-muted-foreground mt-1 font-mono">{session.ip}</p>}
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={terminating === session.id} onClick={() => setShowDialog(session)}>
                        {terminating === session.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogOut className="h-4 w-4 mr-1" />Terminate</>}
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
            <DialogDescription>This will sign out the <strong>{showDialog?.browser}</strong> session from <strong>{showDialog?.location}</strong>. You can sign in again from that device at any time.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>Cancel</Button>
            <Button variant="destructive" disabled={terminating === showDialog?.id} onClick={() => showDialog && handleTerminate(showDialog)}>
              {terminating === showDialog?.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Terminate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
