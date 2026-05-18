export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '- ' : '';

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${sign}₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    const l = abs / 100000;
    return `${sign}₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(2)} L`;
  }

  const numStr = Math.round(abs).toString();
  const lastThree = numStr.slice(-3);
  const rest = numStr.slice(0, -3);
  let formatted = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
  return `${sign}₹${formatted}`;
}

export function formatINRFull(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const abs = Math.round(Math.abs(amount));
  const sign = amount < 0 ? '▼ ' : '▲ ';

  if (abs >= 1e11) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;

  if (abs === 0) return '₹0';

  const numStr = abs.toString();
  const lastThree = numStr.slice(-3);
  const rest = numStr.slice(0, -3);
  let formatted = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;

  return `${sign}₹${formatted}`;
}

export function formatPercent(value) {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${value.toFixed(2)}%`;
}

export function formatShort(value) {
  if (value === undefined || value === null || isNaN(value)) return '0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '- ' : '';

  if (abs >= 10000000) return `${sign}${(abs / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `${sign}${(abs / 100000).toFixed(2)}L`;
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}K`;
  return `${sign}${Math.round(abs)}`;
}

export function formatYear(year) {
  if (year === 0) return 'Now';
  if (year === 1) return 'Year 1';
  return `Year ${year}`;
}
