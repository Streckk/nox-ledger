import { formatCurrency } from "@/lib/format-currency";
import type { CreditCard } from "@/types/card";

/** Fila compacta de tarjeta para listados (dashboard). */
export function CreditCardItem({ card }: { card: CreditCard }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-hairline bg-elevated px-3.5 py-3">
      <span className="h-[26px] w-[38px] shrink-0 rounded-[5px] bg-gradient-to-br from-zinc-500 to-zinc-900" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">{card.name}</p>
        <p className="text-[11px] text-muted">
          Corte {card.statementDate} · Límite {card.dueDate}
        </p>
      </div>
      <div className="text-right">
        <p className="font-mono text-[13.5px] font-bold">
          {formatCurrency(card.monthlyPayment)}
        </p>
        <p className="text-[10.5px] text-muted">a pagar</p>
      </div>
    </div>
  );
}
