import type { Money, Trend } from "./finance";

/** Tarjeta de resumen financiero del dashboard. */
export interface SummaryStat {
  id: string;
  label: string;
  value: Money;
  /** Texto de variación, p. ej. "+4.2%". */
  delta?: string;
  /** Nota corta junto al delta, p. ej. "vs. mayo". */
  deltaNote?: string;
  trend?: Trend;
  /** Si true, se pinta como tarjeta destacada (invertida). */
  emphasis?: boolean;
}

/** Punto de la serie de proyección de ahorro. */
export interface ProjectionPoint {
  month: string;
  /** Ahorro real acumulado. */
  real: Money;
  /** Objetivo acumulado. */
  target: Money;
}

/** Perfil financiero base del usuario para el periodo actual. */
export interface FinancialProfile {
  monthlyIncome: Money;
  fixedExpenses: Money;
  monthlyDebt: Money;
  savingsGoal: Money;
  projectedSavings: Money;
  /** Dinero disponible tras gastos fijos y deudas. */
  available: Money;
}
