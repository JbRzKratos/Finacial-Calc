const _fmt = new Intl.NumberFormat("en-IN");

/**
 * Formats a number as INR with full precision for small values and abbreviated
 * suffixes for large values (K, L, C). Uses toFixed(2) for abbreviated values.
 * @param value - The numeric value to format
 * @returns Formatted string like "₹1,234" or "₹1.23L"
 */
export function formatINRFull(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 10000000) return sign + "₹" + (abs / 10000000).toFixed(2) + "C";
  if (abs >= 100000) return sign + "₹" + (abs / 100000).toFixed(2) + "L";
  if (abs >= 1000) return sign + "₹" + (abs / 1000).toFixed(2) + "K";
  return sign + "₹" + _fmt.format(Math.round(abs));
}

/**
 * Formats a number as INR with abbreviated suffixes (K, L, C) using toFixed(1).
 * Does NOT use locale grouping for small values.
 * @param amount - The numeric amount to format
 * @returns Formatted string like "₹1.2L" or "₹500"
 */
export function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 10000000) return sign + "₹" + (abs / 10000000).toFixed(1) + "C";
  if (abs >= 100000) return sign + "₹" + (abs / 100000).toFixed(1) + "L";
  if (abs >= 1000) return sign + "₹" + (abs / 1000).toFixed(1) + "K";
  return sign + "₹" + Math.round(abs);
}

/**
 * Short INR formatting. Identical to formatINR but without sign handling.
 * @param amount - The numeric amount to format
 * @returns Formatted string like "₹1.2L"
 */
export function formatINRShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}C`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}

/**
 * Formats a display value with abbreviated suffixes (C, L, K).
 * Supports negative values.
 * @param v - The numeric value to format
 * @returns Formatted string like "1.2L" or "-500"
 */
export function fmtDisplay(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 10000000) return sign + (abs / 10000000).toFixed(1) + "C";
  if (abs >= 100000) return sign + (abs / 100000).toFixed(1) + "L";
  if (abs >= 1000) return sign + (abs / 1000).toFixed(1) + "K";
  return sign + String(Math.round(abs));
}

/**
 * Formats a slider badge value based on step size.
 * Uses one decimal place for fractional steps, otherwise abbreviates.
 * @param v - The numeric value
 * @param s - The step size
 * @returns Formatted string
 */
export function fmtSliderValue(v: number, s: number): string {
  const abs = Math.abs(v);
  if (s < 1) return v.toFixed(1);
  if (abs >= 10000000) return (abs / 10000000).toFixed(1) + "C";
  if (abs >= 100000) return (abs / 100000).toFixed(1) + "L";
  if (abs >= 1000) return (abs / 1000).toFixed(1) + "K";
  return String(Math.round(abs));
}

/**
 * Parses a formatted INR string back into a numeric value.
 * Handles suffixes (Cr, L) and strips currency symbols/whitespace.
 * @param value - The formatted string like "₹1.5Cr" or "₹50,000"
 * @returns Parsed numeric value
 */
export function parseINRValue(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, "");
  if (cleaned.endsWith("Cr")) return parseFloat(cleaned) * 10000000;
  if (cleaned.endsWith("L")) return parseFloat(cleaned) * 100000;
  return parseFloat(cleaned) || 0;
}
