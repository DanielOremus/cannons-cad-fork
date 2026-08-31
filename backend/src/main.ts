import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import cookieParser from 'cookie-parser';
import { AppConfigService } from './core/config/config.service';
import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/postgresql';
import { SocketIoAdapter } from './common/adapters/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(AppConfigService);
  const orm = app.get(MikroORM);

  app.use(cookieParser(config.cookieSecret));
  app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(orm.em, next);
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  if (config.env === 'production') app.set('trust proxy', 1);

  await app.listen(config.port);
}
bootstrap();
