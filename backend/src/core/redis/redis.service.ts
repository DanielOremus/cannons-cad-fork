import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;
  constructor() {
    this.client = createClient();
  }
  async onModuleInit() {
    await this.client.connect();
  }
  onModuleDestroy() {
    this.client.destroy();
  }
}
