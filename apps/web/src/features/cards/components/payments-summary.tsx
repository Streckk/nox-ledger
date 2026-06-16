import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format-currency";
import type { CardTone, CreditCard } from "@/types/card";

const swatchByTone: Record<CardTone, string> = {
  dark: "from-zinc-300 to-zinc-500",
  darker: "from-zinc-300 to-zinc-500",
  light: "from-zinc-800 to-black",
};

/** Resumen de los pagos del mes por tarjeta. */
export function PaymentsSummary({ cards }: { cards: CreditCard[] }) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-base font-bold tracking-tight">
        Resumen de pagos del mes
      </h2>
      <div className="mt-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3.5 border-t border-hairline py-4"
          >
            <span
              className={cn(
                "h-6 w-8 shrink-0 rounded-[5px] bg-gradient-to-br",
                swatchByTone[card.tone],
              )}
            />
            <span className="flex-1 text-[13.5px] font-semibold">{card.name}</span>
            <span className="hidden text-xs text-muted sm:block">
              Vence {card.dueDate}
            </span>
            <span className="font-mono text-sm font-bold">
              {formatCurrency(card.monthlyPayment)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
