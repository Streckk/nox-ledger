"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { useHydrated } from "@/lib/use-hydrated";
import { savingsProjection } from "@/mocks/financial-dashboard.mock";
import type { ProjectionPoint } from "@/types/dashboard";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: ProjectionPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-hairline-strong bg-surface px-3 py-2 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-bold text-ink">
        {formatCurrency(point.real)}
      </p>
      <p className="font-mono text-[11px] text-muted">
        objetivo {formatCurrency(point.target)}
      </p>
    </div>
  );
}

export function SavingsProjectionChart() {
  const hydrated = useHydrated();

  return (
    <Card className="p-6">
      <CardHeader>
        <div>
          <CardTitle>Proyección de ahorro</CardTitle>
          <CardDescription>Acumulado · objetivo vs. real</CardDescription>
        </div>
        <div className="flex gap-4 text-[11.5px]">
          <span className="flex items-center gap-1.5 text-ink">
            <span className="h-0.5 w-3.5 rounded bg-ink" />
            Real
          </span>
          <span className="flex items-center gap-1.5 text-muted">
            <span className="w-3.5 border-t-2 border-dashed border-faint" />
            Objetivo
          </span>
        </div>
      </CardHeader>

      <div className="mt-4 h-[230px] w-full">
        {hydrated && (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={savingsProjection}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
          >
            <defs>
              <linearGradient id="nxSavingsArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--ink)" stopOpacity={0.16} />
                <stop offset="100%" stopColor="var(--ink)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--hairline)"
              strokeWidth={1}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11.5, fontFamily: "var(--font-space-mono)" }}
              dy={8}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--hairline-strong)" }} />
            <Area
              type="monotone"
              dataKey="real"
              stroke="none"
              fill="url(#nxSavingsArea)"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="var(--faint)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="real"
              stroke="var(--ink)"
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 4.5, fill: "var(--ink)" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
