export function formatINR(value: number): string {
  return "₹" + Math.round(value).toLocaleString("en-IN");
}

export function formatINRFull(value: number): string {
  if (value >= 10000000) return "₹" + (value / 10000000).toFixed(2) + " Cr";
  if (value >= 100000) return "₹" + (value / 100000).toFixed(2) + " L";
  return "₹" + Math.round(value).toLocaleString("en-IN");
}

export function formatPercent(value: number): string {
  return value.toFixed(2) + "%";
}

export function formatYears(value: number): string {
  return value + (value === 1 ? " yr" : " yrs");
}
