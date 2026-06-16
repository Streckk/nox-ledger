import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format-currency";
import type { CardTone, CreditCard } from "@/types/card";

/** Colores fijos de cada tarjeta (independientes del tema: son tarjetas "físicas"). */
const toneStyles: Record<
  CardTone,
  { card: string; sub: string; chip: string }
> = {
  dark: {
    card: "border-white/10 bg-[linear-gradient(150deg,#1c1c22,#0d0d10)] text-white",
    sub: "text-white/55",
    chip: "border-white/10 from-zinc-300 to-zinc-500",
  },
  darker: {
    card: "border-white/10 bg-[linear-gradient(150deg,#16161a,#0a0a0c)] text-white",
    sub: "text-white/55",
    chip: "border-white/10 from-zinc-300 to-zinc-500",
  },
  light: {
    card: "border-black/10 bg-[linear-gradient(150deg,#f4f4f5,#dcdce0)] text-zinc-950",
    sub: "text-zinc-500",
    chip: "border-black/10 from-zinc-800 to-black",
  },
};

function Detail({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className={cn("text-[10.5px] font-bold uppercase tracking-wide", sub)}>
        {label}
      </p>
      <p className="mt-1 text-[13px] font-bold">{value}</p>
    </div>
  );
}

/** Tarjeta de crédito con degradado, chip y datos de corte/pago. */
export function CreditCardVisual({ card }: { card: CreditCard }) {
  const tone = toneStyles[card.tone];

  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col justify-between rounded-2xl border p-6",
        tone.card,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[17px] font-extrabold tracking-tight">{card.name}</p>
          <p className={cn("mt-0.5 text-[11.5px]", tone.sub)}>{card.bank}</p>
        </div>
        <span
          className={cn(
            "h-7 w-10 rounded-md border bg-gradient-to-br",
            tone.chip,
          )}
        />
      </div>

      <p className="font-mono text-[15px] tracking-[0.2em]">•••• {card.last4}</p>

      <div className="flex items-end gap-6">
        <Detail label="Corte" value={card.statementDate} sub={tone.sub} />
        <Detail label="Límite pago" value={card.dueDate} sub={tone.sub} />
        <div className="ml-auto text-right">
          <p className={cn("text-[10.5px] font-bold uppercase tracking-wide", tone.sub)}>
            Pago mes
          </p>
          <p className="mt-1 font-mono text-[15px] font-bold">
            {formatCurrency(card.monthlyPayment)}
          </p>
        </div>
      </div>
    </div>
  );
}
