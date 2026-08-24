import { UserRepository } from '../user.repository';
import { UserEntity } from '../entities/user.entity';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmUserRepository extends UserRepository {
  private readonly entity = UserEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async findById(id: string): Promise<UserEntity | null> {
    return await this.em.findOne(this.entity, { id });
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.em.findOne(this.entity, { email });
  }
  async create(input: CreateUserInput): Promise<UserEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(id: string, input: UpdateUserInput): Promise<UserEntity | null> {
    return this.em.upsert(this.entity, { id, ...input });
  }
  async delete(id: string): Promise<void> {
    const ref = this.em.getReference(this.entity, id);
    await this.em.remove(ref);
  }
}
