import { Migration } from '@mikro-orm/migrations';

export class Migration20260929144512 extends Migration {

  override name = 'Migration20260929144512';

  override up(): void | Promise<void> {
    this.addSql(`create table "incident" ("id" serial primary key, "title" varchar(255) not null, "origin" text not null, "priority" text null, "status" text not null default 'PENDING', "code" varchar(255) not null, "address" varchar(255) not null, "postal" varchar(255) null, "description" varchar(255) null);`);

    this.addSql(`create table "incident_code" ("id" serial primary key, "title" varchar(255) not null);`);

    this.addSql(`create table "incident_note" ("id" serial primary key, "incident_id" int not null, "text" varchar(255) not null, "author" varchar(255) not null, "created_at" timestamptz not null);`);

    this.addSql(`alter table "unit" add "incident_id" int null;`);
    this.addSql(`alter table "unit" add constraint "unit_incident_id_foreign" foreign key ("incident_id") references "incident" ("id") on delete set null;`);

    this.addSql(`alter table "incident" add constraint "incident_origin_check" check ("origin" in ('CIVILIAN', 'OFFICER', 'ALARM'));`);
    this.addSql(`alter table "incident" add constraint "incident_priority_check" check ("priority" in ('3', '2H', '2', 'H'));`);
    this.addSql(`alter table "incident" add constraint "incident_status_check" check ("status" in ('PENDING', 'ACTIVE', 'CLOSED'));`);

    this.addSql(`alter table "incident_note" add constraint "incident_note_incident_id_foreign" foreign key ("incident_id") references "incident" ("id") on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "incident_note" drop constraint "incident_note_incident_id_foreign";`);
    this.addSql(`alter table "unit" drop constraint "unit_incident_id_foreign";`);

    this.addSql(`drop table if exists "incident" cascade;`);
    this.addSql(`drop table if exists "incident_code" cascade;`);
    this.addSql(`drop table if exists "incident_note" cascade;`);

    this.addSql(`alter table "unit" drop column "incident_id";`);
  }

}
