import type { Metadata } from "next";
import { PurchaseSimulatorCard } from "@/features/purchase-simulator/components/purchase-simulator-card";

export const metadata: Metadata = { title: "Simulador de compra — Nox Ledger" };

export default function SimuladorPage() {
  return <PurchaseSimulatorCard />;
}
