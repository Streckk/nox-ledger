import { createHash } from 'node:crypto';

/** Hash SHA-256 (hex) de un token; lo que se guarda en la BD (nunca el token crudo). */
export function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

const UNIT_TO_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/** Convierte duraciones tipo "15m", "7d", "30s", "500ms" (o un número en ms) a milisegundos. */
export function parseDuration(value: string): number {
  const match = /^(\d+)(ms|s|m|h|d)?$/.exec(value.trim());
  if (!match) return 0;
  const amount = Number.parseInt(match[1], 10);
  const unit = match[2] ?? 'ms';
  return amount * UNIT_TO_MS[unit];
}
