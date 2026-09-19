import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import type { AuthUser } from '../../shared/types/user.js';
import { UnitService } from './unit.service.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { type PermissionMeta } from '@project/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { UnitsFilterDto } from './dto/get-units-filter.dto.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe.js';

@Controller('/units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}
  @Get('/')
  @RequirePermission('unit', 'read')
  async getList(
    @Query(new ZodValidationPipe(UnitsFilterDto.schema)) query: UnitsFilterDto,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.unitService.getList(query, permissionMeta);
  }
  @Post('/create')
  @HttpCode(201)
  @RequirePermission('unit', 'create')
  async create(
    @Body(new ZodValidationPipe(CreateUnitDto.schema)) dto: CreateUnitDto,
    @GetAuthUser() user: AuthUser,
  ) {
    return await this.unitService.create(dto, user);
  }
  @Patch('/:id')
  @HttpCode(204)
  @RequirePermission('unit', 'update')
  async update(
    @Param('id', IdParamPipe) unitId: number,
    @Body(new ZodValidationPipe(UpdateUnitDto.schema))
    dto: UpdateUnitDto,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.unitService.update(dto, unitId, user.id, permissionMeta);
  }
  @Post('/leave')
  @HttpCode(204)
  @RequirePermission('duty', 'end')
  async leave(@GetAuthUser() user: AuthUser) {
    await this.unitService.leave(user.id);
  }
}
