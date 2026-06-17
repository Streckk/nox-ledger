import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  image?: string | null;
}

/** Acceso a datos de usuarios. Única capa que habla con Prisma. */
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
}
