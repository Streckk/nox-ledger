"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { accountMeta } from "../data/settings.mock";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

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
  image?: string | null;
  saved: boolean;
  uploading: boolean;
  onImageChange: (dataUrl: string) => void;
}

/** Cabecera de perfil: avatar (foto o iniciales) con subida, identidad y metadatos. */
export function ProfileSummaryCard({
  name,
  email,
  image,
  saved,
  uploading,
  onImageChange,
}: ProfileSummaryCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // permite reseleccionar el mismo archivo
    if (!file) return;

    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("La imagen no debe superar 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result as string);
    reader.onerror = () => setError("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  };

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
        {/* Avatar: foto o iniciales, con subida */}
        <div className="flex flex-col items-start gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label="Cambiar foto de perfil"
            className="group relative size-[100px] shrink-0 rounded-full border border-hairline bg-surface p-1.5"
          >
            <span className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-elevated text-[32px] font-extrabold tracking-tight ring-1 ring-hairline-strong">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Foto de perfil"
                  className="size-full object-cover"
                />
              ) : (
                initialsOf(name)
              )}
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity",
                  uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              >
                {uploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Camera className="size-5" />
                )}
              </span>
            </span>
          </button>
          {error && (
            <span className="max-w-[120px] text-[11px] font-medium text-negative">
              {error}
            </span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
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
