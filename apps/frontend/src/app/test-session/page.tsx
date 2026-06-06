"use client";

import { useAuth } from "@/redux/auth/useAuth";
import { useEffect } from "react";

export default function TestSessionPage() {
  const { session, status } = useAuth();

  useEffect(() => {
    console.log("🧪 TEST SESSION PAGE");
    console.log("🧪 Status:", status);
    console.log("🧪 Session:", session);
    console.log("🧪 Session.user:", session?.user);
    console.log("🧪 Session.accessToken:", session?.accessToken);
  }, [session, status]);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Session Test Page</h1>
      <div style={{ marginTop: "2rem" }}>
        <h2>Status: {status}</h2>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
