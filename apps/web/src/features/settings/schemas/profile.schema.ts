import { z } from "zod";

/** Esquema de los datos personales del perfil. */
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre completo"),
  email: z.email("Ingresa un correo válido"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
