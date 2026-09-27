import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { AppConfigService } from './core/config/config.service.js';
import { setupApp } from './app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await setupApp(app);

  const config = app.get(AppConfigService);
  if (config.env === 'production') app.set('trust proxy', 1);

  await app.listen(config.port);
}
bootstrap();
