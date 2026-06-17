import { defineConfig, env } from 'prisma/config';

// Prisma 7 ya no carga .env automáticamente; lo cargamos aquí para el CLI.
try {
  process.loadEnvFile();
} catch {
  // .env es opcional (p. ej. en CI las vars vienen del entorno).
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
