import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import type { InstallmentPurchase } from "@/types/installment";
import { installmentPurchases } from "../data/installments.mock";

function StatusBadge({ status }: { status: InstallmentPurchase["status"] }) {
  if (status === "last-month") {
    return <Badge variant="solid">Último mes</Badge>;
  }
  return <Badge variant="neutral">Al corriente</Badge>;
}

export function InstallmentsTable() {
  const monthlyCommitted = installmentPurchases.reduce(
    (sum, item) => sum + item.monthly,
    0,
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
        <div>
          <h2 className="text-base font-bold tracking-tight">
            Compras a meses sin intereses
          </h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {installmentPurchases.length} compras activas ·{" "}
            {formatCurrency(monthlyCommitted)} comprometido al mes
          </p>
        </div>
      </div>

      <div className="nx-scroll overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-muted">
              <th className="px-6 py-3.5 font-bold">Compra</th>
              <th className="px-6 py-3.5 font-bold">Monto total</th>
              <th className="px-6 py-3.5 font-bold">Mensualidad</th>
              <th className="px-6 py-3.5 font-bold">Restan</th>
              <th className="px-6 py-3.5 font-bold">Tarjeta</th>
              <th className="px-6 py-3.5 text-right font-bold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {installmentPurchases.map((item) => (
              <tr
                key={item.id}
                className="border-t border-hairline transition-colors hover:bg-ink/[0.03]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] border border-hairline bg-elevated text-[15px]">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold">
                        {item.concept}
                      </p>
                      <p className="text-[11px] text-muted">
                        Comprada {formatDate(item.purchasedAt)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-[13px] text-muted">
                  {formatCurrency(item.total)}
                </td>
                <td className="px-6 py-4 font-mono text-[13px] font-bold">
                  {formatCurrency(item.monthly)}
                </td>
                <td className="px-6 py-4 text-[13px] text-muted">
                  {item.remainingMonths} / {item.termMonths}
                </td>
                <td className="px-6 py-4 text-[12.5px] text-muted">
                  {item.cardName}
                </td>
                <td className="px-6 py-4 text-right">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
