import { cn } from "@/lib/cn";
import { APP_NAME } from "@/lib/constants";

interface BrandProps {
  /** "onDark" invierte los colores para usarse sobre fondos oscuros (panel invert). */
  tone?: "default" | "onDark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const boxSize = {
  sm: "size-7 text-[15px]",
  md: "size-8 text-[17px]",
  lg: "size-10 text-[21px]",
};

const nameSize = {
  sm: "text-base",
  md: "text-[18px]",
  lg: "text-xl",
};

/** Marca de Nox Ledger (logotipo "N" + nombre). Reutilizable en sidebar y auth. */
export function Brand({ tone = "default", size = "md", className }: BrandProps) {
  const onDark = tone === "onDark";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg font-black tracking-tighter",
          boxSize[size],
          onDark ? "bg-invert-ink text-invert" : "bg-invert text-invert-ink",
        )}
      >
        N
      </span>
      <span
        className={cn(
          "font-extrabold tracking-tight",
          nameSize[size],
          onDark ? "text-invert-ink" : "text-ink",
        )}
      >
        {APP_NAME}
      </span>
    </div>
  );
}
