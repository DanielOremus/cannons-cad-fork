import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnitOfWork {
  constructor(private readonly em: EntityManager) {}
  async withTransaction<T>(callback: () => Promise<T>): Promise<T> {
    const toReturn = await this.em.transactional(async () => {
      return await callback();
    });
    return toReturn;
  }
  async saveChanges(): Promise<void> {
    await this.em.flush();
  }
}
