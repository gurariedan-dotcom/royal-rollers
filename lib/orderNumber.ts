// Formats the short sequential order_number (db/migrations/005) as the
// customer/owner-facing reference used in emails and admin pages. Kept as
// the one place this format lives so a future "track my order" project can
// match it exactly.
export function formatOrderNumber(orderNumber: number): string {
  return `RR-${orderNumber}`;
}
