import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

/** Formatea una fecha (Date o ISO string) en español. Patrón por defecto: "12 mar 2026". */
export function formatDate(date: Date | string, pattern = "dd MMM yyyy"): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, pattern, { locale: es });
}

/** Variante corta sin año, p. ej. "12 mar". */
export function formatShortDate(date: Date | string): string {
  return formatDate(date, "dd MMM");
}
