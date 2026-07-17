import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateUserInput } from '../../shared/types/user';

@Injectable()
export class UserRepository {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly prismaService: PrismaService,
  ) {}
  private returnOne(user: UserEntity | null) {
    return user ? this.userMapper.toDomain(user) : null;
  }
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    return this.returnOne(user);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return this.returnOne(user);
  }
  async create(input: CreateUserInput): Promise<UserEntity> {
    const user = await this.prismaService.user.create({ data: input });
    return this.userMapper.toDomain(user);
  }
}
