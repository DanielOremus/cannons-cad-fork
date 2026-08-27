import { Migration } from '@mikro-orm/migrations';

export class Migration20260826091452 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "citation" add "issued_by_id" uuid null;`);
    this.addSql(`alter table "citation" add constraint "citation_issued_by_id_foreign" foreign key ("issued_by_id") references "user" ("id") on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "citation" drop constraint "citation_issued_by_id_foreign";`);

    this.addSql(`alter table "citation" drop column "issued_by_id";`);
  }

}
