import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { constructWebhookEvent, retrieveCheckoutSession } from "@/lib/stripe";
import { finalizeBookingFromSession } from "@/lib/booking";

// Safety net for the deposit Checkout flow (see app/api/booking/checkout-session
// and lib/booking.ts): the success-page redirect finalizes almost every real
// booking already, but if a customer pays and closes the tab before that
// redirect completes, this is the only thing that still marks the deposit
// paid and saves the card for the balance charge. Needs to be registered as
// an endpoint in the Stripe Dashboard (Developers -> Webhooks) listening for
// `checkout.session.completed`, with its signing secret set as
// STRIPE_WEBHOOK_SECRET -- this route rejects anything not signed with it.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = await constructWebhookEvent(payload, signature);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sessionId = (event.data.object as Stripe.Checkout.Session).id;
    // The webhook payload doesn't include the expanded payment_intent.payment_method
    // (Stripe only expands that on a direct API fetch), so re-retrieve the
    // session the same way the success page does rather than relying on
    // whatever shape the event body happens to carry.
    const session = await retrieveCheckoutSession(sessionId);
    const result = await finalizeBookingFromSession(session);
    if (result.status === "booking_not_found" || result.status === "missing_payment_details") {
      console.error(`Webhook could not finalize Checkout session ${sessionId}:`, result.status);
    }
  }

  return NextResponse.json({ received: true });
}
