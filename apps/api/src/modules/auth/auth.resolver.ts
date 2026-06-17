import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import {
  clearAuthCookies,
  REFRESH_COOKIE,
  setAuthCookies,
} from '../../common/utils/auth-cookies.util';
import { AuthService } from './auth.service';
import { LoginInput } from './inputs/login.input';
import { RefreshInput } from './inputs/refresh.input';
import { RegisterInput } from './inputs/register.input';
import { AuthPayload } from './models/auth-payload.model';

interface GqlContext {
  req: Request;
  res: Response;
}

@Resolver(() => AuthPayload)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GqlContext,
  ): Promise<AuthPayload> {
    const result = await this.authService.register(input);
    setAuthCookies(ctx.res, result, this.configService);
    return result;
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: GqlContext,
  ): Promise<AuthPayload> {
    const result = await this.authService.login(input);
    setAuthCookies(ctx.res, result, this.configService);
    return result;
  }

  @Mutation(() => AuthPayload)
  async refresh(
    @Context() ctx: GqlContext,
    @Args('input', { nullable: true }) input?: RefreshInput,
  ): Promise<AuthPayload> {
    const token = this.resolveRefreshToken(ctx, input);
    if (!token) {
      throw new UnauthorizedException('No se encontró el refresh token');
    }
    const result = await this.authService.rotateRefreshToken(token);
    setAuthCookies(ctx.res, result, this.configService);
    return result;
  }

  @Mutation(() => Boolean)
  async logout(
    @Context() ctx: GqlContext,
    @Args('input', { nullable: true }) input?: RefreshInput,
  ): Promise<boolean> {
    const token = this.resolveRefreshToken(ctx, input);
    await this.authService.logout(token);
    clearAuthCookies(ctx.res, this.configService);
    return true;
  }

  /** Toma el refresh token de la cookie (web) o del input (móvil). */
  private resolveRefreshToken(
    ctx: GqlContext,
    input?: RefreshInput,
  ): string | undefined {
    return (
      input?.refreshToken ??
      (ctx.req.cookies?.[REFRESH_COOKIE] as string | undefined)
    );
  }
}
