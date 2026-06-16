"use client";

import { useState } from "react";
import type { CreditCard } from "@/types/card";
import { creditCards } from "../data/cards.mock";
import { CreditCardsCarousel } from "./credit-cards-carousel";
import { PaymentsSummary } from "./payments-summary";
import { AddCardModal } from "./add-card-modal";

/** Vista de la sección Tarjetas: carrusel + resumen de pagos + alta de tarjetas. */
export function CardsView() {
  const [cards, setCards] = useState<CreditCard[]>(creditCards);
  const [addOpen, setAddOpen] = useState(false);

  const addCard = (card: CreditCard) => setCards((prev) => [...prev, card]);

  return (
    <div className="flex flex-col gap-5">
      <CreditCardsCarousel cards={cards} onAddCard={() => setAddOpen(true)} />
      <PaymentsSummary cards={cards} />
      <AddCardModal open={addOpen} onOpenChange={setAddOpen} onAdd={addCard} />
    </div>
  );
}
