"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { APP_NAME, APP_PLAN, NAV_ITEMS } from "@/lib/constants";
import { useSession } from "@/features/auth/hooks/use-session";
import { useSidebar } from "./use-sidebar";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Contenido compartido por el sidebar de escritorio y el drawer móvil. */
function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useSession();
  const displayName = user?.name ?? "";

  return (
    <>
      {/* Marca */}
      <div className="flex items-center gap-3 px-2 pb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-invert">
          <span className="font-sans text-[17px] font-black tracking-tighter text-invert-ink">
            N
          </span>
        </div>
        <span className="text-[18px] font-extrabold tracking-tight">
          {APP_NAME}
        </span>
      </div>

      {/* Navegación */}
      <nav className="mt-7 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[10px] px-[11px] py-2.5 text-[13.5px] font-medium tracking-tight transition-colors",
                active
                  ? "bg-ink/[0.06] text-ink"
                  : "text-muted hover:bg-ink/[0.04] hover:text-ink",
              )}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={2} />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto size-1.5 rounded-full bg-ink" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Usuario → Configuración */}
      <Link
        href="/configuracion"
        onClick={onNavigate}
        aria-current={pathname === "/configuracion" ? "page" : undefined}
        className="mt-auto flex w-full items-center gap-3 border-t border-hairline px-1 pb-1 pt-4 text-left transition-opacity hover:opacity-80"
      >
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-elevated text-[13px] font-bold">
          {displayName ? initialsOf(displayName) : "··"}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold">
            {displayName}
          </span>
          <span className="block text-[11px] text-muted">{APP_PLAN}</span>
        </span>
        <Settings className="ml-auto size-4 text-muted" strokeWidth={2} />
      </Link>
    </>
  );
}

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const close = () => setOpen(false);

  return (
    <>
      {/* Escritorio: sidebar estático */}
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-hairline bg-surface px-[18px] py-[26px] lg:flex">
        <SidebarBody />
      </aside>

      {/* Móvil/tablet: drawer deslizable */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={close}
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-[270px] max-w-[82%] flex-col border-r border-hairline bg-surface px-[18px] py-[26px] shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar menú"
            className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <X className="size-4" />
          </button>
          <SidebarBody onNavigate={close} />
        </aside>
      </div>
    </>
  );
}
