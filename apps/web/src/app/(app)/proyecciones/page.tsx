import type { Metadata } from "next";
import { LineChart } from "lucide-react";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Proyecciones — Nox Ledger" };

export default function ProyeccionesPage() {
  return (
    <SectionPlaceholder
      icon={LineChart}
      title="Proyecciones"
      description="Escenarios de ahorro a futuro según tus ingresos, gastos y compras a meses. Próximamente."
    />
  );
}
