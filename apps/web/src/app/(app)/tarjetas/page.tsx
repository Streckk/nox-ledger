import type { Metadata } from "next";
import { CreditCardsList } from "@/features/cards/components/credit-cards-list";

export const metadata: Metadata = { title: "Tarjetas — Nox Ledger" };

export default function TarjetasPage() {
  return (
    <div className="max-w-2xl">
      <CreditCardsList />
    </div>
  );
}
