import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import type { AuthUser } from '../../shared/types/user.js';
import { UnitService } from './unit.service.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { createUnitSchema, type PermissionMeta } from '@project/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { UnitsFilterDto } from './dto/get-units-filter.dto.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';

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
    // return await this.unitMemberService.findOwn(user.id);
  }
  @Post('/create')
  @RequirePermission('unit', 'create')
  async create(
    @Body(new ZodValidationPipe(createUnitSchema)) dto: CreateUnitDto,
    @GetAuthUser() user: AuthUser,
  ) {
    return await this.unitService.create(dto, user);
  }
  @Post('/:id/join')
  //   @RequirePermission('')
  async join() {}
}
