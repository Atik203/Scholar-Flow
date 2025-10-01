"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface DiagnosticData {
  nextAuthSession: any;
  nextAuthStatus: string;
  reduxUser: any;
  reduxToken: string | null;
  cookies: string[];
  serverHasSession: boolean | null;
  localStorageKeys: string[];
  sessionStorageKeys: string[];
  timestamp: string;
}

export default function DiagnosticPage() {
  const { data: session, status } = useSession();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const reduxToken = useAppSelector((state) => state.auth.accessToken);
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const collectDiagnostics = useCallback(async () => {
    // Check if server has a session (detects httpOnly cookies)
    let serverHasSession = null;
    try {
      const response = await fetch("/api/auth/session");
      const serverSession = await response.json();
      serverHasSession =
        !!serverSession && Object.keys(serverSession).length > 0;
    } catch (error) {
      console.error("Failed to check server session:", error);
    }

    const data: DiagnosticData = {
      nextAuthSession: session,
      nextAuthStatus: status,
      reduxUser,
      reduxToken,
      cookies: document.cookie
        .split(";")
        .filter((c) => c.trim())
        .map((c) => c.trim()),
      serverHasSession,
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
      timestamp: new Date().toISOString(),
    };
    setDiagnostics(data);
  }, [session, status, reduxUser, reduxToken]);

  useEffect(() => {
    collectDiagnostics();
  }, [collectDiagnostics]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(collectDiagnostics, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, collectDiagnostics]);

  const clearAllAuthData = async () => {
    // Use our comprehensive signout instead of NextAuth default
    const { handleSignOut } = await import("@/lib/auth/signout");
    await handleSignOut("/dev/diagnostics");
  };

  const clearCookiesManually = () => {
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      const trimmedName = name.trim();
      if (trimmedName.includes("next-auth")) {
        const deletionStrings = [
          `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
          `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`,
          `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
        ];
        deletionStrings.forEach((str) => (document.cookie = str));
      }
    });
    collectDiagnostics();
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    collectDiagnostics();
  };

  const clearSessionStorage = () => {
    sessionStorage.clear();
    collectDiagnostics();
  };

  if (!diagnostics) {
    return <div className="p-8">Loading diagnostics...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Auth Diagnostics</h1>
          <p className="text-muted-foreground">
            Senior-level debugging tool for persistent user state issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Stop" : "Start"} Auto-Refresh
          </Button>
          <Button onClick={collectDiagnostics}>Refresh Now</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>NextAuth Session</CardTitle>
            <CardDescription>
              Status:{" "}
              <span className="font-semibold">
                {diagnostics.nextAuthStatus}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
              {JSON.stringify(diagnostics.nextAuthSession, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redux State</CardTitle>
            <CardDescription>Client-side auth state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">User:</p>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-48 text-xs">
                  {JSON.stringify(diagnostics.reduxUser, null, 2)}
                </pre>
              </div>
              <div>
                <p className="font-semibold mb-2">Token:</p>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                  {diagnostics.reduxToken || "null"}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
            <CardDescription>
              {diagnostics.cookies.length} cookies found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {diagnostics.cookies.map((cookie, i) => {
                const [name] = cookie.split("=");
                const isNextAuth = name.includes("next-auth");
                return (
                  <div
                    key={i}
                    className={`p-2 rounded text-xs ${
                      isNextAuth
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-muted"
                    }`}
                  >
                    {cookie}
                  </div>
                );
              })}
            </div>
            <Button
              onClick={clearCookiesManually}
              className="mt-4 w-full"
              variant="destructive"
            >
              Clear NextAuth Cookies
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>
              localStorage & sessionStorage keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">
                  localStorage ({diagnostics.localStorageKeys.length} keys):
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-32 text-xs">
                  {diagnostics.localStorageKeys.join("\n") || "Empty"}
                </pre>
                <Button
                  onClick={clearLocalStorage}
                  className="mt-2 w-full"
                  variant="outline"
                  size="sm"
                >
                  Clear localStorage
                </Button>
              </div>
              <div>
                <p className="font-semibold mb-2">
                  sessionStorage ({diagnostics.sessionStorageKeys.length} keys):
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-32 text-xs">
                  {diagnostics.sessionStorageKeys.join("\n") || "Empty"}
                </pre>
                <Button
                  onClick={clearSessionStorage}
                  className="mt-2 w-full"
                  variant="outline"
                  size="sm"
                >
                  Clear sessionStorage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Nuclear Option</CardTitle>
          <CardDescription>Complete auth cleanup and signout</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={clearAllAuthData}
            variant="destructive"
            className="w-full"
          >
            Sign Out & Clear Everything
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">Session Status:</p>
              <p>
                {diagnostics.nextAuthStatus === "authenticated"
                  ? "✅ NextAuth session is active"
                  : diagnostics.nextAuthStatus === "loading"
                    ? "⏳ Loading session..."
                    : "❌ No active session"}
              </p>
              <p className="mt-2 text-xs">
                Server session cookie:{" "}
                {diagnostics.serverHasSession === null
                  ? "⏳ Checking..."
                  : diagnostics.serverHasSession
                    ? "🔴 EXISTS (httpOnly cookie present)"
                    : "✅ Not found"}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">Redux State:</p>
              <p>
                {diagnostics.reduxUser
                  ? "⚠️ Redux has user data (potential persistence issue)"
                  : "✅ Redux state is clean"}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">Cookies:</p>
              <p>
                {diagnostics.cookies.some((c) => c.includes("next-auth"))
                  ? "⚠️ NextAuth cookies present"
                  : "✅ No NextAuth cookies found"}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">Diagnosis:</p>
              <p>
                {diagnostics.nextAuthStatus === "authenticated" &&
                diagnostics.serverHasSession &&
                !diagnostics.reduxUser
                  ? "🔴 PERSISTENT SESSION BUG: NextAuth session exists without login! Click 'Sign Out & Clear Everything' to fix."
                  : diagnostics.nextAuthStatus === "unauthenticated" &&
                      diagnostics.reduxUser
                    ? "🔴 ISSUE FOUND: Redux has user data but no NextAuth session. SessionSync should clear this."
                    : diagnostics.nextAuthStatus === "authenticated" &&
                        diagnostics.reduxUser
                      ? "✅ Normal: Both NextAuth and Redux have user data (logged in state)"
                      : diagnostics.nextAuthStatus === "unauthenticated" &&
                          !diagnostics.reduxUser &&
                          !diagnostics.serverHasSession
                        ? "✅ Normal: Completely logged out"
                        : diagnostics.serverHasSession &&
                            diagnostics.nextAuthStatus !== "authenticated"
                          ? "⚠️ Server has session cookie but client doesn't recognize it"
                          : "⚠️ Unusual state detected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(diagnostics.timestamp).toLocaleString()}
        {autoRefresh && " (Auto-refreshing every second)"}
      </p>
    </div>
  );
}
