import { Resend } from "resend";
import type { BookingRow, QuoteRequestRow } from "./db";
import { formatOrderNumber } from "./orderNumber";
import QuoteReceived from "@/emails/QuoteReceived";
import OwnerNewQuoteAlert from "@/emails/OwnerNewQuoteAlert";
import QuoteReady from "@/emails/QuoteReady";
import BalanceChargeFailed from "@/emails/BalanceChargeFailed";
import OwnerBalanceChargeFailedAlert from "@/emails/OwnerBalanceChargeFailedAlert";
import BookingConfirmed from "@/emails/BookingConfirmed";
import OwnerNewBookingAlert from "@/emails/OwnerNewBookingAlert";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY. Check .env.local against .env.example.");
  }
  return new Resend(key);
}

const FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS ?? "quotes@royalrollers.example";
const OWNER_ALERT_ADDRESS = process.env.OWNER_ALERT_EMAIL ?? "owner@royalrollers.example";
const SUPPORT_PHONE_HREF = "tel:+16465892334";
const SUPPORT_PHONE_DISPLAY = "(646) 589-2334";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://royalrollers.example";
}

function serviceLabel(serviceType: QuoteRequestRow["service_type"]): string {
  return serviceType === "carrier" ? "Carrier Transport" : "Personal Driver";
}

