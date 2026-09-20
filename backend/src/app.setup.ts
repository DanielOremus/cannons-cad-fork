import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from './core/config/config.service.js';
import { MikroORM, RequestContext } from '@mikro-orm/postgresql';
import { NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { SocketIoAdapter } from './core/socket/socket-io.adapter.js';

export async function setupApp(app: NestExpressApplication) {
  const config = app.get(AppConfigService);
  const orm = app.get(MikroORM);

  app.use(cookieParser(config.cookieSecret));
  app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(orm.em, next);
  });
  app.enableCors({
    origin: config.allowedOrigins,
    credentials: true,
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  return app;
}
