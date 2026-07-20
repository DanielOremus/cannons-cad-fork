import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import {
  PrivateUserResponseDto,
  PublicUserResponseDto,
} from './dto/user-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserInput } from '../../shared/types/user';

@Injectable()
export class UserMapper {
  toDomain(prismaUser: User): UserEntity {
    return { ...prismaUser };
  }
  toPrivateProfileDto(prismaUser: User): PrivateUserResponseDto {
    const { name, roles, email, status, emailConfirmed, createdAt } =
      prismaUser;

    return {
      name,
      email,
      emailConfirmed,
      roles,
      status,
      createdAt: createdAt.toISOString(),
    };
  }
  toPublicProfileDto(prismaUser: User): PublicUserResponseDto {
    const { name, roles, status, createdAt } = prismaUser;

    return { name, roles, status, createdAt: createdAt.toISOString() };
  }
  toCreateInput(
    data: RegisterUserDto & { passwordHash: string },
  ): CreateUserInput {
    const { name, email, passwordHash } = data;
    return { email, name, passwordHash };
  }
}
