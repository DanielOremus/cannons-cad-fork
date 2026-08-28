import { Migration } from '@mikro-orm/migrations';

export class Migration20260828082244 extends Migration {

  override name = 'Migration20260828082244';

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_roles_check";`);
    this.addSql(`alter table "user" add constraint "user_roles_check" check ("roles" <@ array['POLICE'::text, 'CIVILIAN'::text, 'DISPATCH'::text, 'ADMIN'::text, 'SUPER_ADMIN'::text, 'REGISTERED'::text]);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_roles_check";`);
    this.addSql(`alter table "user" add constraint "user_roles_check" check ("roles" <@ array['POLICE'::text, 'CIVILIAN'::text, 'DISPATCH'::text, 'ADMIN'::text, 'REGISTERED'::text]);`);
  }

}
