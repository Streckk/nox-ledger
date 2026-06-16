import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Ingresos — Nox Ledger" };

export default function IngresosPage() {
  return (
    <SectionPlaceholder
      icon={TrendingUp}
      title="Ingresos"
      description="Aquí registrarás tus fuentes de ingreso y verás su evolución. Próximamente."
    />
  );
}
