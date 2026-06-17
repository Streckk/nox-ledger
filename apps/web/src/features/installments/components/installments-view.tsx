"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { InstallmentPurchase } from "@/types/installment";
import { installmentPurchases } from "../data/installments.mock";
import { InstallmentsTable } from "./installments-table";

interface FilterDef {
  id: string;
  label: string;
  match: (purchase: InstallmentPurchase) => boolean;
}

const FILTERS: FilterDef[] = [
  { id: "todas", label: "Todas", match: () => true },
  {
    id: "por-pagar",
    label: "Por pagar",
    match: (p) => p.status === "al-corriente" || p.status === "ultimo-mes",
  },
  { id: "ultimo-mes", label: "Último mes", match: (p) => p.status === "ultimo-mes" },
  { id: "atrasadas", label: "Atrasadas", match: (p) => p.status === "atrasada" },
  { id: "pagadas", label: "Pagadas", match: (p) => p.status === "pagada" },
];

export function InstallmentsView() {
  const [activeId, setActiveId] = useState("todas");

  // Conteo por filtro (sobre el total de compras).
  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((filter) => [
          filter.id,
          installmentPurchases.filter(filter.match).length,
        ]),
      ),
    [],
  );

  const activeFilter = FILTERS.find((f) => f.id === activeId) ?? FILTERS[0];
  const filtered = useMemo(
    () => installmentPurchases.filter(activeFilter.match),
    [activeFilter],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.id === activeId;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveId(filter.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors",
                active
                  ? "border-invert bg-invert text-invert-ink"
                  : "border-hairline-strong bg-surface text-muted hover:text-ink",
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-bold tabular-nums",
                  active ? "bg-invert-ink/20 text-invert-ink" : "bg-elevated text-muted",
                )}
              >
                {counts[filter.id]}
              </span>
            </button>
          );
        })}
      </div>

      <InstallmentsTable purchases={filtered} />
    </div>
  );
}
