"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Sparkles, X } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { formatCurrency, formatSignedCurrency } from "@/lib/format-currency";
import { SIMULATOR_TERMS } from "@/lib/constants";
import { financialProfile } from "@/mocks/financial-dashboard.mock";
import { creditCards } from "@/features/cards/data/cards.mock";
import {
  purchaseSimulatorSchema,
  type PurchaseSimulatorValues,
} from "../schemas/purchase-simulator.schema";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** Caja métrica del panel de resultados. */
function Metric({
  label,
  value,
  note,
  valueClassName,
}: {
  label: string;
  value: string;
  note: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-[13px] border border-hairline bg-elevated p-4">
      <p className="text-[11px] font-semibold text-muted">{label}</p>
      <p
        className={cn(
          "mt-2 font-mono text-[19px] font-bold tracking-tighter",
          valueClassName,
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">{note}</p>
    </div>
  );
}

export function PurchaseSimulatorCard() {
  const { available, savingsGoal } = financialProfile;

  const { register, control, setValue } = useForm<PurchaseSimulatorValues>({
    resolver: zodResolver(purchaseSimulatorSchema),
    mode: "onChange",
    defaultValues: { concept: "", price: 12990, months: 6, cardId: creditCards[0].id },
  });

  const price = Number(useWatch({ control, name: "price" })) || 0;
  const months = Number(useWatch({ control, name: "months" })) || 1;
  const cardId = useWatch({ control, name: "cardId" });

  const result = useMemo(() => {
    const monthly = months > 0 ? price / months : 0;
    const availableAfter = available - monthly;
    const ok = availableAfter >= savingsGoal;
    const margin = availableAfter - savingsGoal;
    const pctConsumed = available > 0 ? clamp(Math.round((monthly / available) * 100), 0, 100) : 100;
    const barAfterPct = available > 0 ? clamp(Math.round((availableAfter / available) * 100), 0, 100) : 0;
    const metaPct = available > 0 ? clamp(Math.round((savingsGoal / available) * 100), 0, 100) : 0;

    let minTermOk: number | null = null;
    for (let t = 1; t <= 36; t += 1) {
      if (available - price / t >= savingsGoal) {
        minTermOk = t;
        break;
      }
    }

    const score =
      available <= 0
        ? 0
        : Math.round(
            clamp(
              (availableAfter / Math.max(savingsGoal, 1)) * 70 +
                (1 - pctConsumed / 100) * 30,
              0,
              100,
            ),
          );
    const healthLabel = score >= 75 ? "Saludable" : score >= 45 ? "Ajustada" : "Riesgosa";
    const healthTip =
      score >= 75
        ? "Esta compra encaja bien: mantienes tu meta y conservas margen para imprevistos."
        : score >= 45
          ? "Es viable pero apretada. Considera un plazo mayor o esperar al siguiente corte."
          : "Esta compra compromete demasiado tu disponible. Alarga el plazo o pospónla.";

    return {
      monthly,
      availableAfter,
      ok,
      margin,
      pctConsumed,
      barAfterPct,
      metaPct,
      minTermOk,
      score,
      healthLabel,
      healthTip,
    };
  }, [price, months, available, savingsGoal]);

  const recommendedCard = useMemo(
    () => [...creditCards].sort((a, b) => b.floatDays - a.floatDays)[0],
    [],
  );

  return (
    <section className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* ===== Panel de entrada ===== */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" />
            <CardTitle className="text-[17px]">Datos de la compra</CardTitle>
          </div>
          <CardDescription>Todo se recalcula al instante.</CardDescription>

          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                ¿Qué quieres comprar?
              </span>
              <Input
                className="mt-2"
                placeholder="Ej. Laptop nueva"
                {...register("concept")}
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                Precio
              </span>
              <div className="mt-2 flex items-center rounded-xl border border-hairline-strong bg-elevated px-3.5 focus-within:border-ink">
                <span className="font-mono text-lg font-bold text-faint">$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full bg-transparent px-2 py-3 font-mono text-[22px] font-bold text-ink outline-none"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
            </label>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Plazo
                </span>
                <span className="font-mono text-sm font-bold">{months} meses</span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                className="nx-range mt-3 w-full"
                {...register("months", { valueAsNumber: true })}
              />
              <div className="mt-1.5 flex justify-between font-mono text-[10.5px] text-faint">
                <span>1m</span>
                <span>12m</span>
                <span>24m</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                Tarjeta a usar
              </span>
              <div className="mt-2.5 flex flex-col gap-2">
                {creditCards.map((card) => {
                  const selected = card.id === cardId;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setValue("cardId", card.id, { shouldValidate: true })}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                        selected
                          ? "border-invert bg-invert text-invert-ink"
                          : "border-hairline bg-elevated text-ink hover:border-hairline-strong",
                      )}
                    >
                      <span className="h-[23px] w-[34px] shrink-0 rounded-[5px] bg-gradient-to-br from-zinc-500 to-zinc-900" />
                      <span className="flex-1">
                        <span className="block text-[13.5px] font-bold">{card.name}</span>
                        <span
                          className={cn(
                            "block text-[11px]",
                            selected ? "text-invert-muted" : "text-muted",
                          )}
                        >
                          {card.bank}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex size-[17px] items-center justify-center rounded-full border-2",
                          selected ? "border-invert-ink" : "border-faint",
                        )}
                      >
                        {selected && (
                          <span className="size-[7px] rounded-full bg-invert-ink" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* ===== Resultados ===== */}
        <div className="flex flex-col gap-3.5">
          <Card className="p-6">
            <div
              className={cn(
                "flex items-center gap-3.5 rounded-2xl p-5",
                result.ok
                  ? "bg-invert text-invert-ink"
                  : "border-[1.5px] border-ink bg-elevated text-ink",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  result.ok ? "bg-invert-ink text-invert" : "bg-ink text-canvas",
                )}
              >
                {result.ok ? <Check className="size-5" /> : <X className="size-5" />}
              </span>
              <div>
                <p className="text-[17px] font-extrabold tracking-tight">
                  {result.ok ? "Sí puedes comprarlo" : "No es recomendable este mes"}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[12.5px]",
                    result.ok ? "text-invert-muted" : "text-muted",
                  )}
                >
                  {result.ok
                    ? `Te quedan ${formatCurrency(result.availableAfter)} y mantienes tu meta de ${formatCurrency(savingsGoal)}`
                    : `Bajarías a ${formatCurrency(result.availableAfter)}, por debajo de tu meta de ${formatCurrency(savingsGoal)}`}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Metric
                label="Mensualidad"
                value={formatCurrency(result.monthly)}
                note={`por ${months} meses`}
              />
              <Metric
                label="Disponible después"
                value={formatCurrency(result.availableAfter)}
                note={`era ${formatCurrency(available)}`}
              />
              <Metric
                label="Margen vs meta"
                value={formatSignedCurrency(result.margin)}
                note={result.margin >= 0 ? "sobre tu meta" : "bajo tu meta"}
                valueClassName={result.margin >= 0 ? "text-positive" : "text-negative"}
              />
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader className="items-center">
              <CardTitle className="text-[15px]">
                Impacto en tu dinero disponible
              </CardTitle>
              <span className="font-mono text-xs text-muted">
                {result.pctConsumed}% comprometido
              </span>
            </CardHeader>

            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted">Disponible hoy</span>
                  <span className="font-mono font-bold">{formatCurrency(available)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full w-full rounded-full bg-ink/25" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted">Tras esta compra</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(result.availableAfter)}
                  </span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-ink transition-all"
                    style={{ width: `${result.barAfterPct}%` }}
                  />
                </div>
                <div className="relative h-0">
                  <span
                    className="absolute -top-3 h-3 w-px bg-muted"
                    style={{ left: `${result.metaPct}%` }}
                  />
                </div>
                <p className="mt-1.5 font-mono text-[10.5px] text-muted">
                  ▏ meta de ahorro {formatCurrency(savingsGoal)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ===== Compara plazos ===== */}
      <Card className="p-6">
        <CardHeader>
          <div>
            <CardTitle className="text-[15px]">Compara plazos</CardTitle>
            <CardDescription>
              {result.minTermOk
                ? `Difiere a ${result.minTermOk} ${result.minTermOk === 1 ? "mes" : "meses"} o más para no tocar tu meta de ahorro.`
                : "Incluso a 36 meses esta compra rebasa tu meta este mes."}
            </CardDescription>
          </div>
        </CardHeader>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {SIMULATOR_TERMS.map((term) => {
            const monthly = price / term;
            const keepsGoal = available - monthly >= savingsGoal;
            const selected = term === months;
            return (
              <button
                key={term}
                type="button"
                onClick={() => setValue("months", term, { shouldValidate: true })}
                className={cn(
                  "rounded-[13px] border bg-elevated p-4 text-left transition-colors",
                  selected ? "border-ink" : "border-hairline hover:border-hairline-strong",
                )}
              >
                <p className="text-lg font-extrabold tracking-tight">{term}m</p>
                <p className="mt-1.5 font-mono text-[13px] font-bold">
                  {formatCurrency(monthly)}/m
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-[7px] shrink-0 rounded-full",
                      keepsGoal ? "bg-positive" : "bg-faint",
                    )}
                  />
                  <span className="text-[11px] text-muted">
                    {keepsGoal ? "Mantiene meta" : "Afecta meta"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ===== Mejor tarjeta + Salud ===== */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <Card className="p-6">
          <CardTitle className="text-[15px]">
            Mejor tarjeta para diferir el pago
          </CardTitle>
          <div className="mt-4 flex items-center gap-3.5 rounded-[13px] border border-hairline bg-elevated p-4">
            <span className="h-[31px] w-[46px] shrink-0 rounded-md bg-gradient-to-br from-zinc-500 to-zinc-900" />
            <div className="flex-1">
              <p className="text-sm font-bold">{recommendedCard.name}</p>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Corte {recommendedCard.statementDate} · pagas hasta{" "}
                {recommendedCard.dueDate}
              </p>
            </div>
            <span className="rounded-full bg-invert px-2.5 py-1.5 text-[11px] font-bold text-invert-ink">
              +{recommendedCard.floatDays} días
            </span>
          </div>
          <p className="mt-3.5 text-[12.5px] leading-relaxed text-muted">
            Comprando justo después del corte ganas el máximo de días sin
            intereses antes de tu fecha límite de pago.
          </p>
        </Card>

        <Card className="p-6">
          <CardTitle className="text-[15px]">Salud de la compra</CardTitle>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-mono text-[34px] font-bold tracking-tighter">
              {result.score}
            </span>
            <span className="text-[13px] text-muted">
              / 100 · {result.healthLabel}
            </span>
          </div>
          <div className="mt-3.5 h-2.5 overflow-hidden rounded-full bg-ink/10">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                result.score >= 75
                  ? "bg-positive"
                  : result.score >= 45
                    ? "bg-ink"
                    : "bg-negative",
              )}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <p className="mt-3.5 text-[12.5px] leading-relaxed text-muted">
            {result.healthTip}
          </p>
        </Card>
      </div>
    </section>
  );
}
