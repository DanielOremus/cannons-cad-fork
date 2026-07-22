import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('AppCore');
  constructor(private readonly config: AppConfigService) {
    const adapter = new PrismaPg({ connectionString: config.database.url });
    super({ adapter });
    // super.$extends()
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Db connected successfully');
    } catch (error) {
      this.logger.log('Db connection failed: ' + error);
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
