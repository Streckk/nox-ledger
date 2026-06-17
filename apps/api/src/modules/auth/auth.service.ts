import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import type { JwtPayload } from '../../common/strategies/jwt.strategy';
import { hashToken, parseDuration } from '../../common/utils/token.util';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

const SALT_ROUNDS = 10;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  /** Registra un usuario nuevo. Falla si el correo ya existe. */
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return this.issueSession(user);
  }

  /** Inicia sesión validando credenciales. */
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.validateUser(input.email, input.password);
    return this.issueSession(user);
  }

  /** Valida email + password. Lanza UnauthorizedException si no coinciden. */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  /**
   * Rota un refresh token: valida, revoca el actual y emite uno nuevo.
   * Si se reusa un token ya revocado, revoca TODAS las sesiones del usuario.
   */
  async rotateRefreshToken(rawToken: string): Promise<AuthResult> {
    try {
      await this.jwtService.verifyAsync(rawToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const record = await this.refreshTokenRepository.findByHash(
      hashToken(rawToken),
    );
    if (!record) {
      throw new UnauthorizedException('Sesión no válida');
    }

    // Reuse detection: el token ya había sido rotado/revocado.
    if (record.revokedAt) {
      await this.refreshTokenRepository.revokeAllForUser(record.userId);
      throw new UnauthorizedException(
        'Refresh token reutilizado; se revocaron las sesiones',
      );
    }

    await this.refreshTokenRepository.revokeById(record.id);

    const user = await this.usersService.findById(record.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sesión no válida');
    }

    return this.issueSession(user);
  }

  /** Cierra sesión revocando el refresh token de este dispositivo. */
  async logout(rawToken?: string): Promise<boolean> {
    if (!rawToken) {
      return true;
    }
    const record = await this.refreshTokenRepository.findByHash(
      hashToken(rawToken),
    );
    if (record && !record.revokedAt) {
      await this.refreshTokenRepository.revokeById(record.id);
    }
    return true;
  }

  /** Genera tokens, persiste el refresh y arma el resultado. */
  private async issueSession(user: User): Promise<AuthResult> {
    const tokens = await this.generateTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    return { ...tokens, user };
  }

  /** Genera access y refresh tokens para el usuario. */
  async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const accessOptions: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_ACCESS_EXPIRES_IN',
      ) as JwtSignOptions['expiresIn'],
    };
    const refreshOptions: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES_IN',
      ) as JwtSignOptions['expiresIn'],
      // jti único: garantiza tokens (y hashes) distintos aunque se emitan a la vez.
      jwtid: randomUUID(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessOptions),
      this.jwtService.signAsync(payload, refreshOptions),
    ]);

    return { accessToken, refreshToken };
  }

  /** Guarda el hash del refresh token con su fecha de expiración. */
  private async persistRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const ttlMs = parseDuration(
      this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
    );
    await this.refreshTokenRepository.create({
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + ttlMs),
    });
  }
}
