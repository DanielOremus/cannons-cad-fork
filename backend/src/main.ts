import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import cookieParser from 'cookie-parser';
import { AppConfigService } from './core/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(AppConfigService);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser(config.cookieSecret));

  await app.listen(config.port);
}
bootstrap();
