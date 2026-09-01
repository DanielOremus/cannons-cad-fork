import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config.validation.js';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<Config, true>) {}
  get database() {
    return this.configService.get('database', { infer: true });
  }
  get redis() {
    return this.configService.get('redis', { infer: true });
  }
  get mailer() {
    return this.configService.get('mailer', { infer: true });
  }
  get jwt() {
    return this.configService.get('jwt', { infer: true });
  }
  get email() {
    return this.configService.get('email', { infer: true });
  }
  get port() {
    return this.configService.get('port', { infer: true });
  }
  get env() {
    return this.configService.get('env', { infer: true });
  }
  get cookieSecret() {
    return this.configService.get('cookieSecret', { infer: true });
  }
  get turnstile() {
    const turnstile = this.configService.get('turnstile', { infer: true });
    if (this.env !== 'production') turnstile.secret = '1x0000000000000000000000000000000AA';
    return turnstile;
  }
}
