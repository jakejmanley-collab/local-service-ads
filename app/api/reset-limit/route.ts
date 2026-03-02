import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const key = `ratelimit_${ip}`;
  
  try {
    await kv.del(key);
    return new NextResponse(`✅ Limit reset for IP: ${ip}. You have 5 new credits.`);
  } catch (error: any) {
    return new NextResponse(`❌ Failed to reset: ${error.message}`);
  }
}
