"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import {
  useGet2faStatusQuery,
  useGenerate2faMutation,
  useVerify2faMutation,
  useDisable2faMutation,
} from "@/redux/api/userApi";
import { ShieldCheck, ShieldAlert, QrCode, Key, Check, Loader2, ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TwoFactorSetupPage() {
  const { data: statusData, isLoading } = useGet2faStatusQuery();
  const status = statusData?.data;
  const [generate2fa, { isLoading: isGenerating }] = useGenerate2faMutation();
  const [verify2fa, { isLoading: isVerifying }] = useVerify2faMutation();
  const [disable2fa, { isLoading: isDisabling }] = useDisable2faMutation();

  const [code, setCode] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [otpAuthUrl, setOtpAuthUrl] = useState<string | null>(null);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const busy = isGenerating || isVerifying || isDisabling;

  useEffect(() => {
    setCode("");
  }, [secret]);

  const copyToClipboard = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      showErrorToast("Copy failed", "Select the text and copy it manually.");
    }
  };

  const handleGenerate = async () => {
    try {
      const res = await generate2fa().unwrap();
      setSecret(res.data.secret);
      setOtpAuthUrl(res.data.qrCodeUrl);
      showSuccessToast("Secret generated", "Add it to your authenticator app, then verify.");
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Failed to generate 2FA secret";
      showErrorToast("Generation failed", message);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      showErrorToast("Enter a 6-digit code");
      return;
    }
    try {
      await verify2fa({ code }).unwrap();
      showSuccessToast("2FA enabled", "Your account is now extra secure");
      setSecret(null);
      setOtpAuthUrl(null);
      setCode("");
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Invalid code";
      showErrorToast("Verification failed", message);
    }
  };

  const handleDisable = async () => {
    try {
      await disable2fa().unwrap();
      showSuccessToast("2FA disabled");
      setShowDisableDialog(false);
      setSecret(null);
      setOtpAuthUrl(null);
      setCode("");
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Failed to disable 2FA";
      showErrorToast("Disable failed", message);
    }
  };

  if (isLoading || !statusData) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const enabled = Boolean(status?.enabled);

  return (
    <div className="space-y-6 pb-12 max-w-2xl">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/security" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Two-Factor Authentication</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {enabled ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-yellow-500" />
            )}
            Current 2FA Status
          </CardTitle>
          <CardDescription>
            {enabled
              ? "2FA is active on your account. You'll need a code each time you sign in."
              : "2FA is not enabled on your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
          {enabled && (
            <Button variant="destructive" onClick={() => setShowDisableDialog(true)} disabled={busy}>
              Disable Two-Factor Authentication
            </Button>
          )}
        </CardContent>
      </Card>

      {!enabled && (
        <Tabs defaultValue="setup">
          <TabsList>
            <TabsTrigger value="setup"><QrCode className="h-4 w-4" /> Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" />Set Up Authenticator App</CardTitle>
                <CardDescription>
                  Add the secret to Google Authenticator, Authy, or 1Password,
                  then enter the 6-digit code to verify.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!secret ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <QrCode className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground max-w-sm">
                      We'll generate a one-time secret you can add to your
                      authenticator app manually.
                    </p>
                    <Button onClick={handleGenerate} disabled={busy} className="mt-4">
                      {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Generate Secret
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">Secret key</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("secret", secret)}
                        >
                          {copied === "secret" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                          {copied === "secret" ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-xs font-mono bg-muted px-3 py-2 rounded select-all break-all">
                        {secret}
                      </p>
                      {otpAuthUrl && (
                        <>
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-sm font-medium">App link (otpauth)</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("url", otpAuthUrl)}
                            >
                              {copied === "url" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                              {copied === "url" ? "Copied" : "Copy"}
                            </Button>
                          </div>
                          <p className="text-xs font-mono bg-muted px-3 py-2 rounded select-all break-all">
                            {otpAuthUrl}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Enter 6-digit code</span>
                      </div>
                      <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-40 text-center text-lg tracking-widest"
                      />
                      <Button onClick={handleVerify} disabled={busy || code.length !== 6}>
                        {isVerifying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Check className="h-4 w-4 mr-2" />Verify & Enable
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication?</DialogTitle>
            <DialogDescription>This removes the extra security layer. You can re-enable it anytime.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisableDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDisable} disabled={busy}>
              {isDisabling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Yes, Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
