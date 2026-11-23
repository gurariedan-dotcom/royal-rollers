import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { rateLimit, readJsonBody } from "@/lib/http";
import { getReviews } from "@/lib/reviews";
import { reviewSchema } from "@/lib/validation";

// Owner-managed past-customer reviews for /admin/reviews. Same shared-secret
// auth as the other internal ops routes.
function unauthorized(req: NextRequest) {
  const expected = process.env.INTERNAL_OPS_SECRET;
  return !expected || req.headers.get("authorization") !== `Bearer ${expected}`;
}

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, "admin-reviews", 30, 15 * 60_000);
  if (limited) return limited;
  if (unauthorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  return NextResponse.json({ reviews: await getReviews() });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "admin-reviews-write", 30, 15 * 60_000);
  if (limited) return limited;
  if (unauthorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const bodyResult = await readJsonBody(req);
  if (!bodyResult.ok) return bodyResult.response;

  const parsed = reviewSchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const data = parsed.data;

  const { data: inserted, error } = await getDb()
    .from("reviews")
    .insert({
      customer_name: data.customerName,
      route: data.route || null,
      rating: data.rating ?? null,
      body: data.body,
    })
    .select("id, customer_name, route, rating, body, created_at")
    .single();

  if (error || !inserted) {
    console.error("Failed to save review:", error);
    return NextResponse.json({ error: "Failed to save review." }, { status: 500 });
  }

  // Public pages are static; refresh them so the review shows right away.
  revalidatePath("/");
  revalidatePath("/reviews");
  return NextResponse.json({ review: inserted }, { status: 201 });
}
