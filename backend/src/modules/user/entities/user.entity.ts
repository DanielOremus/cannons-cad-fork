import { UserRole, UserStatus } from '@project/shared';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { EntityName } from '@mikro-orm/core';
import { BaseEntity } from '../../../shared/entities/base.entity';
// export class UserEntity implements BaseEntityUuid {
//   id: string;
//   name: string;
//   email: string;
//   roles: UserRole[];
//   status: UserStatus;
//   emailConfirmed: boolean;
//   passwordHash: string;
//   createdAt: Date;
// }
@Entity()
export class UserEntity extends BaseEntity<string> {
  [EntityName]?: 'User';

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  roles!: UserRole[];

  @Property()
  status: UserStatus = UserStatus.PENDING;

  @Property()
  emailConfirmed: boolean = false;

  @Property()
  passwordHash!: string;

  @Property()
  createdAt: Date = new Date();
}
