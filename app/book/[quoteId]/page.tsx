import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Book Your Move",
  description: "Confirm your priced quote and pay your deposit securely to book your vehicle transport.",
};

export default function BookPage({ params }: { params: { quoteId: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="manifest-label">Book your move</p>
      <h1 className="mt-2 text-3xl">Confirm and pay your deposit</h1>
      <p className="mt-4 text-ink/70">
        Your card is saved securely and only charged again automatically once
        your vehicle is delivered.
      </p>

      <div className="mt-10 rounded-sm border border-ink/10 bg-paper p-6 shadow-panel md:p-10">
        <BookingForm quoteId={params.quoteId} />
      </div>
    </div>
  );
}
