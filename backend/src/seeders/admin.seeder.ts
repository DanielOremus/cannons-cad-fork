import bcrypt from 'bcrypt';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { UserEntity } from '../modules/user/entities/user.entity';
import { UserRole, UserStatus } from '@project/shared';

import 'dotenv/config';

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error('Admin email is not provided');

    const exists = await em.findOne(UserEntity, { email: adminEmail });
    if (exists) return;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) throw new Error('Admin password is not provided');

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    em.create(UserEntity, {
      email: adminEmail,
      passwordHash,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      name: 'SuperRoot',
      emailConfirmed: true,
      status: UserStatus.APPROVED,
    });

    await em.flush();
  }
}
