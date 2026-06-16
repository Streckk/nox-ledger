import { z } from "zod";

/** Esquema del formulario del simulador "¿Puedo comprar esto?". */
export const purchaseSimulatorSchema = z.object({
  concept: z.string().trim().max(60, "Máximo 60 caracteres").optional(),
  // price/months llegan como número desde el form (register con valueAsNumber).
  price: z
    .number({ message: "Ingresa un precio válido" })
    .min(1, "El precio debe ser mayor a 0")
    .max(1_000_000, "Precio fuera de rango"),
  months: z.number().int().min(1).max(24),
  cardId: z.string().min(1, "Selecciona una tarjeta"),
});

export type PurchaseSimulatorValues = z.infer<typeof purchaseSimulatorSchema>;
