import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('AppCore');
  constructor(private readonly orm: MikroORM) {}
  async onModuleInit() {
    try {
      await this.orm.checkConnection();
      this.logger.log('Db connected successfully');
    } catch (error) {
      this.logger.log('Db connection failed: ' + error);
    }
  }
  async onModuleDestroy() {
    await this.orm.close();
  }
}
