import {
  LayoutGrid,
  TrendingUp,
  Receipt,
  CreditCard,
  CalendarClock,
  Sparkles,
  LineChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "Nox Ledger";
export const APP_PLAN = "Plan Personal";

/** Item de navegación del sidebar. */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Subtítulo mostrado en el header al estar en la sección. */
  eyebrow: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, eyebrow: "Resumen general" },
  { label: "Ingresos", href: "/ingresos", icon: TrendingUp, eyebrow: "Tus fuentes de ingreso" },
  { label: "Gastos fijos", href: "/gastos", icon: Receipt, eyebrow: "Gastos recurrentes" },
  { label: "Tarjetas", href: "/tarjetas", icon: CreditCard, eyebrow: "Tus tarjetas de crédito" },
  { label: "Compras a meses", href: "/compras", icon: CalendarClock, eyebrow: "Meses sin intereses" },
  { label: "Simulador de compra", href: "/simulador", icon: Sparkles, eyebrow: "¿Puedo comprar esto?" },
  { label: "Proyecciones", href: "/proyecciones", icon: LineChart, eyebrow: "Proyección financiera" },
  { label: "Configuración", href: "/configuracion", icon: Settings, eyebrow: "Cuenta y preferencias" },
];

/** Plazos predefinidos (meses) que ofrece el simulador para comparar. */
export const SIMULATOR_TERMS = [3, 6, 9, 12, 18] as const;

/** Mes activo mostrado en el header (mock). */
export const CURRENT_PERIOD_LABEL = "Junio 2026";
