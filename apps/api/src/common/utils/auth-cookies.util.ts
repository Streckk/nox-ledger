import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import { parseDuration } from './token.util';

export const ACCESS_COOKIE = 'nox_access_token';
export const REFRESH_COOKIE = 'nox_refresh_token';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function baseOptions(config: ConfigService): CookieOptions {
  return {
    httpOnly: true,
    secure: config.getOrThrow<string>('NODE_ENV') === 'production',
    sameSite: 'lax',
    path: '/',
    domain: config.get<string>('COOKIE_DOMAIN') || undefined,
  };
}

/** Setea las cookies httpOnly de acceso y refresh (cliente web). */
export function setAuthCookies(
  res: Response,
  tokens: AuthTokens,
  config: ConfigService,
): void {
  const base = baseOptions(config);
  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: parseDuration(config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN')),
  });
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    maxAge: parseDuration(config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN')),
  });
}

/** Limpia las cookies de auth (logout). */
export function clearAuthCookies(res: Response, config: ConfigService): void {
  const base = baseOptions(config);
  res.clearCookie(ACCESS_COOKIE, base);
  res.clearCookie(REFRESH_COOKIE, base);
}
