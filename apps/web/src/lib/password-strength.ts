export interface PasswordStrength {
  /** Puntuación 0–4. */
  score: number;
  /** Etiqueta legible ("" si la contraseña está vacía). */
  label: string;
}

const LABELS = ["Muy débil", "Débil", "Aceptable", "Buena", "Fuerte"];

/** Calcula una fuerza de contraseña simple (heurística local, sin librerías). */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return { score, label: LABELS[score] };
}
