import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import {
  UserOwnProfileDto,
  RegisterUserDto,
  UserPublicProfileDto,
} from '@project/shared';
import { CreateUserInput } from '../../shared/types/user';

@Injectable()
export class UserMapper {
  toDomain(prismaUser: User): UserEntity {
    return { ...prismaUser };
  }
  toOwnProfileDto(prismaUser: User): UserOwnProfileDto {
    const { id, name, role, email, status, emailConfirmed, createdAt } =
      prismaUser;

    return {
      id,
      name,
      email,
      emailConfirmed,
      role,
      status,
      createdAt: createdAt.toUTCString(),
    };
  }
  toPublicProfileDto(prismaUser: User): UserPublicProfileDto {
    const { name, role, status, createdAt } = prismaUser;

    return { name, role, status, createdAt: createdAt.toUTCString() };
  }
  toCreateInput(dto: RegisterUserDto, passwordHash: string): CreateUserInput {
    const { name, email } = dto;
    return { email, name, passwordHash };
  }
}
