"use client";

import { useEffect, useState } from "react";

type QuoteListItem = {
  id: string;
  serviceType: "carrier" | "personal_driver";
  vin: string | null;
  vehicle: string;
  vehicleType: string | null;
  isRunning: boolean | null;
  enclosed: boolean | null;
  route: string;
  preferredPickupDate: string | null;
  flexibilityWindow: string | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: "pending" | "quoted" | "booked" | "completed";
  quotedAmountCents: number | null;
  createdAt: string;
};

const SECRET_STORAGE_KEY = "royal-rollers-ops-secret";

function formatDollars(cents: number | null) {
  if (cents == null) return "—";
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const STATUS_LABELS: Record<QuoteListItem["status"], string> = {
  pending: "Pending",
  quoted: "Quoted",
  booked: "Booked",
  completed: "Completed",
};

export default function AdminQuotesPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [quotes, setQuotes] = useState<QuoteListItem[] | null>(null);
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState("");
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [rowMessages, setRowMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem(SECRET_STORAGE_KEY);
    if (stored) {
      setSecret(stored);
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) loadQuotes(secret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  async function loadQuotes(key: string) {
    setLoadError("");
    const res = await fetch("/api/admin/quotes", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      setUnlocked(false);
      setLoadError("That key didn't work.");
      return;
    }
    const data = await res.json();
    setQuotes(data.quotes);
  }

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(SECRET_STORAGE_KEY, secret);
    setUnlocked(true);
  }

  async function handleSendQuote(id: string) {
    const raw = priceDrafts[id];
    const dollars = Number(raw);
    if (!raw || !Number.isFinite(dollars) || dollars <= 0) {
      setRowMessages((prev) => ({ ...prev, [id]: "Enter a price greater than $0." }));
      return;
    }

    setSending(id);
    setRowMessages((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/quote/${id}/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ quotedAmountCents: Math.round(dollars * 100) }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to send quote.");
      if (body.emailSent === false) {
        setRowMessages((prev) => ({
          ...prev,
          [id]: "Price saved, but the email failed to send. Try again to resend.",
        }));
      } else {
        setRowMessages((prev) => ({ ...prev, [id]: "Quote sent!" }));
      }
      await loadQuotes(secret);
    } catch (err) {
      setRowMessages((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : "Failed to send quote." }));
    } finally {
      setSending(null);
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
        {loadError && <p className="text-sm text-rust">{loadError}</p>}
        <button
          type="submit"
          className="rounded-sm bg-brass px-6 py-2.5 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark"
        >
          Unlock
        </button>
      </form>
    );
  }

  if (!quotes) {
    return <p className="text-ink/60">Loading quotes…</p>;
  }

  const filtered = quotes.filter((q) => {
    const query = search.toLowerCase();
    return q.contactName.toLowerCase().includes(query) || q.contactEmail.toLowerCase().includes(query);
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
              <th className="py-2 pr-4 font-normal">Service</th>
              <th className="py-2 pr-4 font-normal">Vehicle</th>
              <th className="py-2 pr-4 font-normal">Route</th>
              <th className="py-2 pr-4 font-normal">Status</th>
              <th className="py-2 pr-4 font-normal">Price</th>
              <th className="py-2 pr-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => {
              const isSending = sending === q.id;
              return (
                <tr key={q.id} className="border-b border-ink/5 align-top">
                  <td className="py-3 pr-4">
                    <div className="text-ink">{q.contactName}</div>
                    <div className="text-xs text-ink/50">{q.contactEmail}</div>
                    <div className="text-xs text-ink/50">{q.contactPhone}</div>
                  </td>
                  <td className="py-3 pr-4">
                    {q.serviceType === "carrier" ? "Carrier" : "Personal Driver"}
                    {q.enclosed != null && (
                      <div className="text-xs text-ink/50">{q.enclosed ? "Enclosed" : "Open"}</div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {q.vehicle || "—"}
                    {q.vehicleType && <div className="text-xs text-ink/50">{q.vehicleType}</div>}
                    {q.isRunning === false && <div className="text-xs text-rust">Not running</div>}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{q.route}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        q.status === "pending"
                          ? "text-rust"
                          : q.status === "quoted"
                            ? "text-brass-dark"
                            : "text-highway"
                      }
                    >
                      {STATUS_LABELS[q.status]}
                    </span>
                    {q.quotedAmountCents != null && (
                      <div className="text-xs text-ink/50">{formatDollars(q.quotedAmountCents)} priced</div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <span className="text-ink/50">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={priceDrafts[q.id] ?? ""}
                        onChange={(e) => setPriceDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-24 rounded-sm border border-slate-light/60 bg-paper px-2 py-1 text-ink"
                      />
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleSendQuote(q.id)}
                      disabled={isSending}
                      className="rounded-sm bg-brass px-4 py-1.5 font-display text-xs uppercase tracking-wideish text-paper hover:bg-brass-dark disabled:opacity-50"
                    >
                      {isSending ? "Sending…" : q.status === "pending" ? "Send Quote" : "Resend"}
                    </button>
                    {rowMessages[q.id] && (
                      <p
                        className={`mt-1 max-w-[180px] text-xs ${
                          rowMessages[q.id] === "Quote sent!" ? "text-highway" : "text-rust"
                        }`}
                      >
                        {rowMessages[q.id]}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-ink/50">
                  No quotes match “{search}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
