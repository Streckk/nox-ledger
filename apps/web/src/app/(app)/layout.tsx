import { DashboardShell } from "@/components/layout/dashboard-shell";

/** Layout de la app autenticada: envuelve las rutas con el shell (sidebar + header). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
