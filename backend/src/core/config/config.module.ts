import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { AppConfigService } from './config.service';
import { validate } from './config.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validate,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
