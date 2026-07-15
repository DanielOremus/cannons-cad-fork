import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import { MyProfileDto } from '@project/shared';

@Injectable()
export class UserMapper {
  toDomain(prismaUser: User): UserEntity {
    return { ...prismaUser };
  }
  toProfileDto(prismaUser: User): MyProfileDto {
    const { name, role, email, status, createdAt } = prismaUser;

    return { name, email, role, status, createdAt: createdAt.toUTCString() };
  }
}
