import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, type RedisClientType } from 'redis';
import { AppConfigService } from '../config/config.service.js';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public readonly client: RedisClientType;
  private readonly logger = new Logger('AppCore');
  constructor(private readonly config: AppConfigService) {
    this.client = createClient({
      username: config.redis.user,
      password: config.redis.password,
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Redis connected successfully');
    } catch (error) {
      this.logger.error('Redis connection failed: ' + error);
    }
  }
  onModuleDestroy() {
    this.client.destroy();
  }
}
