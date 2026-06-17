import { ConflictException, Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import {
  CreateUserData,
  UsersRepository,
} from './repositories/users.repository';
import { UpdateUserInput } from './inputs/update-user.input';

/** Reglas de negocio relacionadas con usuarios. */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  create(data: CreateUserData): Promise<User> {
    return this.usersRepository.create(data);
  }

  /** Actualiza el perfil del usuario; valida que el correo no esté en uso. */
  async updateProfile(userId: string, input: UpdateUserInput): Promise<User> {
    if (input.email) {
      const existing = await this.usersRepository.findByEmail(input.email);
      if (existing && existing.id !== userId) {
        throw new ConflictException('El correo ya está en uso');
      }
    }

    return this.usersRepository.update(userId, {
      name: input.name,
      email: input.email,
      image: input.image,
    });
  }
}
