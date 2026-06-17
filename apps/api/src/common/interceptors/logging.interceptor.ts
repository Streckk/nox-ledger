import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

/**
 * Registra cada operación GraphQL (query/mutation) con su tipo, nombre,
 * duración y resultado. No registra los argumentos (evita filtrar contraseñas).
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GraphQL');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Solo operaciones GraphQL; REST (health) pasa sin ruido.
    if (context.getType<GqlContextType>() !== 'graphql') {
      return next.handle();
    }

    const info = GqlExecutionContext.create(context).getInfo<{
      fieldName: string;
      parentType: { name: string };
    }>();
    const operation = info.parentType?.name ?? 'Operation';
    const field = info.fieldName;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(
            `${operation} ${field} ✓ ${Date.now() - startedAt}ms`,
          ),
        error: (error: Error) =>
          this.logger.warn(
            `${operation} ${field} ✗ ${error.message} (${Date.now() - startedAt}ms)`,
          ),
      }),
    );
  }
}
