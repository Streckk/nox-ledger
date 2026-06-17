import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { User } from '@prisma/client';

/**
 * Obtiene el usuario autenticado desde el contexto GraphQL.
 * El usuario lo coloca Passport en `req.user` tras validar el JWT.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext<{ req: { user: User } }>().req.user;
  },
);
