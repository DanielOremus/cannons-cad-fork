import { Migration } from '@mikro-orm/migrations';

export class Migration20260929145114 extends Migration {

  override name = 'Migration20260929145114';

  override up(): void | Promise<void> {
    this.addSql(`drop table if exists "base_sensitive_entity" cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`create table "base_sensitive_entity" ("id" uuid not null, primary key ("id"));`);
  }

}
