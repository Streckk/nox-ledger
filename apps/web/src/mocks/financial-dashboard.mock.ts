import type { FinancialProfile, ProjectionPoint } from "@/types/dashboard";

const monthlyIncome = 42000;
const fixedExpenses = 18500;
const monthlyDebt = 6450;

/** Perfil financiero base del usuario para el periodo actual (datos mockeados). */
export const financialProfile: FinancialProfile = {
  monthlyIncome,
  fixedExpenses,
  monthlyDebt,
  savingsGoal: 8000,
  projectedSavings: 9200,
  available: monthlyIncome - fixedExpenses - monthlyDebt,
};

/** Serie de proyección de ahorro: real vs. objetivo acumulado. */
export const savingsProjection: ProjectionPoint[] = [
  { month: "Ene", real: 1700, target: 1500 },
  { month: "Feb", real: 3100, target: 3000 },
  { month: "Mar", real: 4600, target: 4500 },
  { month: "Abr", real: 6000, target: 6000 },
  { month: "May", real: 7600, target: 7500 },
  { month: "Jun", real: 9200, target: 9000 },
];

/** Usuario actual (mock, sin autenticación todavía). */
export const currentUser = {
  name: "Diego Rivas",
  email: "diego.rivas@noxledger.mx",
};
