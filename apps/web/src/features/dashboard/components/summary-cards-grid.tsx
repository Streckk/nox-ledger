import { SummaryCard } from "./summary-card";
import { summaryStats } from "../data/dashboard.mock";

export function SummaryCardsGrid() {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {summaryStats.map((stat) => (
        <SummaryCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
