"use client";

import { useEffect, useState, type FormEvent } from "react";

type BookingListItem = {
  id: string;
  contactName: string;
  contactEmail: string;
  vehicle: string;
  route: string;
  depositAmountCents: number;
  depositStatus: string;
  balanceAmountCents: number | null;
  balanceChargeStatus: string;
  createdAt: string;
};

type PendingAction = { id: string; type: "charge" | "delete" };
type Processing = { id: string; type: "charge" | "delete" };

const SECRET_STORAGE_KEY = "royal-rollers-ops-secret";

function formatDollars(cents: number | null) {
  if (cents == null) return "—";
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-ink/60" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <svg className="h-4 w-4 animate-pop-in text-highway" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminBookingsPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [bookings, setBookings] = useState<BookingListItem[] | null>(null);
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [processing, setProcessing] = useState<Processing | null>(null);
  const [approvedId, setApprovedId] = useState<string | null>(null);
  const [rowMessages, setRowMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem(SECRET_STORAGE_KEY);
    if (stored) {
      setSecret(stored);
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) loadBookings(secret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  async function loadBookings(key: string) {
    setLoadError("");
    const res = await fetch("/api/admin/bookings", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      setUnlocked(false);
      setLoadError("That key didn't work.");
      return;
    }
    const data = await res.json();
    setBookings(data.bookings);
  }

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(SECRET_STORAGE_KEY, secret);
    setUnlocked(true);
  }

  async function handleChargeBalance(id: string) {
    setPendingAction(null);
    setProcessing({ id, type: "charge" });
    setRowMessages((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch("/api/charge-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ bookingId: id }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Charge failed.");
      setApprovedId(id);
      await loadBookings(secret);
      setTimeout(() => setApprovedId((current) => (current === id ? null : current)), 1500);
    } catch (err) {
      setRowMessages((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : "Charge failed." }));
    } finally {
      setProcessing(null);
    }
  }

  async function handleDeleteCustomer(id: string) {
    setPendingAction(null);
    setProcessing({ id, type: "delete" });
    setRowMessages((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}` },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Delete failed.");
      setBookings((prev) => (prev ? prev.filter((b) => b.id !== id) : prev));
    } catch (err) {
      setRowMessages((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : "Delete failed." }));
    } finally {
      setProcessing(null);
    }
  }

  if (!unlocked) {
    return (
      <form onSubmit={handleUnlock} className="max-w-sm space-y-4">
        <label className="block">
          <span className="manifest-label">Ops secret</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="mt-2 w-full rounded-sm border border-slate-light/60 bg-paper px-3 py-2 text-ink"
          />
        </label>
        {loadError && <p className="text-sm text-brass-dark">{loadError}</p>}
        <button
          type="submit"
          className="rounded-sm bg-brass px-6 py-2.5 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark"
        >
          Unlock
        </button>
      </form>
    );
  }

  if (!bookings) {
    return <p className="text-ink/60">Loading bookings…</p>;
  }

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return b.contactName.toLowerCase().includes(q) || b.contactEmail.toLowerCase().includes(q);
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by customer name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-sm rounded-sm border border-slate-light/60 bg-paper px-3 py-2 text-ink"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/60">
              <th className="py-2 pr-4 font-normal">Customer</th>
              <th className="py-2 pr-4 font-normal">Vehicle</th>
              <th className="py-2 pr-4 font-normal">Route</th>
              <th className="py-2 pr-4 font-normal">Deposit</th>
              <th className="py-2 pr-4 font-normal">Balance due</th>
              <th className="py-2 pr-4 font-normal">Balance status</th>
              <th className="py-2 pr-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const eligible = b.depositStatus === "paid" && b.balanceChargeStatus !== "charged";
              const isProcessing = processing?.id === b.id;
              const isPending = pendingAction?.id === b.id;

              return (
                <tr key={b.id} className="border-b border-ink/5 align-top">
                  <td className="py-3 pr-4">
                    <div className="text-ink">{b.contactName}</div>
                    <div className="text-xs text-ink/50">{b.contactEmail}</div>
                  </td>
                  <td className="py-3 pr-4">{b.vehicle}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{b.route}</td>
                  <td className="py-3 pr-4">{formatDollars(b.depositAmountCents)}</td>
                  <td className="py-3 pr-4">{formatDollars(b.balanceAmountCents)}</td>
                  <td className="py-3 pr-4 capitalize">{b.balanceChargeStatus.replace("_", " ")}</td>
                  <td className="py-3 pr-4">
                    {isProcessing ? (
                      <div className="flex items-center gap-2 text-xs text-ink/60">
                        <Spinner />
                        {processing?.type === "delete" ? "Deleting…" : "Charging…"}
                      </div>
                    ) : approvedId === b.id ? (
                      <div className="flex items-center gap-2 text-xs text-highway">
                        <CheckBadge />
                        Approved
                      </div>
                    ) : isPending && pendingAction?.type === "charge" ? (
                      <div className="max-w-[220px]">
                        <p className="text-xs text-ink/80">
                          Charge {formatDollars(b.balanceAmountCents)} to {b.contactName}&apos;s card on file?
                          This can&apos;t be undone.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => handleChargeBalance(b.id)}
                            className="rounded-sm bg-brass px-3 py-1.5 font-display text-xs uppercase tracking-wideish text-paper hover:bg-brass-dark"
                          >
                            Yes, Charge
                          </button>
                          <button
                            onClick={() => setPendingAction(null)}
                            className="rounded-sm border border-slate-light/60 px-3 py-1.5 font-display text-xs uppercase tracking-wideish text-ink/70 hover:bg-ink/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : isPending && pendingAction?.type === "delete" ? (
                      <div className="max-w-[220px]">
                        <p className="text-xs text-ink/80">
                          Delete {b.contactName}&apos;s customer record entirely? This removes it from our
                          database (Stripe keeps its own records). This can&apos;t be undone.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => handleDeleteCustomer(b.id)}
                            className="rounded-sm bg-brass px-3 py-1.5 font-display text-xs uppercase tracking-wideish text-paper hover:bg-brass-dark"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setPendingAction(null)}
                            className="rounded-sm border border-slate-light/60 px-3 py-1.5 font-display text-xs uppercase tracking-wideish text-ink/70 hover:bg-ink/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {eligible ? (
                          <button
                            onClick={() => setPendingAction({ id: b.id, type: "charge" })}
                            className="rounded-sm bg-brass px-4 py-1.5 font-display text-xs uppercase tracking-wideish text-paper hover:bg-brass-dark"
                          >
                            Mark Delivered & Charge
                          </button>
                        ) : (
                          <span className="block text-xs text-ink/40">
                            {b.balanceChargeStatus === "charged" ? "Done" : "Deposit not paid"}
                          </span>
                        )}
                        <button
                          onClick={() => setPendingAction({ id: b.id, type: "delete" })}
                          className="block text-xs text-brass-dark/70 underline hover:text-brass-dark"
                        >
                          Delete customer
                        </button>
                      </div>
                    )}
                    {rowMessages[b.id] && <p className="mt-1 text-xs text-brass-dark">{rowMessages[b.id]}</p>}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-ink/50">
                  No bookings match “{search}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
