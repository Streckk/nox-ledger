import { cn } from "@/lib/cn";
import { getPasswordStrength } from "@/lib/password-strength";

const BARS = 4;

const fillByScore: Record<number, string> = {
  1: "bg-negative",
  2: "bg-amber-500",
  3: "bg-ink",
  4: "bg-positive",
};

/** Medidor visual de fuerza de contraseña (4 barras). */
export function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {Array.from({ length: BARS }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              index < score ? fillByScore[score] : "bg-ink/10",
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-muted">
        Seguridad: <span className="text-ink">{label}</span>
      </p>
    </div>
  );
}
