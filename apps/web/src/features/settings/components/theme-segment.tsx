"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

const base =
  "flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors cursor-pointer";

/** Control segmentado Claro/Oscuro. El estado activo se pinta vía la clase .dark (CSS). */
export function ThemeSegment() {
  const { setTheme } = useTheme();

  return (
    <div className="inline-flex rounded-xl border border-hairline bg-elevated p-1">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          base,
          "bg-invert text-invert-ink dark:bg-transparent dark:text-muted",
        )}
      >
        <Sun className="size-4" /> Claro
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          base,
          "text-muted dark:bg-invert dark:text-invert-ink",
        )}
      >
        <Moon className="size-4" /> Oscuro
      </button>
    </div>
  );
}
