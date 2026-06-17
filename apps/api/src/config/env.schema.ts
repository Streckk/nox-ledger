import { z } from 'zod';

/** Esquema de validación de las variables de entorno del backend. */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerida'),
  FRONTEND_URL: z.string().min(1).default('http://localhost:3000'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET es requerida'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),

  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET es requerida'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
});

export type Env = z.infer<typeof envSchema>;

/** Valida el entorno al arrancar; lanza un error claro si algo falta. */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Variables de entorno inválidas:\n${issues}`);
  }

  return result.data;
}
