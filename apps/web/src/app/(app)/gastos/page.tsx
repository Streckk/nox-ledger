import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Gastos fijos — Nox Ledger" };

export default function GastosPage() {
  return (
    <SectionPlaceholder
      icon={Receipt}
      title="Gastos fijos"
      description="Administra tus gastos recurrentes mensuales y su impacto en tu disponible. Próximamente."
    />
  );
}
