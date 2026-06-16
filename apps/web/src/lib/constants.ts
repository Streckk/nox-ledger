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
  /** Si false, la sección aún no tiene página propia (placeholder). */
  ready?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, ready: true },
  { label: "Ingresos", href: "/ingresos", icon: TrendingUp },
  { label: "Gastos fijos", href: "/gastos", icon: Receipt },
  { label: "Tarjetas", href: "/tarjetas", icon: CreditCard },
  { label: "Compras a meses", href: "/compras", icon: CalendarClock },
  { label: "Simulador de compra", href: "/simulador", icon: Sparkles },
  { label: "Proyecciones", href: "/proyecciones", icon: LineChart },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

/** Plazos predefinidos (meses) que ofrece el simulador para comparar. */
export const SIMULATOR_TERMS = [3, 6, 9, 12, 18] as const;

/** Mes activo mostrado en el header (mock). */
export const CURRENT_PERIOD_LABEL = "Junio 2026";
