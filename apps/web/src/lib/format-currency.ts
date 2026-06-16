import type { Money } from "@/types/finance";

const mxnInteger = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const mxnDecimal = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formatea un monto en pesos mexicanos. Por defecto sin decimales. */
export function formatCurrency(value: Money, options?: { decimals?: boolean }): string {
  const formatter = options?.decimals ? mxnDecimal : mxnInteger;
  return formatter.format(Number.isFinite(value) ? value : 0);
}

/** Formatea un monto con signo explícito (+/−), útil para márgenes. */
export function formatSignedCurrency(value: Money): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${formatCurrency(Math.abs(value))}`;
}
