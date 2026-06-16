import type { ReactNode } from "react";

interface SettingsSectionProps {
  /** Marcador de orden, p. ej. "01". */
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Fila de la hoja de ajustes: columna de etiqueta (número + título + descripción)
 * y columna de contenido. Apilada en móvil, dos columnas en lg.
 */
export function SettingsSection({
  index,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="grid gap-6 border-t border-hairline px-6 py-8 first:border-t-0 sm:px-8 lg:grid-cols-[230px_1fr] lg:gap-12">
      <div>
        <p className="font-mono text-xs font-bold text-faint">{index}</p>
        <h3 className="mt-2.5 text-[17px] font-bold tracking-tight">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          {description}
        </p>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
