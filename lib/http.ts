import { NextRequest, NextResponse } from "next/server";

// In-memory sliding-window limiter, keyed by client IP + a caller-supplied
// bucket name (so /api/quote and the ops-secret routes don't share a
// counter). Vercel serverless functions don't share memory across
// instances/regions, so this resets on cold start and isn't a hard
// guarantee -- good enough for this site's traffic; swap for
// Upstash/Redis-backed limiting if that ever becomes a real gap.
const hits = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Returns a 429 response if the caller is over the limit, otherwise null. */
export function rateLimit(
  req: NextRequest,
  bucket: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);

  if (recent.length > limit) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  return null;
}

const MAX_BODY_BYTES = 25_000; // generous for these JSON forms; rejects abusive/malformed oversized payloads

/** Reads and JSON-parses a request body, rejecting oversized or malformed payloads. */
export async function readJsonBody(
  req: NextRequest
): Promise<{ ok: true; body: unknown } | { ok: false; response: NextResponse }> {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return { ok: false, response: NextResponse.json({ error: "Payload too large." }, { status: 413 }) };
  }

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) {
    return { ok: false, response: NextResponse.json({ error: "Payload too large." }, { status: 413 }) };
  }

  try {
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }) };
  }
}
