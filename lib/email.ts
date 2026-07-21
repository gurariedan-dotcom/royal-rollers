import { Resend } from "resend";
import type { QuoteRequestRow } from "./db";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY. Check .env.local against .env.example.");
  }
  return new Resend(key);
}

const FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS ?? "quotes@royalrollers.example";
const OWNER_ALERT_ADDRESS = process.env.OWNER_ALERT_EMAIL ?? "owner@royalrollers.example";

// The Resend SDK doesn't throw on API-level failures (bad recipient, domain
// not verified, etc.) -- it resolves with { data: null, error } instead. If
// callers just `await resend.emails.send(...)` and ignore the return value,
// a rejected send looks identical to a successful one and fails silently.
async function send(resend: Resend, params: Parameters<Resend["emails"]["send"]>[0]) {
  const { error } = await resend.emails.send(params);
  if (error) {
    throw new Error(`Resend rejected the email to ${params.to}: ${error.message}`);
  }
}

// Sent to the customer immediately on submission. This is NOT the quote
// itself (the owner hasn't priced it yet) -- it's a receipt that sets
// expectations. No turnaround-time promise here on purpose -- business hours
// and a real SLA were never decided, so the copy doesn't commit to one.
export async function sendQuoteReceivedEmail(quote: QuoteRequestRow) {
  const resend = getResend();
  const serviceLabel = quote.service_type === "carrier" ? "Carrier Transport" : "Personal Driver";

  await send(resend, {
    from: FROM_ADDRESS,
    to: quote.contact_email,
    subject: "We've got your quote request \u2014 Royal Rollers",
    text: [
      `Hi ${quote.contact_name},`,
      "",
      `Thanks for requesting a quote for ${serviceLabel.toLowerCase()} `
        + `from ${quote.pickup_zip} to ${quote.dropoff_zip}.`,
      "",
      "We'll follow up by email with a priced quote.",
      "",
      `Reference: ${quote.id}`,
      "",
      "\u2014 Royal Rollers",
    ].join("\n"),
  });
}

// Internal alert to the owner so a human can actually respond promptly. Per
// the handoff doc, plain email risks being missed if the owner is out on a
// pickup -- if that turns out to be true in practice, swap/augment this with
// an SMS provider (e.g. Twilio) rather than relying on inbox checking alone.
export async function sendOwnerAlertEmail(quote: QuoteRequestRow) {
  const resend = getResend();
  const serviceLabel = quote.service_type === "carrier" ? "Carrier Transport" : "Personal Driver";

  await send(resend, {
    from: FROM_ADDRESS,
    to: OWNER_ALERT_ADDRESS,
    subject: `New quote request: ${quote.contact_name} (${serviceLabel})`,
    text: [
      `Service: ${serviceLabel}`,
      `VIN: ${quote.vin ?? "not provided — confirm with customer"}`,
      `Vehicle: ${quote.vehicle_year ?? "?"} ${quote.vehicle_make ?? ""} ${quote.vehicle_model ?? ""}${
        quote.vehicle_type ? ` (${quote.vehicle_type})` : ""
      }`,
      `Running: ${quote.is_running ? "Yes" : "No"}`,
      quote.service_type === "carrier" ? `Enclosed: ${quote.enclosed ? "Yes" : "No (open)"}` : null,
      `Route: ${quote.pickup_zip} \u2192 ${quote.dropoff_zip}`,
      `Preferred date: ${quote.preferred_pickup_date ?? "\u2014"} (${quote.flexibility_window ?? "\u2014"})`,
      `Contact: ${quote.contact_name} \u2014 ${quote.contact_phone} \u2014 ${quote.contact_email}`,
      "",
      `Reference: ${quote.id}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

// Sent once the owner has priced the job (Section 4.4). Whatever admin
// surface eventually calls this should have already written
// quoted_amount_cents onto the quote_requests row -- see db/schema.sql.
export async function sendQuoteReadyEmail(quote: QuoteRequestRow, quoteAmountCents: number) {
  const resend = getResend();
  const dollars = (quoteAmountCents / 100).toFixed(2);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://royalrollers.example";
  const bookingUrl = `${siteUrl}/book/${quote.id}`;

  await send(resend, {
    from: FROM_ADDRESS,
    to: quote.contact_email,
    subject: "Your Royal Rollers quote is ready",
    text: [
      `Hi ${quote.contact_name},`,
      "",
      `Your quote for ${quote.pickup_zip} \u2192 ${quote.dropoff_zip} is $${dollars}.`,
      "",
      `Ready to book? ${bookingUrl}`,
      "Booking takes a deposit and a card on file for the remaining balance,",
      "which is charged automatically when your vehicle is delivered.",
      "",
      `Reference: ${quote.id}`,
    ].join("\n"),
  });
}

export type BalanceChargeFailureReason = "requires_authentication" | "card_declined" | "unknown";

function balanceFailureReasonText(reason: BalanceChargeFailureReason): string {
  switch (reason) {
    case "requires_authentication":
      return "your bank required additional verification we couldn't complete automatically";
    case "card_declined":
      return "the card on file was declined";
    default:
      return "we weren't able to process the charge";
  }
}

// Sent when the automatic balance charge (lib/stripe.ts chargeRemainingBalance,
// triggered from /api/charge-balance) fails. Without this, a customer whose
// card was declined or needs re-authentication never hears anything -- the
// failure was only ever visible internally via balance_charge_status.
export async function sendBalanceChargeFailedEmail(params: {
  contactName: string;
  contactEmail: string;
  balanceAmountCents: number;
  quoteRequestId: string;
  reason: BalanceChargeFailureReason;
}) {
  const resend = getResend();
  const dollars = (params.balanceAmountCents / 100).toFixed(2);

  await send(resend, {
    from: FROM_ADDRESS,
    to: params.contactEmail,
    subject: "We couldn't charge your card — Royal Rollers",
    text: [
      `Hi ${params.contactName},`,
      "",
      `Your vehicle has been delivered, but we weren't able to charge the remaining `
        + `balance of $${dollars} — ${balanceFailureReasonText(params.reason)}.`,
      "",
      "Please reply to this email or give us a call so we can update your payment",
      "method and complete the charge.",
      "",
      `Reference: ${params.quoteRequestId}`,
      "",
      "— Royal Rollers",
    ].join("\n"),
  });
}

// Internal alert so the owner knows a delivered job's balance charge needs
// manual follow-up -- the customer gets their own email too, but that email
// can get missed, bounce, or land in spam, so this shouldn't be the only copy.
export async function sendBalanceChargeFailedOwnerAlertEmail(params: {
  contactName: string;
  contactEmail: string;
  balanceAmountCents: number;
  quoteRequestId: string;
  reason: BalanceChargeFailureReason;
}) {
  const resend = getResend();
  const dollars = (params.balanceAmountCents / 100).toFixed(2);

  await send(resend, {
    from: FROM_ADDRESS,
    to: OWNER_ALERT_ADDRESS,
    subject: `Balance charge failed: ${params.contactName}`,
    text: [
      `Balance charge of $${dollars} failed for ${params.contactName} (${params.contactEmail}).`,
      `Reason: ${balanceFailureReasonText(params.reason)}`,
      "The customer has been emailed asking them to follow up.",
      "",
      `Reference: ${params.quoteRequestId}`,
    ].join("\n"),
  });
}
