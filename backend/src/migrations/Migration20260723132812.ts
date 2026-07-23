import { Migration } from '@mikro-orm/migrations';

export class Migration20260723132812 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "user_entity" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "roles" text[] not null, "status" varchar(255) not null default 'PENDING', "email_confirmed" boolean not null default false, "password_hash" varchar(255) not null, "created_at" timestamptz not null, primary key ("id"));`);
  }

}
