import type { SummaryStat } from "@/types/dashboard";
import { financialProfile } from "@/mocks/financial-dashboard.mock";

const { monthlyIncome, fixedExpenses, monthlyDebt, projectedSavings, available } =
  financialProfile;

/** Tarjetas de resumen financiero del dashboard. */
export const summaryStats: SummaryStat[] = [
  {
    id: "income",
    label: "Ingreso mensual",
    value: monthlyIncome,
    delta: "+4.2%",
    deltaNote: "vs. mayo",
    trend: "up",
  },
  {
    id: "fixed",
    label: "Gastos fijos",
    value: fixedExpenses,
    delta: "44%",
    deltaNote: "del ingreso",
    trend: "neutral",
  },
  {
    id: "debt",
    label: "Deudas del mes",
    value: monthlyDebt,
    delta: "3 tarjetas",
    trend: "neutral",
  },
  {
    id: "savings",
    label: "Ahorro proyectado",
    value: projectedSavings,
    delta: "+15%",
    deltaNote: "sobre meta",
    trend: "up",
  },
  {
    id: "available",
    label: "Dinero disponible",
    value: available,
    delta: "libre",
    deltaNote: "tras gastos",
    emphasis: true,
  },
];
