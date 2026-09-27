import { INestApplication } from '@nestjs/common';
import { TestFactory } from '../factories/index.factory.js';
import { createTestApp } from './app.setup.js';

export let app: INestApplication;
export let factory: TestFactory;

beforeAll(async () => {
  app = await createTestApp();
  factory = new TestFactory(app);
});

beforeEach(async () => {
  await factory.clearDatabase();
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});
