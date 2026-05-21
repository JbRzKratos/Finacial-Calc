export function formatINRFull(value: number): string {
  if (value >= 10000000) return "₹" + (value / 10000000).toFixed(2) + " Cr";
  if (value >= 100000) return "₹" + (value / 100000).toFixed(2) + " L";
  return "₹" + Math.round(value).toLocaleString("en-IN");
}
