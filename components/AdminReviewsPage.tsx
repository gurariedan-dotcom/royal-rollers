"use client";

import { useEffect, useState } from "react";
import { Star } from "@phosphor-icons/react/dist/ssr";

type Review = {
  id: string;
  customer_name: string;
  route: string | null;
  rating: number | null;
  body: string;
  created_at: string;
};

// Same key as AdminQuotesPage, so unlocking one admin tab unlocks the others.
const SECRET_STORAGE_KEY = "royal-rollers-ops-secret";
const EMPTY_DRAFT = { customerName: "", route: "", rating: 5 as number | null, body: "" };

export default function AdminReviewsPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");
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
    if (unlocked) loadReviews(secret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  async function loadReviews(key: string) {
    setLoadError("");
    const res = await fetch("/api/admin/reviews", { headers: { Authorization: `Bearer ${key}` } });
    if (!res.ok) {
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      setUnlocked(false);
      setLoadError("That key didn't work.");
      return;
    }
    setReviews((await res.json()).reviews);
  }

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(SECRET_STORAGE_KEY, secret);
    setUnlocked(true);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormMessage("");
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify(draft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const fieldErrors = data?.issues?.fieldErrors ?? {};
        setFormMessage(Object.values(fieldErrors).flat()[0] as string ?? data.error ?? "Couldn't save that review.");
        return;
      }
      setReviews((prev) => [data.review, ...(prev ?? [])]);
      setDraft(EMPTY_DRAFT);
      setFormMessage("Review added. It's live on the site.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.ok) setReviews((prev) => (prev ?? []).filter((r) => r.id !== id));
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
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
        {loadError && <p className="text-sm text-danger">{loadError}</p>}
        <button
          type="submit"
          className="rounded-sm bg-brass px-6 py-2.5 font-display text-sm uppercase tracking-wideish text-ink hover:bg-brass-dark"
        >
          Unlock
        </button>
      </form>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr]">
      <form onSubmit={handleAdd} className="card h-fit space-y-5 p-6">
        <p className="text-xl font-extrabold text-ink">Add a review</p>
        <div>
          <label htmlFor="reviewName" className="field-label">Customer name</label>
          <input
            id="reviewName"
            value={draft.customerName}
            onChange={(e) => setDraft({ ...draft, customerName: e.target.value })}
            placeholder="e.g. Sarah M."
            maxLength={80}
            required
            className="field"
          />
        </div>
        <div>
          <label htmlFor="reviewRoute" className="field-label">
            Route <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id="reviewRoute"
            value={draft.route}
            onChange={(e) => setDraft({ ...draft, route: e.target.value })}
            placeholder="e.g. Brooklyn, NY → Miami, FL"
            maxLength={120}
            className="field"
          />
        </div>
        <fieldset>
          <legend className="field-label">Stars</legend>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={draft.rating === n}
                onClick={() => setDraft({ ...draft, rating: n })}
                className="p-1"
              >
                <Star size={28} weight={draft.rating && n <= draft.rating ? "fill" : "regular"} className="text-amber-dark" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, rating: null })}
              className="ml-3 text-sm text-slate underline"
            >
              No stars
            </button>
          </div>
        </fieldset>
        <div>
          <label htmlFor="reviewBody" className="field-label">What they said</label>
          <textarea
            id="reviewBody"
            rows={5}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            maxLength={1000}
            required
            className="field resize-y"
          />
        </div>
        {formMessage && <p className="text-sm text-slate" role="status">{formMessage}</p>}
        <button type="submit" disabled={saving} className="btn-amber w-full disabled:opacity-50">
          {saving ? "Saving…" : "Add review"}
        </button>
      </form>

      <div>
        <p className="manifest-label">On the site ({reviews?.length ?? 0})</p>
        {!reviews ? (
          <p className="mt-4 text-ink/60">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="mt-4 text-ink/60">No reviews yet. Add your first one on the left.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-ink">
                      {r.customer_name}
                      {r.rating && <span className="ml-2 text-amber-ink">{"★".repeat(r.rating)}</span>}
                    </p>
                    {r.route && <p className="text-sm text-slate">{r.route}</p>}
                  </div>
                  {pendingDeleteId === r.id ? (
                    <span className="flex shrink-0 items-center gap-2 text-sm">
                      Delete?
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="font-bold text-danger underline"
                      >
                        Yes
                      </button>
                      <button type="button" onClick={() => setPendingDeleteId(null)} className="underline">
                        No
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(r.id)}
                      className="shrink-0 text-sm text-slate underline hover:text-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line text-ink/80">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
