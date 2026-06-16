import type { Metadata } from "next";
import { CardsView } from "@/features/cards/components/cards-view";

export const metadata: Metadata = { title: "Tarjetas — Nox Ledger" };

export default function TarjetasPage() {
  return <CardsView />;
}
