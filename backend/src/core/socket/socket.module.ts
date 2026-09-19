import { Global, Module } from '@nestjs/common';
import { SocketSessionService } from './socket-session.service.js';
import { RedisModule } from '../redis/redis.module.js';

@Global()
@Module({
  imports: [RedisModule],
  providers: [SocketSessionService],
  exports: [SocketSessionService],
})
export class SocketModule {}
