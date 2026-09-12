import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class SocketSessionService {
  private userSocketKey(userId: string) {
    return `socket:${userId}`;
  }
  constructor(private readonly redis: RedisService) {}
  async setUserSocket(userId: string, socketId: string) {
    await this.redis.client.set(this.userSocketKey(userId), socketId);
  }
  async getUserSocket(userId: string) {
    return await this.redis.client.get(this.userSocketKey(userId));
  }
}
