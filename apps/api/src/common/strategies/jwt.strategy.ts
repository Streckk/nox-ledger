import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { User } from '@prisma/client';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../modules/users/users.service';
import { ACCESS_COOKIE } from '../utils/auth-cookies.util';

/** Payload firmado en el access token. */
export interface JwtPayload {
  sub: string;
  email: string;
}

/** Extrae el access token de la cookie httpOnly (cliente web). */
function cookieExtractor(req: Request): string | null {
  const token = req?.cookies?.[ACCESS_COOKIE] as string | undefined;
  return token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Web: cookie httpOnly · Móvil/API: header Authorization Bearer.
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  /** Verifica que el usuario del token siga existiendo y esté activo. */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sesión no válida');
    }

    return user;
  }
}
