import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import {
  PrivateUserResponseDto,
  PublicUserResponseDto,
} from './dto/user-response.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { CreateUserInput } from './inputs/create-user.input';

@Injectable()
export class UserMapper {
  toDomain(prismaUser: User): UserEntity {
    return { ...prismaUser };
  }
  toPrivateProfileDto(user: UserEntity): PrivateUserResponseDto {
    const { name, roles, email, status, emailConfirmed, createdAt } = user;

    return {
      name,
      email,
      emailConfirmed,
      roles,
      status,
      createdAt: createdAt.toISOString(),
    };
  }
  toPublicProfileDto(user: UserEntity): PublicUserResponseDto {
    const { name, roles, status, createdAt } = user;

    return { name, roles, status, createdAt: createdAt.toISOString() };
  }
}
