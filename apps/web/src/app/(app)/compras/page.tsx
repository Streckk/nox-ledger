import type { Metadata } from "next";
import { InstallmentsView } from "@/features/installments/components/installments-view";

export const metadata: Metadata = { title: "Compras a meses — Nox Ledger" };

export default function ComprasPage() {
  return <InstallmentsView />;
}
