import type { Money } from "./finance";

/** Estado de una compra a meses. */
export type InstallmentStatus = "on-track" | "last-month";

/** Compra a meses sin intereses (MSI). */
export interface InstallmentPurchase {
  id: string;
  /** Concepto de la compra, p. ej. "MacBook Air M3". */
  concept: string;
  /** Emoji/icono representativo del producto. */
  icon: string;
  /** Fecha de compra en ISO (YYYY-MM-DD). */
  purchasedAt: string;
  /** Monto total financiado. */
  total: Money;
  /** Mensualidad. */
  monthly: Money;
  /** Meses restantes por pagar. */
  remainingMonths: number;
  /** Plazo total en meses. */
  termMonths: number;
  /** Nombre de la tarjeta usada. */
  cardName: string;
  status: InstallmentStatus;
}
