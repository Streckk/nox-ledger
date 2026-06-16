import type { CardNetwork, Money } from "./finance";

/** Tono visual del gradiente de la tarjeta en la UI. */
export type CardTone = "dark" | "darker" | "light";

/** Tarjeta de crédito del usuario. */
export interface CreditCard {
  id: string;
  /** Nombre comercial, p. ej. "Nu Bank". */
  name: string;
  /** Banco / producto, p. ej. "Crédito · Mastercard". */
  bank: string;
  network: CardNetwork;
  /** Últimos 4 dígitos. */
  last4: string;
  /** Fecha de corte legible, p. ej. "15 jun". */
  statementDate: string;
  /** Fecha límite de pago legible, p. ej. "02 jul". */
  dueDate: string;
  /** Pago a realizar este mes. */
  monthlyPayment: Money;
  /** Días de financiamiento sin intereses si compras justo tras el corte. */
  floatDays: number;
  tone: CardTone;
}
