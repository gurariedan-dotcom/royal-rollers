import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getDb, type BookingRow } from "@/lib/db";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { finalizeBookingFromSession } from "@/lib/booking";

export const metadata = {
  title: "Booking Confirmed",
};

function formatDollars(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function ErrorPanel({ quoteId, message }: { quoteId: string; message: string }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-sm border border-brass-dark bg-brass-dark/10 p-8 text-center">
        <p className="font-display text-xl uppercase tracking-signage text-brass-dark">Something went wrong</p>
        <p className="mt-3 text-ink/80">{message}</p>
        <Link
          href={`/book/${quoteId}`}
          className="mt-6 inline-block rounded-sm border border-brass px-6 py-2.5 font-display text-sm uppercase tracking-wideish text-brass transition-colors hover:bg-brass hover:text-paper"
        >
          Back to booking
        </Link>
      </div>
    </div>
  );
}

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: { quoteId: string };
  searchParams: { session_id?: string };
}) {
  noStore();

  const sessionId = searchParams.session_id;
  if (!sessionId) {
    return <ErrorPanel quoteId={params.quoteId} message="Missing checkout session. Please try booking again." />;
  }

  const session = await retrieveCheckoutSession(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <ErrorPanel
        quoteId={params.quoteId}
        message="Your payment wasn't completed, so nothing was booked. You can try again below."
      />
    );
  }

  const result = await finalizeBookingFromSession(session);
  if (result.status === "booking_not_found" || result.status === "missing_payment_details") {
    return (
      <ErrorPanel
        quoteId={params.quoteId}
        message="Your payment went through, but we hit a snag saving your booking. Contact us with your confirmation email from Stripe and we'll sort it out."
      />
    );
  }

  const db = getDb();
  const { data: booking } = await db
    .from("bookings")
    .select("*")
    .eq("stripe_checkout_session_id", sessionId)
    .single();
  const bookingRow = booking as BookingRow | null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="manifest-label">Book your move</p>
      <h1 className="mt-2 text-3xl">You&apos;re booked</h1>

      <div className="mt-10 rounded-sm border border-highway bg-highway/10 p-8 text-center shadow-panel">
        <p className="font-display text-xl uppercase tracking-signage text-highway">Booked</p>
        <p className="mt-3 text-ink/80">
          Your deposit of {bookingRow?.deposit_amount_cents ? formatDollars(bookingRow.deposit_amount_cents) : ""} has
          been charged, and your card is on file for the remaining balance
          {bookingRow?.balance_amount_cents ? ` of ${formatDollars(bookingRow.balance_amount_cents)}` : ""} on
          delivery.
        </p>
      </div>
    </div>
  );
}
