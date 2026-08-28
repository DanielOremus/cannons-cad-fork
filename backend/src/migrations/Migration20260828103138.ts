import { Migration } from '@mikro-orm/migrations';

export class Migration20260828103138 extends Migration {

  override name = 'Migration20260828103138';

  override up(): void | Promise<void> {
    this.addSql(`create table "base_sensitive_entity" ("id" uuid not null, primary key ("id"));`);

    this.addSql(`create table "driver_license" ("id" serial primary key, "categories" text[] not null default '{}');`);
    this.addSql(`alter table "driver_license" add constraint "driver_license_categories_check" check ("categories" <@ array['A'::text, 'B'::text, 'C'::text, 'D'::text]);`);

    this.addSql(`create table "email_confirmation" ("id" serial primary key, "email" varchar(255) not null, "code" numeric(6,0) not null, "attempts" smallint not null default 0, "created_at" timestamptz not null, "expires_at" timestamptz not null);`);
    this.addSql(`alter table "email_confirmation" add constraint "email_confirmation_email_unique" unique ("email");`);

    this.addSql(`create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "roles" text[] not null default '{REGISTERED}', "status" text not null default 'PENDING', "email_confirmed" boolean not null default false, "password_hash" varchar(255) not null, "created_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(`alter table "user" add constraint "user_roles_check" check ("roles" <@ array['POLICE'::text, 'CIVILIAN'::text, 'DISPATCH'::text, 'ADMIN'::text, 'SUPER_ADMIN'::text, 'REGISTERED'::text]);`);
    this.addSql(`alter table "user" add constraint "user_status_check" check ("status" in ('APPROVED', 'REJECTED', 'PENDING', 'SUSPENDED'));`);

    this.addSql(`create table "character" ("id" serial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "dob" date not null, "gender" text not null, "phone_number" varchar(255) null, "address" varchar(255) null, "has_gun_permit" boolean not null default false, "flags" text[] not null default '{}', "user_id" uuid not null, "driver_license_id" int null);`);
    this.addSql(`alter table "character" add constraint "character_driver_license_id_unique" unique ("driver_license_id");`);
    this.addSql(`alter table "character" add constraint "character_gender_check" check ("gender" in ('MALE', 'FEMALE'));`);
    this.addSql(`alter table "character" add constraint "character_flags_check" check ("flags" <@ array['MENTAL_HEALTH'::text, 'BOLO'::text, 'WARRANT'::text]);`);

    this.addSql(`create table "vehicle" ("id" serial primary key, "type" text not null, "license_plate" varchar(255) not null, "make" varchar(255) not null, "model" varchar(255) not null, "year" numeric(4,0) not null, "color" varchar(255) null, "flags" text[] not null default '{}', "owner_id" int not null);`);
    this.addSql(`alter table "vehicle" add constraint "vehicle_license_plate_unique" unique ("license_plate");`);
    this.addSql(`alter table "vehicle" add constraint "vehicle_type_check" check ("type" in ('SEDAN', 'COUPE', 'SUV', 'TRUCK', 'OFFROAD', 'MARINE', 'MOTORCYCLE', 'AIRCRAFT'));`);
    this.addSql(`alter table "vehicle" add constraint "vehicle_flags_check" check ("flags" <@ array['STOLEN'::text, 'IMPOUNDED'::text, 'BOLO'::text]);`);

    this.addSql(`create table "citation" ("id" serial primary key, "status" text not null default 'ACTIVE', "issued_character_id" int not null, "issued_vehicle_id" int null, "issued_by_id" uuid null, "issued_at" timestamptz not null);`);
    this.addSql(`alter table "citation" add constraint "citation_status_check" check ("status" in ('ACTIVE', 'INACTIVE', 'CLOSED'));`);

    this.addSql(`create table "charge" ("id" serial primary key, "amount" int not null, "reason" varchar(255) not null, "jail_time" varchar(255) null, "count" int not null default 1, "citation_id" int not null);`);

    this.addSql(`alter table "character" add constraint "character_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);
    this.addSql(`alter table "character" add constraint "character_driver_license_id_foreign" foreign key ("driver_license_id") references "driver_license" ("id") on delete set null;`);

    this.addSql(`alter table "vehicle" add constraint "vehicle_owner_id_foreign" foreign key ("owner_id") references "character" ("id") on delete cascade;`);

    this.addSql(`alter table "citation" add constraint "citation_issued_character_id_foreign" foreign key ("issued_character_id") references "character" ("id") on delete cascade;`);
    this.addSql(`alter table "citation" add constraint "citation_issued_vehicle_id_foreign" foreign key ("issued_vehicle_id") references "vehicle" ("id") on delete set null;`);
    this.addSql(`alter table "citation" add constraint "citation_issued_by_id_foreign" foreign key ("issued_by_id") references "user" ("id") on delete set null;`);

    this.addSql(`alter table "charge" add constraint "charge_citation_id_foreign" foreign key ("citation_id") references "citation" ("id") on delete cascade;`);
  }

}
