export function formatOrderNumber(orderNumber: number): string {
  return `RR-${String(orderNumber).padStart(4, "0")}`;
}
