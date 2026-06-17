import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import {
  CreateUserData,
  UsersRepository,
} from './repositories/users.repository';

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
}
