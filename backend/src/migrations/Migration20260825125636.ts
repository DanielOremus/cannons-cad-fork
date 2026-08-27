import { Migration } from '@mikro-orm/migrations';

export class Migration20260825125636 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`select 1`);
  }

  override down(): void | Promise<void> {
    this.addSql(`select 1`);
  }

}
