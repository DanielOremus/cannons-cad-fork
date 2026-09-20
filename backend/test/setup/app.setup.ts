import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../../src/app.module.js';
import { setupApp } from '../../src/app.setup.js';

export async function createTestApp(port = 3001) {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();

  const app = module.createNestApplication<NestExpressApplication>();
  await setupApp(app);

  await app.listen(port);

  return app;
}
