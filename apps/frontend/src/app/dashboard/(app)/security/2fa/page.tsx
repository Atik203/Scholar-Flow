"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { ShieldCheck, ShieldAlert, QrCode, Key, Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface TfaStatus {
  enabled: boolean;
  createdAt?: string;
}

export default function TwoFactorSetupPage() {
  const [status, setStatus] = useState<TfaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/2fa/status");
      const data = await res.json();
      setStatus(data.enabled !== undefined ? data : { enabled: false });
    } catch {
      setStatus({ enabled: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleGenerate = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/user/2fa/generate", { method: "POST" });
      const data = await res.json();
      setQrValue(data.qrCode ?? null);
      setSecret(data.secret ?? null);
      showSuccessToast("QR code generated", "Scan with your authenticator app");
    } catch {
      showErrorToast("Failed to generate QR code");
    } finally {
      setBusy(false);
    }
  }, []);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) return showErrorToast("Enter a 6-digit code");
    setBusy(true);
    try {
      const res = await fetch("/api/user/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error((await res.json()).message ?? "Invalid code");
      showSuccessToast("2FA enabled", "Your account is now extra secure");
      setQrValue(null); setSecret(null); setCode(""); fetchStatus();
    } catch (e: unknown) {
      showErrorToast("Verification failed", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [code, fetchStatus]);

  const handleDisable = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/user/2fa/disable", { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).message ?? "Unknown error");
      showSuccessToast("2FA disabled");
      setShowDisableDialog(false);
      fetchStatus();
    } catch (e: unknown) {
      showErrorToast("Failed to disable 2FA", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [fetchStatus]);

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/security" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Two-Factor Authentication</h1>
      </div>

      <Tabs defaultValue={status?.enabled ? "disable" : "setup"}>
        <TabsList>
          <TabsTrigger value="setup"><QrCode className="h-4 w-4" /> Setup</TabsTrigger>
          <TabsTrigger value="disable"><ShieldCheck className="h-4 w-4" /> Disable</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" />Set Up Authenticator App</CardTitle>
              <CardDescription>Scan the QR code with your authenticator app, then enter the 6-digit code to verify.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!qrValue ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <QrCode className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground max-w-sm">Use Google Authenticator, Authy, or 1Password to scan.</p>
                  <Button onClick={handleGenerate} disabled={busy} className="mt-4">
                    {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Generate QR Code
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-col items-center">
                    <div className="border rounded-lg p-4 bg-white dark:bg-gray-100">
                      <img src={qrValue} alt="2FA QR Code" width={192} height={192} className="h-48 w-48" />
                    </div>
                    {secret && <p className="text-xs text-muted-foreground mt-3 font-mono bg-muted px-3 py-1.5 rounded select-all">{secret}</p>}
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2"><Key className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">Enter 6-digit code</span></div>
                    <Input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" maxLength={6} className="w-40 text-center text-lg tracking-widest" />
                    <Button onClick={handleVerify} disabled={busy || code.length !== 6}>
                      {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Check className="h-4 w-4 mr-2" />Verify & Enable
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disable" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status?.enabled ? <ShieldCheck className="h-5 w-5 text-green-500" /> : <ShieldAlert className="h-5 w-5 text-yellow-500" />}
                Current 2FA Status
              </CardTitle>
              <CardDescription>
                {status?.enabled ? "2FA is active on your account." : "2FA is not enabled on your account."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={status?.enabled ? "default" : "secondary"}>{status?.enabled ? "Enabled" : "Disabled"}</Badge>
                {status?.createdAt && <span className="text-xs text-muted-foreground">Since {new Date(status.createdAt).toLocaleDateString()}</span>}
              </div>
              {status?.enabled ? (
                <Button variant="destructive" onClick={() => setShowDisableDialog(true)}>Disable Two-Factor Authentication</Button>
              ) : (
                <p className="text-sm text-muted-foreground">Switch to the Setup tab to enable 2FA.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication?</DialogTitle>
            <DialogDescription>This removes the extra security layer. You can re-enable it anytime.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisableDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDisable} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Yes, Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
