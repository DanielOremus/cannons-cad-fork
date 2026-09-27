import { EntityManager } from '@mikro-orm/postgresql';

export abstract class BaseFactory {
  constructor(protected readonly em: EntityManager) {}
}
