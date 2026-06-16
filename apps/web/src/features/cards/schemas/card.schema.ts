import { z } from "zod";

/** Esquema del formulario para agregar una tarjeta. */
export const addCardSchema = z.object({
  name: z.string().trim().min(2, "Ingresa el nombre de la tarjeta"),
  network: z.enum(["Visa", "Mastercard", "Amex"]),
  last4: z.string().regex(/^\d{4}$/, "Deben ser 4 dígitos"),
  statementDate: z.string().trim().min(1, "Indica la fecha de corte"),
  dueDate: z.string().trim().min(1, "Indica la fecha límite"),
  monthlyPayment: z
    .number({ message: "Ingresa un monto válido" })
    .min(0, "El monto no puede ser negativo"),
  tone: z.enum(["dark", "darker", "light"]),
});

export type AddCardValues = z.infer<typeof addCardSchema>;
