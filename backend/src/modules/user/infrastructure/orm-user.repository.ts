import { UserRepository } from '../user.repository';
import { UserEntity } from '../entities/user.entity';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { EntityManager } from '@mikro-orm/postgresql';

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
  create(input: CreateUserInput): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  update(id: string, input: UpdateUserInput): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    const ref = this.em.getReference(this.entity, id);
    this.em.remove(ref);
  }
}
