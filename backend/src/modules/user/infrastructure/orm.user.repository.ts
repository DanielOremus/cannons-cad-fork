import { UserRepository } from '../user.repository';
import { UserEntity } from '../entities/user.entity';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { EntityManager, FilterQuery, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UsersFilterDto } from '../dto/get-users-filter.dto';

@Injectable()
export class OrmUserRepository extends UserRepository {
  private readonly entity = UserEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async findById(id: string): Promise<UserEntity | null> {
    return await this.em.findOne(this.entity, { id });
  }
  async findMany(query: UsersFilterDto): Promise<{ items: UserEntity[]; total: number }> {
    const { status, sortBy, sortOrder, page, limit } = query;
    const where: FilterQuery<UserEntity> = {};
    if (status) where.status = status;

    const usersPromise = this.em.findAll(this.entity, {
      where,
      limit,
      offset: (page - 1) * limit,
      orderBy: { [sortBy]: sortOrder },
    });
    const countPromise = this.em.count(this.entity, where);

    const [users, total] = await Promise.all([usersPromise, countPromise]);

    return { items: users, total };
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
