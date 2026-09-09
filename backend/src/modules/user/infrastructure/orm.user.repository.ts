import { UserPopulate, UserRepository } from '../user.repository.js';
import { UserEntity } from '../entities/user.entity.js';
import { CreateUserInput } from '../inputs/create-user.input.js';
import { UpdateUserInput } from '../inputs/update-user.input.js';
import { EntityManager, FilterQuery, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UsersFilterDto } from '../dto/get-users-filter.dto.js';

@Injectable()
export class OrmUserRepository implements UserRepository {
  private readonly entity = UserEntity;
  constructor(private readonly em: EntityManager) {}
  async findById(id: string, populate: UserPopulate[] = []): Promise<UserEntity | null> {
    return await this.em.findOne(this.entity, { id }, { populate });
  }
  async findMany(query: UsersFilterDto): Promise<{ items: UserEntity[]; total: number }> {
    const { status, sortBy, sortOrder, page, limit } = query;
    const where: FilterQuery<UserEntity> = {};
    if (status) where.status = status;

    const [items, total] = await this.em.findAndCount(this.entity, where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: { [sortBy]: sortOrder },
    });
    return { items, total };
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.em.findOne(this.entity, { email });
  }
  async create(input: CreateUserInput): Promise<UserEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(entity: UserEntity, input: UpdateUserInput): Promise<UserEntity> {
    return await wrap(entity).assign(input);
  }
  async delete(id: string): Promise<void> {
    const ref = this.em.getReference(this.entity, id);
    await this.em.remove(ref);
  }
}
