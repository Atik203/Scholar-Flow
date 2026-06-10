import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: "Auth test route working (better-auth)",
    url: req.url,
    timestamp: new Date().toISOString()
  });
}
