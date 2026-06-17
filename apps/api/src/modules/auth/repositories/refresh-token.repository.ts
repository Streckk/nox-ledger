import { Injectable } from '@nestjs/common';
import type { RefreshToken } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

/** Acceso a datos de los refresh tokens. Única capa que habla con Prisma. */
@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data });
  }

  findByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  revokeById(id: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  revokeAllForUser(userId: string): Promise<{ count: number }> {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
