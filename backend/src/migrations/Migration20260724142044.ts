import { Migration } from '@mikro-orm/migrations';

export class Migration20260724142044 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`create table "base_sensitive_entity" ("id" uuid not null, primary key ("id"));`);

    this.addSql(
      `create table "email_confirmation" ("id" serial primary key, "email" varchar(255) not null, "code" numeric(6,0) not null, "attempts" smallint not null default 0, "created_at" timestamptz not null, "expires_at" timestamptz not null);`,
    );
    this.addSql(
      `alter table "email_confirmation" add constraint "email_confirmation_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "roles" text[] not null default '{REGISTERED}', "status" text not null default 'PENDING', "email_confirmed" boolean not null default false, "password_hash" varchar(255) not null, "created_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(
      `alter table "user" add constraint "user_roles_check" check ("roles" <@ array['POLICE'::text, 'CIVILIAN'::text, 'DISPATCH'::text, 'ADMIN'::text, 'REGISTERED'::text]);`,
    );
    this.addSql(
      `alter table "user" add constraint "user_status_check" check ("status" in ('APPROVED', 'REJECTED', 'PENDING', 'SUSPENDED'));`,
    );

    this.addSql(
      `create table "character" ("id" serial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "dob" date not null, "gender" text not null, "phone_number" varchar(255) null, "address" varchar(255) null, "has_gun_permit" boolean not null default false, "flags" text[] not null default '{}', "user_id" uuid not null);`,
    );
    this.addSql(
      `alter table "character" add constraint "character_gender_check" check ("gender" in ('MALE', 'FEMALE'));`,
    );
    this.addSql(
      `alter table "character" add constraint "character_flags_check" check ("flags" <@ array['MENTAL_HEALTH'::text, 'BOLO'::text, 'WARRANT'::text]);`,
    );

    this.addSql(
      `alter table "character" add constraint "character_user_id_foreign" foreign key ("user_id") references "user" ("id");`,
    );
  }
}
