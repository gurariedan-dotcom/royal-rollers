import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/http";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const limited = rateLimit(req, "admin-reviews-write", 30, 15 * 60_000);
  if (limited) return limited;

  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || req.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { error, count } = await getDb().from("reviews").delete({ count: "exact" }).eq("id", params.id);
  if (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ error: "Failed to delete review." }, { status: 500 });
  }
  if (!count) return NextResponse.json({ error: "Review not found." }, { status: 404 });

  revalidatePath("/");
  revalidatePath("/reviews");
  return NextResponse.json({ deleted: true });
}
