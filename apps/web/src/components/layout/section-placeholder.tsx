import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface SectionPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

/** Estado vacío consistente para secciones que aún no tienen contenido. */
export function SectionPlaceholder({
  icon: Icon,
  title,
  description = "Esta sección está en el roadmap. El Dashboard, Tarjetas, Compras a meses y el Simulador ya están listos para explorar.",
}: SectionPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline-strong bg-elevated px-6 py-20 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-hairline bg-surface">
        <Icon className="size-6 text-muted" strokeWidth={2} />
      </span>
      <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {description}
      </p>
      <Link
        href="/dashboard"
        className={buttonVariants({ size: "pill", className: "mt-6" })}
      >
        Volver al Dashboard
      </Link>
    </div>
  );
}
