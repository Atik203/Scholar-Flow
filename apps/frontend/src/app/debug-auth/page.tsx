"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/auth/authHelpers";
import { handleSignOut } from "@/lib/auth/signout";
import { useAuth } from "@/redux/auth/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

export default function AuthDebugPage() {
  const { session, status } = useAuth();
  const dispatch = useAppDispatch();
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [testPassword, setTestPassword] = useState("test123");
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testCredentialsLogin = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log("🧪 Starting credentials test...");
      const result = await signInWithCredentials(
        testEmail,
        testPassword,
        dispatch
      );

      console.log("🧪 Test result:", result);
      setTestResult(result);
    } catch (error) {
      console.error("🧪 Test error:", error);
      setTestResult({ error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl.replace("/api", "")}/health`);
      const data = await response.json();
      alert(
        `Backend Health: ${response.ok ? "✅ OK" : "❌ Failed"}\n${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      alert(`Backend Connection Failed: ${error}`);
    }
  };

  const testBackendAuth = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      const data = await response.json();
      alert(
        `Backend Auth Test: ${response.ok ? "✅ Success" : "❌ Failed"}\n${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      alert(`Backend Auth Test Failed: ${error}`);
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      // Session is automatically synced from Redux Persist
      alert(
        "Session state is automatically managed by Redux Persist. Check the session data below."
      );
    } catch (error) {
      alert(`Failed to refresh session: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const sessionCookie = cookies.find((c) =>
      c.startsWith("next-auth.session-token")
    );
    alert(
      sessionCookie
        ? `✅ Session cookie found:\n${sessionCookie}`
        : "❌ No session cookie found!"
    );
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🔐 Authentication Debug Panel</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Back to Home
        </Button>
      </div>

      {/* Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "authenticated" && (
              <CheckCircle2 className="text-green-500" />
            )}
            {status === "unauthenticated" && (
              <XCircle className="text-red-500" />
            )}
            {status === "loading" && (
              <AlertCircle className="text-yellow-500" />
            )}
            Session Status: <span className="text-primary">{status}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Session Data:</Label>
            <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto max-h-64">
              {JSON.stringify(session, null, 2) || "null"}
            </pre>
          </div>

          <div className="flex gap-2">
            <Button onClick={refreshSession} disabled={isLoading}>
              Refresh Session
            </Button>
            <Button variant="outline" onClick={checkCookies}>
              Check Cookies
            </Button>
            {status === "authenticated" && (
              <Button
                variant="destructive"
                onClick={() => handleSignOut("/login")}
              >
                Sign Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Credentials Login */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test Credentials Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="password"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={testCredentialsLogin}
              disabled={isLoading || !testEmail || !testPassword}
            >
              {isLoading ? "Testing..." : "Test NextAuth Credentials"}
            </Button>
            <Button
              variant="outline"
              onClick={testBackendAuth}
              disabled={!testEmail || !testPassword}
            >
              Test Backend Direct
            </Button>
          </div>

          {testResult && (
            <div>
              <Label className="font-semibold">Test Result:</Label>
              <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto max-h-64">
                {JSON.stringify(testResult, null, 2)}
              </pre>
              {testResult.ok && (
                <p className="text-green-600 mt-2 font-semibold">
                  ✅ Login successful! Session should be created.
                </p>
              )}
              {testResult.error && (
                <p className="text-red-600 mt-2 font-semibold">
                  ❌ Error: {testResult.error}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backend Connection Tests */}
      <Card>
        <CardHeader>
          <CardTitle>🔌 Backend Connection Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>
              <strong>API Base URL:</strong>{" "}
              <code className="bg-muted px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_BASE_URL ||
                  "http://localhost:5000/api"}
              </code>
            </p>
          </div>

          <Button onClick={testBackendConnection}>Test Backend Health</Button>
        </CardContent>
      </Card>

      {/* Environment Check */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              {process.env.NEXT_PUBLIC_API_BASE_URL ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              <span>NEXT_PUBLIC_API_BASE_URL</span>
              <code className="ml-auto bg-muted px-2 py-1 rounded text-sm">
                {process.env.NEXT_PUBLIC_API_BASE_URL || "❌ NOT SET"}
              </code>
            </div>
            <div className="flex items-center gap-2">
              {process.env.NEXTAUTH_URL ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <AlertCircle className="text-yellow-500" />
              )}
              <span>NEXTAUTH_URL</span>
              <code className="ml-auto bg-muted px-2 py-1 rounded text-sm">
                {process.env.NEXTAUTH_URL || "Using default"}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Console Logs Guide */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Debugging Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Expected Console Logs During Login:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>🔥 AUTHORIZE FUNCTION CALLED</li>
              <li>🚀 Attempting signin with URL...</li>
              <li>✅ Response status: 200</li>
              <li>✅ User authenticated</li>
              <li>🔐 SIGNIN CALLBACK CALLED</li>
              <li>🔑 JWT CALLBACK CALLED</li>
              <li>👤 SESSION CALLBACK CALLED</li>
              <li>✅ Sign-in successful, session created</li>
            </ol>
            <p className="mt-4 text-muted-foreground">
              If any of these logs are missing, that's where the authentication
              is failing. Check the browser console (F12) for detailed logs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Fixes */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Quick Fixes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Clear Browser Data</h3>
              <p className="text-sm text-muted-foreground">
                Press F12 → Application → Clear site data
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                2. Verify Backend is Running
              </h3>
              <p className="text-sm text-muted-foreground">
                Check: <code>http://localhost:5000/health</code>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                3. Check Environment Variables
              </h3>
              <p className="text-sm text-muted-foreground">
                Ensure NEXTAUTH_SECRET matches in both .env files
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Restart Dev Servers</h3>
              <p className="text-sm text-muted-foreground">
                Run: <code>yarn dev:turbo</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
