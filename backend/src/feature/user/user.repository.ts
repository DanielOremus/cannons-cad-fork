import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly prismaService: PrismaService,
  ) {}
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    return user ? this.userMapper.toDomain(user) : null;
  }
}
