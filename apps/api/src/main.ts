import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

// Límite del body: una imagen de 4MB en base64 ≈ 5.6MB + overhead.
const BODY_LIMIT = '6mb';

/** Describe la base de datos sin exponer credenciales (usuario/contraseña). */
function describeDatabase(databaseUrl: string): string {
  try {
    const url = new URL(databaseUrl);
    const provider = url.protocol.replace(':', '');
    const database = url.pathname.replace(/^\//, '') || '(default)';
    return `${provider} → ${url.host}/${database}`;
  } catch {
    return 'configuración no reconocida (revisa DATABASE_URL)';
  }
}

async function bootstrap() {
  // Desactivamos el body parser por defecto (límite 100kb) para aplicar el nuestro.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const config = app.get(ConfigService);

  app.use(json({ limit: BODY_LIMIT }));
  app.use(urlencoded({ extended: true, limit: BODY_LIMIT }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());
  app.use(cookieParser());

  const frontendUrl = config.getOrThrow<string>('FRONTEND_URL');
  app.enableCors({ origin: frontendUrl, credentials: true });

  const port = config.getOrThrow<number>('PORT');
  const nodeEnv = config.getOrThrow<string>('NODE_ENV');
  const databaseUrl = config.getOrThrow<string>('DATABASE_URL');

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(
    `🚀 Servidor escuchando en http://localhost:${port} · entorno: ${nodeEnv} · GraphQL: /graphql · CORS: ${frontendUrl}`,
  );
  logger.log(`🗄️  Base de datos: ${describeDatabase(databaseUrl)}`);
}

void bootstrap();
