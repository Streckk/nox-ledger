import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Configuración — Nox Ledger" };

export default function ConfiguracionPage() {
  return (
    <SectionPlaceholder
      icon={Settings}
      title="Configuración"
      description="Datos de tu cuenta, preferencias de moneda, tema y notificaciones. Próximamente."
    />
  );
}
