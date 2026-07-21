import { Inject, Injectable } from '@nestjs/common';
import { registerConfig } from './config';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject(registerConfig.KEY)
    private readonly config: ConfigType<typeof registerConfig>,
  ) {}
  get database() {
    return this.config.database;
  }
  get redis() {
    return this.config.redis;
  }
  get mailer() {
    return this.config.mailer;
  }
  get jwt() {
    return this.config.jwt;
  }
  get port() {
    return this.config.port;
  }
  get env() {
    return this.config.env;
  }
  get cookieSecret() {
    return this.config.cookieSecret;
  }
}
