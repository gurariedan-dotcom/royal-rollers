import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, type QuoteRequestRow } from "@/lib/db";
import { sendQuoteReadyEmail } from "@/lib/email";
import { rateLimit, readJsonBody } from "@/lib/http";

// There's no admin UI in this build (none was scoped in planning) -- this
// route is the missing link identified during review: somewhere, the owner
// has to actually enter a price, or nothing downstream (deposit, booking
// page) has a number to work with. For now this is a plain authenticated
// endpoint the owner can hit with curl/Postman/a form-post tool; replace
// with a real admin page when there's time to build one.
const priceSchema = z.object({
  quotedAmountCents: z.number().int().positive(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const limited = rateLimit(req, "ops-secret", 5, 15 * 60_000);
  if (limited) return limited;

  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bodyResult = await readJsonBody(req);
  if (!bodyResult.ok) return bodyResult.response;

  const parsed = priceSchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const db = getDb();
  const { data, error } = await db
    .from("quote_requests")
    .update({ quoted_amount_cents: parsed.data.quotedAmountCents, status: "quoted" })
    .eq("id", params.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  const quote = data as QuoteRequestRow;

  try {
    await sendQuoteReadyEmail(quote, parsed.data.quotedAmountCents);
  } catch (err) {
    console.error("Failed to send quote-ready email:", err);
    // The price is saved even if the email fails -- don't lose the pricing
    // work over a transient email error. Surface it so it can be resent.
    return NextResponse.json(
      { id: quote.id, quotedAmountCents: parsed.data.quotedAmountCents, emailSent: false },
      { status: 200 }
    );
  }

  return NextResponse.json({ id: quote.id, quotedAmountCents: parsed.data.quotedAmountCents, emailSent: true });
}
