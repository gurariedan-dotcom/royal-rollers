"use client";

import { useEffect, useState } from "react";
import { formatOrderNumber } from "@/lib/orderNumber";
import { VEHICLE_TYPES, VEHICLE_TYPE_LABELS, FLEXIBILITY_LABELS } from "@/lib/validation";

type QuoteListItem = {
  id: string;
  orderNumber: number;
  serviceType: "carrier" | "personal_driver";
  vin: string | null;
  vehicleYear: number | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicle: string;
  vehicleType: string | null;
  isRunning: boolean | null;
  enclosed: boolean | null;
  pickupZip: string;
  dropoffZip: string;
  roundTrip: boolean;
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

// Draft shape for the inline edit form -- everything as strings/booleans
// straight off <input>/<select> elements, converted to the API's expected
// types only when saving.
type EditDraft = {
  serviceType: string;
  vin: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleType: string;
  isRunning: string;
  enclosed: string;
  pickupZip: string;
  dropoffZip: string;
  roundTrip: boolean;
  preferredPickupDate: string;
  flexibilityWindow: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

function draftFromQuote(q: QuoteListItem): EditDraft {
  return {
    serviceType: q.serviceType,
    vin: q.vin ?? "",
    vehicleYear: q.vehicleYear != null ? String(q.vehicleYear) : "",
    vehicleMake: q.vehicleMake ?? "",
    vehicleModel: q.vehicleModel ?? "",
    vehicleType: q.vehicleType ?? "",
    isRunning: q.isRunning == null ? "" : q.isRunning ? "running" : "not_running",
    enclosed: q.enclosed == null ? "" : q.enclosed ? "enclosed" : "open",
    pickupZip: q.pickupZip,
    dropoffZip: q.dropoffZip,
    roundTrip: q.roundTrip,
    preferredPickupDate: q.preferredPickupDate ?? "",
    flexibilityWindow: q.flexibilityWindow ?? "",
    contactName: q.contactName,
    contactPhone: q.contactPhone,
    contactEmail: q.contactEmail,
  };
}

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
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  function startEdit(q: QuoteListItem) {
    setEditingId(q.id);
    setEditDraft(draftFromQuote(q));
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
    setEditError("");
  }

  async function handleSaveEdit(id: string) {
    if (!editDraft) return;
    const year = Number(editDraft.vehicleYear);
    if (!editDraft.vehicleYear || !Number.isFinite(year)) {
      setEditError("Enter a valid vehicle year.");
      return;
    }

    setEditSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({
          serviceType: editDraft.serviceType,
          vin: editDraft.vin,
          vehicleYear: year,
          vehicleMake: editDraft.vehicleMake,
          vehicleModel: editDraft.vehicleModel,
          vehicleType: editDraft.vehicleType,
          isRunning: editDraft.isRunning,
          enclosed: editDraft.enclosed || undefined,
          pickupZip: editDraft.pickupZip,
          dropoffZip: editDraft.dropoffZip,
          roundTrip: editDraft.roundTrip,
          preferredPickupDate: editDraft.preferredPickupDate,
          flexibilityWindow: editDraft.flexibilityWindow,
          contactName: editDraft.contactName,
          contactPhone: editDraft.contactPhone,
          contactEmail: editDraft.contactEmail,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error ?? "Failed to save changes.");
      }
      setQuotes((prev) => (prev ? prev.map((q) => (q.id === id ? { ...q, ...body.quote } : q)) : prev));
      cancelEdit();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDeleteQuote(id: string) {
    setPendingDeleteId(null);
    setDeletingId(id);
    setRowMessages((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}` },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Delete failed.");
      setQuotes((prev) => (prev ? prev.filter((q) => q.id !== id) : prev));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setRowMessages((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : "Delete failed." }));
    } finally {
      setDeletingId(null);
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

  if (!quotes) {
    return <p className="text-ink/60">Loading quotes…</p>;
  }

  const filtered = quotes.filter((q) => {
    const query = search.toLowerCase();
    const matchesSearch = q.contactName.toLowerCase().includes(query) || q.contactEmail.toLowerCase().includes(query);
    const matchesStatus = showAll || q.status === "pending" || q.status === "quoted";
    return matchesSearch && matchesStatus;
  });
  const hiddenCount = quotes.length - quotes.filter((q) => q.status === "pending" || q.status === "quoted").length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by customer name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-sm border border-slate-light/60 bg-paper px-3 py-2 text-ink"
        />
        {hiddenCount > 0 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs text-ink/50 underline hover:text-ink/80"
          >
            {showAll ? "Show needs-action only" : `Show ${hiddenCount} booked & completed`}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/60">
              <th className="py-2 pr-4 font-normal">Order</th>
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
                  <td className="py-3 pr-4 font-mono text-xs text-ink/70">{formatOrderNumber(q.orderNumber)}</td>
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
                    {q.isRunning === false && <div className="text-xs text-brass-dark">Not running</div>}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{q.route}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        q.status === "pending"
                          ? "text-brass-dark"
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
                    {(q.status === "booked" || q.status === "completed") && !rowMessages[q.id] ? (
                      <span className="text-ink/30">—</span>
                    ) : (
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
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {pendingDeleteId === q.id ? (
                      <div className="max-w-[220px]">
                        <p className="text-xs text-ink/80">Delete this request? This can&apos;t be undone.</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            disabled={deletingId === q.id}
                            className="rounded-sm bg-brass px-3 py-1.5 font-display text-xs uppercase tracking-wideish text-paper hover:bg-brass-dark disabled:opacity-50"
                          >
                            {deletingId === q.id ? "Deleting…" : "Yes, Delete"}
                          </button>
                          <button
                            onClick={() => setPendingDeleteId(null)}
                            className="rounded-sm border border-slate-light/60 px-3 py-1.5 font-display text-xs uppercase tracking-wideish text-ink/70 hover:bg-ink/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {(q.status === "booked" || q.status === "completed") && !rowMessages[q.id] ? null : (
                          <button
                            onClick={() => handleSendQuote(q.id)}
                            disabled={isSending}
                            className="rounded-sm bg-brass px-4 py-1.5 font-display text-xs uppercase tracking-wideish text-paper hover:bg-brass-dark disabled:opacity-50"
                          >
                            {isSending ? "Sending…" : q.status === "pending" ? "Send Quote" : "Resend"}
                          </button>
                        )}
                        <button
                          onClick={() => (editingId === q.id ? cancelEdit() : startEdit(q))}
                          className="rounded-sm border border-slate-light/60 px-3 py-1.5 font-display text-xs uppercase tracking-wideish text-ink/70 hover:border-ink/40 hover:text-ink"
                        >
                          {editingId === q.id ? "Close" : "Edit"}
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(q.id)}
                          className="text-xs text-brass-dark/70 underline hover:text-brass-dark"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    {rowMessages[q.id] && (
                      <p
                        className={`mt-1 max-w-[180px] text-xs ${
                          rowMessages[q.id] === "Quote sent!" ? "text-highway" : "text-brass-dark"
                        }`}
                      >
                        {rowMessages[q.id]}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
            {editingId &&
              editDraft &&
              (() => {
                const q = filtered.find((item) => item.id === editingId);
                if (!q) return null;
                return (
                  <tr key={`${editingId}-edit`} className="border-b border-ink/10 bg-slate-light/10">
                    <td colSpan={8} className="p-4">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                        <label className="block text-xs">
                          <span className="manifest-label">Service</span>
                          <select
                            value={editDraft.serviceType}
                            onChange={(e) => setEditDraft({ ...editDraft, serviceType: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          >
                            <option value="carrier">Carrier</option>
                            <option value="personal_driver">Personal Driver</option>
                          </select>
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Enclosed</span>
                          <select
                            value={editDraft.enclosed}
                            onChange={(e) => setEditDraft({ ...editDraft, enclosed: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          >
                            <option value="">—</option>
                            <option value="open">Open</option>
                            <option value="enclosed">Enclosed</option>
                          </select>
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Running</span>
                          <select
                            value={editDraft.isRunning}
                            onChange={(e) => setEditDraft({ ...editDraft, isRunning: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          >
                            <option value="running">Running</option>
                            <option value="not_running">Not running</option>
                          </select>
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Round trip</span>
                          <select
                            value={editDraft.roundTrip ? "yes" : "no"}
                            onChange={(e) => setEditDraft({ ...editDraft, roundTrip: e.target.value === "yes" })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          >
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">VIN</span>
                          <input
                            value={editDraft.vin}
                            onChange={(e) => setEditDraft({ ...editDraft, vin: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Year</span>
                          <input
                            value={editDraft.vehicleYear}
                            onChange={(e) => setEditDraft({ ...editDraft, vehicleYear: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Make</span>
                          <input
                            value={editDraft.vehicleMake}
                            onChange={(e) => setEditDraft({ ...editDraft, vehicleMake: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Model</span>
                          <input
                            value={editDraft.vehicleModel}
                            onChange={(e) => setEditDraft({ ...editDraft, vehicleModel: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Vehicle type</span>
                          <select
                            value={editDraft.vehicleType}
                            onChange={(e) => setEditDraft({ ...editDraft, vehicleType: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          >
                            {VEHICLE_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {VEHICLE_TYPE_LABELS[t]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Pickup ZIP</span>
                          <input
                            value={editDraft.pickupZip}
                            onChange={(e) => setEditDraft({ ...editDraft, pickupZip: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Dropoff ZIP</span>
                          <input
                            value={editDraft.dropoffZip}
                            onChange={(e) => setEditDraft({ ...editDraft, dropoffZip: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Preferred date</span>
                          <input
                            value={editDraft.preferredPickupDate}
                            onChange={(e) => setEditDraft({ ...editDraft, preferredPickupDate: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Flexibility</span>
                          <select
                            value={editDraft.flexibilityWindow}
                            onChange={(e) => setEditDraft({ ...editDraft, flexibilityWindow: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          >
                            {Object.entries(FLEXIBILITY_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Contact name</span>
                          <input
                            value={editDraft.contactName}
                            onChange={(e) => setEditDraft({ ...editDraft, contactName: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Contact phone</span>
                          <input
                            value={editDraft.contactPhone}
                            onChange={(e) => setEditDraft({ ...editDraft, contactPhone: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="manifest-label">Contact email</span>
                          <input
                            value={editDraft.contactEmail}
                            onChange={(e) => setEditDraft({ ...editDraft, contactEmail: e.target.value })}
                            className="mt-1 w-full rounded-sm border border-slate-light/60 bg-paper px-2 py-1.5 text-ink"
                          />
                        </label>
                      </div>
                      {editError && <p className="mt-3 text-xs text-brass-dark">{editError}</p>}
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => handleSaveEdit(q.id)}
                          disabled={editSaving}
                          className="rounded-sm bg-brass px-4 py-1.5 font-display text-xs uppercase tracking-wideish text-paper hover:bg-brass-dark disabled:opacity-50"
                        >
                          {editSaving ? "Saving…" : "Save changes"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="font-display text-xs uppercase tracking-wideish text-ink/50 hover:text-ink"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })()}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-ink/50">
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
