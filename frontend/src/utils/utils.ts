export const formatCurrency = (value: number | string | undefined | null) =>
  `$${Number(value ?? 0).toFixed(2)}`;

export const formatShortDate = (value: string | undefined | null) =>
  value ? String(value).slice(0, 10) : 'N/A';