function formatDollars(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function vehicleLabel(quote: QuoteRequestRow): string {
  return [quote.vehicle_year, quote.vehicle_make, quote.vehicle_model, quote.vehicle_type ? `(${quote.vehicle_type})` : null]
    .filter(Boolean)
    .join(" ");
}

function routeLabel(quote: QuoteRequestRow): string {
  return `${quote.pickup_zip} → ${quote.dropoff_zip}${quote.round_trip ? " (round trip)" : ""}`;
}

type DetailRow = { label: string; value: string };

// Every field on the quote, for the "Full shipment details" disclosure.
// Templates that already show vehicle/route inline drop those two rows to
// avoid repeating them (see the .filter() calls below).
function shipmentDetailRows(quote: QuoteRequestRow): DetailRow[] {
  const rows: DetailRow[] = [
    { label: "VIN", value: quote.vin ?? "Not provided" },
    { label: "Vehicle", value: vehicleLabel(quote) || "—" },
    { label: "Running", value: quote.is_running ? "Yes" : "No" },
  ];
  if (quote.service_type === "carrier") {
    rows.push({ label: "Enclosed", value: quote.enclosed ? "Yes" : "No (open)" });
  }
  rows.push({ label: "Route", value: routeLabel(quote) });
  rows.push({
    label: "Preferred date",
    value: `${quote.preferred_pickup_date ?? "—"} (${quote.flexibility_window ?? "—"})`,
  });
  return rows;
}

// The Resend SDK doesn't throw on API-level failures (bad recipient, domain
// not verified, etc.) -- it resolves with { data: null, error } instead. If
// callers just `await resend.emails.send(...)` and ignore the return value,
// a rejected send looks identical to a successful one and fails silently.
async function send(resend: Resend, params: Parameters<Resend["emails"]["send"]>[0]) {
  // ponytail: dev/staging catch-all, remove EMAIL_OVERRIDE_TO in prod to send to real recipients
  const overrideTo = process.env.EMAIL_OVERRIDE_TO;
  if (overrideTo) params = { ...params, to: overrideTo };
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

  await send(resend, {
    from: FROM_ADDRESS,
    to: quote.contact_email,
    subject: "We've got your quote request — Royal Rollers",
    react: QuoteReceived({
      contactName: quote.contact_name,
      orderNumber: formatOrderNumber(quote.order_number),
      detailRows: shipmentDetailRows(quote),
    }),
  });
}

// Internal alert to the owner so a human can actually respond promptly. Per
// the handoff doc, plain email risks being missed if the owner is out on a
// pickup -- if that turns out to be true in practice, swap/augment this with
// an SMS provider (e.g. Twilio) rather than relying on inbox checking alone.
export async function sendOwnerAlertEmail(quote: QuoteRequestRow) {
  const resend = getResend();

  await send(resend, {
    from: FROM_ADDRESS,
    to: OWNER_ALERT_ADDRESS,
    subject: `New quote request: ${quote.contact_name} (${serviceLabel(quote.service_type)})`,
    react: OwnerNewQuoteAlert({
      serviceLabel: serviceLabel(quote.service_type),
      vin: quote.vin ?? "not provided — confirm with customer",
      vehicle: vehicleLabel(quote) || "—",
      running: quote.is_running ? "Yes" : "No",
      enclosed: quote.service_type === "carrier" ? (quote.enclosed ? "Yes" : "No (open)") : null,
      route: routeLabel(quote),
      preferredDate: `${quote.preferred_pickup_date ?? "—"} (${quote.flexibility_window ?? "—"})`,
      contactName: quote.contact_name,
      contactPhone: quote.contact_phone,
      contactEmail: quote.contact_email,
      orderNumber: formatOrderNumber(quote.order_number),
      adminUrl: `${siteUrl()}/admin/quotes`,
    }),
  });
}

// Sent once the owner has priced the job (Section 4.4). Whatever admin
// surface eventually calls this should have already written
// quoted_amount_cents onto the quote_requests row -- see db/schema.sql.
export async function sendQuoteReadyEmail(quote: QuoteRequestRow, quoteAmountCents: number) {
  const resend = getResend();
  const bookingUrl = `${siteUrl()}/book/${quote.id}`;

  await send(resend, {
    from: FROM_ADDRESS,
    to: quote.contact_email,
    subject: "Your Royal Rollers quote is ready",
    react: QuoteReady({
      contactName: quote.contact_name,
      route: routeLabel(quote),
      dollars: formatDollars(quoteAmountCents),
      bookingUrl,
      orderNumber: formatOrderNumber(quote.order_number),
      detailRows: shipmentDetailRows(quote).filter((r) => r.label !== "Route"),
    }),
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
export async function sendBalanceChargeFailedEmail(
  quote: QuoteRequestRow,
  params: { balanceAmountCents: number; reason: BalanceChargeFailureReason }
) {
  const resend = getResend();

  await send(resend, {
    from: FROM_ADDRESS,
    to: quote.contact_email,
    subject: "We couldn't charge your card — Royal Rollers",
    react: BalanceChargeFailed({
      contactName: quote.contact_name,
      dollars: formatDollars(params.balanceAmountCents),
      reasonText: balanceFailureReasonText(params.reason),
      orderNumber: formatOrderNumber(quote.order_number),
      phoneHref: SUPPORT_PHONE_HREF,
      phoneDisplay: SUPPORT_PHONE_DISPLAY,
      detailRows: shipmentDetailRows(quote),
    }),
  });
}

// Internal alert so the owner knows a delivered job's balance charge needs
// manual follow-up -- the customer gets their own email too, but that email
// can get missed, bounce, or land in spam, so this shouldn't be the only copy.
export async function sendBalanceChargeFailedOwnerAlertEmail(
  quote: QuoteRequestRow,
  params: { balanceAmountCents: number; reason: BalanceChargeFailureReason }
) {
  const resend = getResend();

  await send(resend, {
    from: FROM_ADDRESS,
    to: OWNER_ALERT_ADDRESS,
    subject: `Balance charge failed: ${quote.contact_name}`,
    react: OwnerBalanceChargeFailedAlert({
      contactName: quote.contact_name,
      contactEmail: quote.contact_email,
      dollars: formatDollars(params.balanceAmountCents),
      reasonText: balanceFailureReasonText(params.reason),
      orderNumber: formatOrderNumber(quote.order_number),
      adminUrl: `${siteUrl()}/admin/bookings`,
      detailRows: shipmentDetailRows(quote),
    }),
  });
}

// Sent to the customer once their deposit clears (lib/booking.ts
// finalizeBookingFromSession) -- previously nothing fired here at all, so a
// customer who paid a deposit got no receipt confirming it.
export async function sendBookingConfirmedEmail(quote: QuoteRequestRow, booking: BookingRow) {
  const resend = getResend();

  await send(resend, {
    from: FROM_ADDRESS,
    to: quote.contact_email,
    subject: "You're booked — Royal Rollers",
    react: BookingConfirmed({
      contactName: quote.contact_name,
      vehicle: vehicleLabel(quote) || "—",
      route: routeLabel(quote),
      depositDollars: formatDollars(booking.deposit_amount_cents),
      balanceDollars: booking.balance_amount_cents != null ? formatDollars(booking.balance_amount_cents) : "—",
      orderNumber: formatOrderNumber(quote.order_number),
      detailRows: shipmentDetailRows(quote).filter((r) => r.label !== "Vehicle" && r.label !== "Route"),
    }),
  });
}

// Internal alert so the owner knows a booking came in, same trigger as
// sendBookingConfirmedEmail -- previously nothing alerted the owner either.
export async function sendOwnerNewBookingAlertEmail(quote: QuoteRequestRow, booking: BookingRow) {
  const resend = getResend();

  await send(resend, {
    from: FROM_ADDRESS,
    to: OWNER_ALERT_ADDRESS,
    subject: `New booking: ${quote.contact_name}`,
    react: OwnerNewBookingAlert({
      contactName: quote.contact_name,
      contactEmail: quote.contact_email,
      contactPhone: quote.contact_phone,
      vehicle: vehicleLabel(quote) || "—",
      route: routeLabel(quote),
      depositDollars: formatDollars(booking.deposit_amount_cents),
      balanceDollars: booking.balance_amount_cents != null ? formatDollars(booking.balance_amount_cents) : "—",
      orderNumber: formatOrderNumber(quote.order_number),
      adminUrl: `${siteUrl()}/admin/bookings`,
      detailRows: shipmentDetailRows(quote).filter((r) => r.label !== "Vehicle" && r.label !== "Route"),
    }),
  });
}
