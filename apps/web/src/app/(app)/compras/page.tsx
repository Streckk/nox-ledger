import type { Metadata } from "next";
import { InstallmentsTable } from "@/features/installments/components/installments-table";

export const metadata: Metadata = { title: "Compras a meses — Nox Ledger" };

export default function ComprasPage() {
  return <InstallmentsTable />;
}
