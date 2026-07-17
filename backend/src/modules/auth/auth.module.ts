import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../../core/redis/redis.module';
import { AuthController } from './auth.controller';
import { TokenModule } from '../../shared/modules/token/token.module';

@Module({
  imports: [UserModule, RedisModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
