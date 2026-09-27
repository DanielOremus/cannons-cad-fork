import { Global, Module } from '@nestjs/common';
import { SocketSessionService } from './socket-session.service.js';
import { RedisModule } from '../redis/redis.module.js';
import { DebugGateway } from './debug.gateway.js';

@Global()
@Module({
  imports: [RedisModule],
  providers: [SocketSessionService, DebugGateway],
  exports: [SocketSessionService],
})
export class SocketModule {}
