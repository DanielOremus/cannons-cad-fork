import { Body, Controller, Get, HttpCode, Param, Post, Patch } from '@nestjs/common';
import { IncidentService } from './incident.service.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { type AuthUser } from '../../shared/types/user.js';
import { type PermissionMeta } from '@project/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';

@Controller('/incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get('/')
  @RequirePermission('incident', 'read')
  async getList(@GetPermissionMeta() permissionMeta: PermissionMeta) {
    return await this.incidentService.getList(permissionMeta);
  }

  @Post('/create')
  @RequirePermission('incident', 'create')
  @HttpCode(201)
  async create(@Body(new ZodValidationPipe(CreateIncidentDto.schema)) dto: CreateIncidentDto) {
    return await this.incidentService.create(dto);
  }

  @Patch('/:id')
  @RequirePermission('incident', 'update')
  async update(
    @Param('id', IdParamPipe) id: number,
    @Body(new ZodValidationPipe(UpdateIncidentDto.schema)) dto: UpdateIncidentDto,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.incidentService.update(id, dto, permissionMeta);
  }
  @Patch('/:id/add-note')
  @RequirePermission('incident', 'update')
  async addNote(
    @Param('id', IdParamPipe) id: number,
    @Body(new ZodValidationPipe(UpdateIncidentDto.schema)) dto: UpdateIncidentDto,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {}
}
