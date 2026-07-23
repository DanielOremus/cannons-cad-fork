import { PrimaryKey } from '@mikro-orm/decorators/legacy';

export abstract class BaseEntity<T extends number | string> {
  @PrimaryKey()
  id!: T;
}
