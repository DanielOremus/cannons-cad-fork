import { INestApplication } from '@nestjs/common';
import { UnitFactory } from './unit.factory.js';
import { EntityManager } from '@mikro-orm/postgresql';

export class TestFactory {
  private readonly em: EntityManager;
  readonly unit: UnitFactory;

  constructor(app: INestApplication) {
    this.em = app.get(EntityManager).fork();

    this.unit = new UnitFactory(this.em);
  }

  async clearDatabase() {
    await this.em.execute('TRUNCATE TABLE units, unit_members, users CASCADE');
  }
}
