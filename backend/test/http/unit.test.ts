import { INestApplication } from '@nestjs/common';
import { app, factory } from '../setup/global.setup.js';
import request from 'supertest';
import { DutyType } from '@project/shared';

describe('POST /units/create', () => {
  it('returns 201, when unit created', async () => {
    // const member = await factory.unit.create(DutyType.)
    // const unit = await request(app.getHttpServer()).post()
  });
});
