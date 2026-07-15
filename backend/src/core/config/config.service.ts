import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '../../shared/types/token';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port() {
    return this.configService.get<number>('app.port');
  }
  get env() {
    return this.configService.get<string>('app.env');
  }
  get jwtAccessSecret() {
    return this.configService.get<string>('app.jwt.accessSecret')!;
  }

  get jwtRefreshSecret() {
    return this.configService.get<string>('app.jwt.refreshSecret')!;
  }

  get accessTtl() {
    return this.configService.get<number>('app.jwt.accessTtl')!;
  }

  get refreshTtl() {
    return this.configService.get<number>('app.jwt.refreshTtl')!;
  }

  get databaseUrl() {
    return this.configService.get<string>('app.database.url')!;
  }
  get redisHost() {
    return this.configService.get<string>('app.redis.host')!;
  }
  get redisPort() {
    return this.configService.get<number>('app.redis.port')!;
  }
  get redisUser() {
    return this.configService.get<string>('app.redis.user')!;
  }
  get redisPassword() {
    return this.configService.get<string>('app.redis.password')!;
  }
  jwt(type: TokenType) {
    return this.configService.get<{ secret: string; ttl: number }>(
      `app.jwt.${type}`,
    )!;
  }
}
