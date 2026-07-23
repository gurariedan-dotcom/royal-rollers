"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const DISPLAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

type DatePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
};

export default function DatePicker({ id, value, onChange, hasError }: DatePickerProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewMonth, setViewMonth] = useState(() => {
    const base = value ? fromKey(value) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const firstOfMonth = viewMonth;
  const leadingBlanks = firstOfMonth.getDay();
  const daysInMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), i + 1)),
  ];

  const selectedKey = value || null;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-sm border bg-paper px-3 py-2 text-left text-ink transition-colors duration-150",
          "focus:outline-none",
          hasError ? "border-brass-dark" : "border-slate-light/60 hover:border-slate-light",
        ].join(" ")}
      >
        <span className={value ? "text-ink" : "text-slate-light"}>
          {value ? DISPLAY.format(fromKey(value)) : "Select a date…"}
        </span>
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 stroke-slate" fill="none">
          <rect x="3" y="4.5" width="14" height="12" strokeWidth="1.5" />
          <path d="M3 8.5h14M7 3v3M13 3v3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Choose a date"
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-full z-20 mt-2 w-72 border border-slate-light/60 bg-paper p-3 shadow-panel"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                className="flex h-7 w-7 items-center justify-center text-ink/70 transition-colors duration-150 hover:text-highway active:scale-[0.92]"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2]">
                  <path d="M10 3l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="font-display text-xs uppercase tracking-wideish text-ink">
                {MONTH_LABEL.format(firstOfMonth)}
              </span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                className="flex h-7 w-7 items-center justify-center text-ink/70 transition-colors duration-150 hover:text-highway active:scale-[0.92]"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2]">
                  <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="manifest-label py-1">{w}</span>
              ))}
              {cells.map((date, i) => {
                if (!date) return <span key={i} />;
                const key = toKey(date);
                const isPast = date < today;
                const isSelected = key === selectedKey;
                const isToday = key === toKey(today);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isPast}
                    onClick={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    className={[
                      "flex h-8 w-8 items-center justify-center text-sm transition-colors duration-150 active:scale-[0.94]",
                      isSelected
                        ? "bg-brass text-paper"
                        : isPast
                        ? "text-slate-light/50"
                        : isToday
                        ? "border border-brass/50 text-ink hover:bg-brass/10"
                        : "text-ink hover:bg-brass/10",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
