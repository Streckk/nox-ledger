import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format-currency";
import type { SummaryStat } from "@/types/dashboard";

export function SummaryCard({ stat }: { stat: SummaryStat }) {
  const emphasis = stat.emphasis;

  return (
    <div
      className={cn(
        "flex min-h-[124px] flex-col rounded-2xl p-[18px]",
        emphasis
          ? "bg-invert text-invert-ink"
          : "border border-hairline bg-surface",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-semibold tracking-tight",
            emphasis ? "text-invert-muted" : "text-muted",
          )}
        >
          {stat.label}
        </span>
        {stat.trend === "up" && (
          <ArrowUpRight
            className={cn("size-3.5", emphasis ? "text-invert-muted" : "text-positive")}
          />
        )}
      </div>

      <span className="mt-3.5 font-mono text-[23px] font-bold tracking-tighter">
        {formatCurrency(stat.value)}
      </span>

      {(stat.delta || stat.deltaNote) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px]">
          {stat.delta && (
            <span
              className={cn(
                "font-bold",
                emphasis
                  ? "text-invert-ink"
                  : stat.trend === "up"
                    ? "text-positive"
                    : "text-ink",
              )}
            >
              {stat.delta}
            </span>
          )}
          {stat.deltaNote && (
            <span className={emphasis ? "text-invert-muted" : "text-muted"}>
              {stat.deltaNote}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
