import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCardItem } from "./credit-card-item";
import { creditCards } from "../data/cards.mock";

/** Listado de tarjetas. `viewAllHref` muestra el enlace "Ver todas" (omitir en la página dedicada). */
export function CreditCardsList({ viewAllHref }: { viewAllHref?: string }) {
  return (
    <Card className="flex flex-col p-6">
      <CardHeader className="items-center">
        <CardTitle className="text-[15px]">Tus tarjetas</CardTitle>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-xs font-semibold text-muted transition-colors hover:text-ink"
          >
            Ver todas <ArrowRight className="size-3.5" />
          </Link>
        )}
      </CardHeader>
      <div className="mt-4 flex flex-col gap-2.5">
        {creditCards.map((card) => (
          <CreditCardItem key={card.id} card={card} />
        ))}
      </div>
    </Card>
  );
}
