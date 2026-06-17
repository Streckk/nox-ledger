import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../../common/guards/gql-jwt-auth.guard';
import { UserModel } from './models/user.model';

@Resolver(() => UserModel)
export class UsersResolver {
  /** Devuelve el perfil del usuario autenticado. */
  @Query(() => UserModel, { name: 'me' })
  @UseGuards(GqlJwtAuthGuard)
  me(@CurrentUser() user: User): UserModel {
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
