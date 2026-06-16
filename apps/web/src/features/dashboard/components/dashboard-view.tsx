import { SummaryCardsGrid } from "./summary-cards-grid";
import { SavingsProjectionChart } from "./savings-projection-chart";
import { CreditCardsList } from "@/features/cards/components/credit-cards-list";
import { InstallmentsTable } from "@/features/installments/components/installments-table";
import { PurchaseSimulatorCard } from "@/features/purchase-simulator/components/purchase-simulator-card";

/** Vista principal del dashboard de Nox Ledger. Compone los módulos de negocio. */
export function DashboardView() {
  return (
    <div className="flex flex-col gap-3.5">
      <SummaryCardsGrid />

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        <SavingsProjectionChart />
        <CreditCardsList />
      </div>

      <InstallmentsTable />

      <section className="mt-2">
        <div className="mb-3.5 flex items-center gap-2">
          <h2 className="text-lg font-extrabold tracking-tight">
            ¿Puedo comprar esto?
          </h2>
          <span className="rounded-full bg-elevated px-2.5 py-1 text-[11px] font-bold text-muted">
            Simulador
          </span>
        </div>
        <PurchaseSimulatorCard />
      </section>
    </div>
  );
}
