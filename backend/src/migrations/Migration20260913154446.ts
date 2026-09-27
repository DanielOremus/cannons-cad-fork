import { Migration } from '@mikro-orm/migrations';

export class Migration20260913154446 extends Migration {

  override name = 'Migration20260913154446';

  override up(): void | Promise<void> {
    this.addSql(`create table "unit" ("id" serial primary key, "duty" text not null, "callsign" varchar(255) null, "status" text not null default 'OS');`);

    this.addSql(`create table "unit_member" ("id" serial primary key, "name" varchar(255) not null, "rank" varchar(255) not null, "user_id" uuid not null, "unit_id" int null, "last_join_at" timestamptz null);`);
    this.addSql(`alter table "unit_member" add constraint "unit_member_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "citation" add "officer_name" varchar(255) not null, add "officer_rank" varchar(255) not null;`);

    this.addSql(`alter table "unit" add constraint "unit_duty_check" check ("duty" in ('police', 'dispatch', 'ems'));`);
    this.addSql(`alter table "unit" add constraint "unit_status_check" check ("status" in ('AV', 'BS', 'OS', 'SC'));`);

    this.addSql(`alter table "unit_member" add constraint "unit_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);
    this.addSql(`alter table "unit_member" add constraint "unit_member_unit_id_foreign" foreign key ("unit_id") references "unit" ("id") on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "unit_member" drop constraint "unit_member_unit_id_foreign";`);

    this.addSql(`drop table if exists "unit" cascade;`);
    this.addSql(`drop table if exists "unit_member" cascade;`);

    this.addSql(`alter table "citation" drop column "officer_name", drop column "officer_rank";`);
  }

}
