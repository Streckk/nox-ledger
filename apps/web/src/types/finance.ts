/** Tipos base compartidos del dominio financiero de Nox Ledger. */

/** Monto monetario expresado en la unidad principal de la moneda (p. ej. pesos). */
export type Money = number;

/** Códigos de moneda soportados por la app. */
export type CurrencyCode = "MXN" | "USD" | "EUR" | "COP";

/** Dirección de una variación respecto a un periodo anterior o una meta. */
export type Trend = "up" | "down" | "neutral";

/** Red de la tarjeta de crédito. */
export type CardNetwork = "Visa" | "Mastercard" | "Amex";
