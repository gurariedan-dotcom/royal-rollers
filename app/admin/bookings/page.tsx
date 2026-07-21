import AdminBookingsPage from "@/components/AdminBookingsPage";

export const metadata = {
  title: "Bookings | Royal Rollers Ops",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="manifest-label">Internal</p>
      <h1 className="mt-2 text-3xl">Bookings</h1>
      <p className="mt-4 text-ink/70">
        Charge the remaining balance once a vehicle has been delivered. Sorted newest first —
        search by customer name or email to find a job.
      </p>
      <div className="mt-10">
        <AdminBookingsPage />
      </div>
    </div>
  );
}
