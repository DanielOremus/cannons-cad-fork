import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { registerConfig } from './config';
import { AppConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env.dev',
      load: [registerConfig],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
