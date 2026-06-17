import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

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
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());

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
