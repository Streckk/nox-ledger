import { SummaryCardsGrid } from "./summary-cards-grid";
import { SavingsProjectionChart } from "./savings-projection-chart";
import { CreditCardsList } from "@/features/cards/components/credit-cards-list";
import { InstallmentsTable } from "@/features/installments/components/installments-table";
import { installmentPurchases } from "@/features/installments/data/installments.mock";

/** Vista principal del dashboard de Nox Ledger. Compone los módulos de negocio. */
export function DashboardView() {
  return (
    <div className="flex flex-col gap-3.5">
      <SummaryCardsGrid />

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        <SavingsProjectionChart />
        <CreditCardsList viewAllHref="/tarjetas" />
      </div>

      <InstallmentsTable purchases={installmentPurchases} />
    </div>
  );
}
