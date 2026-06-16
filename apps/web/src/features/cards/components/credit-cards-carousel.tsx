"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditCardVisual } from "./credit-card-visual";
import type { CreditCard } from "@/types/card";

interface CreditCardsCarouselProps {
  cards: CreditCard[];
  onAddCard: () => void;
}

/** Ancho de cada slide (px) + separación, para el desplazamiento por índice. */
const CARD_WIDTH = 300;
const GAP = 14;
const STEP = CARD_WIDTH + GAP;

/** Carrusel de tarjetas con flechas laterales: avanza de derecha a izquierda. */
export function CreditCardsCarousel({ cards, onAddCard }: CreditCardsCarouselProps) {
  const [index, setIndex] = useState(0);

  // Slides = tarjetas + tile "Agregar"; último índice navegable.
  const lastIndex = cards.length;
  const clamp = (value: number) => Math.max(0, Math.min(value, lastIndex));
  const go = (direction: 1 | -1) => setIndex((current) => clamp(current + direction));

  const safeIndex = Math.min(index, lastIndex);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight">Tus tarjetas</h2>
          <span className="rounded-full bg-elevated px-2 py-0.5 text-[11px] font-bold text-muted">
            {cards.length}
          </span>
        </div>

        <Button size="pill" onClick={onAddCard}>
          <Plus className="size-4" />
          <span className="hidden sm:inline">Agregar tarjeta</span>
          <span className="sm:hidden">Agregar</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Flecha izquierda, fuera de las tarjetas */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={() => go(-1)}
          disabled={safeIndex === 0}
          aria-label="Tarjeta anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex gap-3.5 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${safeIndex * STEP}px)` }}
          >
            {cards.map((card) => (
              <div key={card.id} className="w-[300px] shrink-0">
                <CreditCardVisual card={card} />
              </div>
            ))}

            {/* Tile para agregar */}
            <button
              type="button"
              onClick={onAddCard}
              className="flex min-h-[200px] w-[300px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline-strong bg-elevated text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-hairline bg-surface">
                <Plus className="size-5" />
              </span>
              <span className="text-sm font-semibold">Agregar tarjeta</span>
            </button>
          </div>
        </div>

        {/* Flecha derecha, fuera de las tarjetas */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={() => go(1)}
          disabled={safeIndex === lastIndex}
          aria-label="Tarjeta siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
