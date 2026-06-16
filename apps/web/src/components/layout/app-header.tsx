"use client";

import { useTheme } from "next-themes";
import { Calendar, Menu, Moon, Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRENT_PERIOD_LABEL } from "@/lib/constants";
import { currentUser } from "@/mocks/financial-dashboard.mock";
import { useSidebar } from "./use-sidebar";

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const { toggle } = useSidebar();
  const firstName = currentUser.name.split(" ")[0];

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-hairline bg-canvas/80 px-4 py-4 backdrop-blur-xl sm:gap-6 sm:px-10 sm:py-5">
      <Button
        variant="ghost"
        size="icon"
        className="-ml-1 shrink-0 lg:hidden"
        onClick={toggle}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Resumen general
        </p>
        <h1 className="mt-0.5 truncate text-xl font-extrabold tracking-tight sm:text-2xl">
          Buenas tardes, {firstName}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="pill"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
        >
          {/* Iconos conmutados por CSS según la clase .dark (sin hydration mismatch) */}
          <span className="flex items-center gap-2 dark:hidden">
            <Moon className="size-4" />
            <span className="hidden sm:inline">Oscuro</span>
          </span>
          <span className="hidden items-center gap-2 dark:flex">
            <Sun className="size-4" />
            <span className="hidden sm:inline">Claro</span>
          </span>
        </Button>

        <span className="hidden items-center gap-2 rounded-full border border-hairline-strong px-3.5 py-2 text-[13px] font-semibold sm:flex">
          <Calendar className="size-3.5 text-muted" />
          {CURRENT_PERIOD_LABEL}
        </span>

        <Button size="pill">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Agregar movimiento</span>
        </Button>
      </div>
    </header>
  );
}
