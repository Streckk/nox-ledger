import type { CurrencyCode } from "@/types/finance";

/** Metadatos de la cuenta mostrados en la cabecera de perfil. */
export const accountMeta = {
  plan: "Personal",
  memberSince: "Marzo 2024",
  accountId: "NOX·4821·MX",
};

/** Opciones de moneda disponibles. */
export const currencyOptions: { value: CurrencyCode; label: string }[] = [
  { value: "MXN", label: "MXN — Peso mexicano" },
  { value: "USD", label: "USD — Dólar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "COP", label: "COP — Peso colombiano" },
];

export interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

/** Preferencias de notificación (valores iniciales mockeados). */
export const notificationDefaults: NotificationPref[] = [
  {
    id: "email",
    label: "Correo electrónico",
    description: "Resúmenes mensuales y alertas de pago por correo.",
    enabled: true,
  },
  {
    id: "push",
    label: "Notificaciones push",
    description: "Avisos cuando se acerca un corte o fecha límite.",
    enabled: true,
  },
  {
    id: "tips",
    label: "Consejos de ahorro",
    description: "Tips ocasionales basados en tus hábitos.",
    enabled: false,
  },
];
