import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  /** Elemento opcional alineado a la derecha del label (p. ej. "¿Olvidaste tu contraseña?"). */
  action?: ReactNode;
  children: ReactNode;
}

/** Envoltura de campo de formulario: label (+ acción opcional) + control + error. */
export function Field({ label, htmlFor, error, action, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-bold uppercase tracking-wide text-muted"
        >
          {label}
        </label>
        {action}
      </div>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1.5 text-[12px] font-medium text-negative">{error}</p>
      )}
    </div>
  );
}

/** Separador "o" para las pantallas de autenticación. */
export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-faint">
      <span className="h-px flex-1 bg-hairline" />
      {label}
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}
