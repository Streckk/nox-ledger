import { Button } from "@/components/ui/button";
import { accountMeta } from "../data/settings.mock";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  return parts
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ProfileSummaryCardProps {
  name: string;
  email: string;
  saved: boolean;
}

/** Cabecera de perfil: avatar de iniciales, identidad y metadatos de la cuenta. */
export function ProfileSummaryCard({ name, email, saved }: ProfileSummaryCardProps) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
          <span className="size-1.5 rounded-full bg-ink" />
          Cuenta / Perfil
        </p>
        <Button type="submit">
          {saved ? "Guardado ✓" : "Guardar cambios"}
        </Button>
      </div>

      <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar con anillos concéntricos */}
        <div className="flex size-[100px] shrink-0 items-center justify-center rounded-full border border-hairline bg-surface p-1.5">
          <span className="flex size-full items-center justify-center rounded-full bg-elevated text-[32px] font-extrabold tracking-tight ring-1 ring-hairline-strong">
            {initialsOf(name)}
          </span>
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-3xl font-extrabold tracking-tight">
            {name || "Sin nombre"}
          </h2>
          <p className="mt-1 font-mono text-[13px] text-muted">{email}</p>
        </div>

        {/* Metadatos de la cuenta */}
        <dl className="grid grid-cols-3 gap-6 sm:ml-auto sm:gap-8">
          <Meta label="Plan" value={accountMeta.plan} />
          <Meta label="Miembro desde" value={accountMeta.memberSince} />
          <Meta label="ID de cuenta" value={accountMeta.accountId} mono />
        </dl>
      </div>
    </section>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "mt-1.5 font-mono text-[13px] font-bold"
            : "mt-1.5 text-sm font-bold"
        }
      >
        {value}
      </dd>
    </div>
  );
}
