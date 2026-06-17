import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../../common/guards/gql-jwt-auth.guard';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /** Devuelve el perfil del usuario autenticado. */
  @Query(() => UserModel, { name: 'me' })
  @UseGuards(GqlJwtAuthGuard)
  me(@CurrentUser() user: User): UserModel {
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  /** Actualiza el perfil del usuario autenticado. */
  @Mutation(() => UserModel)
  @UseGuards(GqlJwtAuthGuard)
  updateProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserModel> {
    return this.usersService.updateProfile(user.id, input);
  }
}
