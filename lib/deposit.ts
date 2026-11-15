// Flat booking deposit (owner decision, 2026-11-15): $500, replacing the
// old percentage-of-quote deposit. Override with DEPOSIT_CENTS if it ever
// changes. Never charge more than the quote itself.
const parsed = Number(process.env.DEPOSIT_CENTS);
export const DEPOSIT_CENTS = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 50000;

export const DEPOSIT_DISPLAY = `$${(DEPOSIT_CENTS / 100).toLocaleString("en-US")}`;

export function depositFor(totalCents: number): number {
  return Math.min(DEPOSIT_CENTS, totalCents);
}
