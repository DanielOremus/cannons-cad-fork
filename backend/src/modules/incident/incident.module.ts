import { Module } from '@nestjs/common';
import { IncidentRepository } from './incident.repository.js';
import { OrmIncidentRepository } from './infrastructure/orm.incident.repository.js';
import { IncidentService } from './incident.service.js';
import { IncidentController } from './incident.controller.js';
import { IncidentMapper } from './incident.mapper.js';
import { IncidentGateway } from './incident.gateway.js';

@Module({
  controllers: [IncidentController],
  providers: [
    {
      provide: IncidentRepository,
      useClass: OrmIncidentRepository,
    },
    IncidentService,
    IncidentMapper,
    IncidentGateway,
  ],
})
export class IncidentModule {}
