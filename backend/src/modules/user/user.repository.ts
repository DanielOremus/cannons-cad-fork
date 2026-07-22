import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { User } from '../../generated/prisma/client';
import { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import { UpdateUserInput } from './inputs/update-user.input';

@Injectable()
export class UserRepository {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly prismaService: PrismaService,
  ) {}
  private returnOne(user: User | null) {
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
  async create(
    input: CreateUserInput,
    tx: TransactionClient = this.prismaService,
  ): Promise<UserEntity> {
    const user = await tx.user.create({ data: input });
    return this.userMapper.toDomain(user);
  }
  async update(
    id: string,
    input: UpdateUserInput,
    tx: TransactionClient = this.prismaService,
  ): Promise<UserEntity | null> {
    const raw = await tx.user.update({ where: { id }, data: input });
    return this.returnOne(raw);
  }
}
