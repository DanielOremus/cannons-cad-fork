import { Body, Controller, HttpCode, Param, Post, Get, Query, Delete, Patch } from '@nestjs/common';
import { VehicleService } from './vehicle.service.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { SearchVehicleDto } from './dto/search-vehicle.dto.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import { type AuthUser } from '../../shared/types/user.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { type PermissionMeta } from '@project/shared';

@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/search')
  @RequirePermission('vehicle', 'read')
  async search(
    @Query(new ZodValidationPipe(SearchVehicleDto.schema)) query: SearchVehicleDto,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.vehicleService.search(query.plate, permissionMeta);
  }
  @Post('/create')
  @RequirePermission('vehicle', 'create')
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(CreateVehicleDto.schema)) dto: CreateVehicleDto,
    @GetAuthUser() user: AuthUser,
  ) {
    return await this.vehicleService.create(dto, user.id);
  }
  @Patch('/:id')
  @RequirePermission('vehicle', 'update')
  @HttpCode(204)
  async update(
    @Param('id', new IdParamPipe()) id: number,
    @Body(new ZodValidationPipe(UpdateVehicleDto.schema)) dto: UpdateVehicleDto,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    await this.vehicleService.update(id, dto, user.id, permissionMeta);
  }
  @Delete('/:id')
  @RequirePermission('vehicle', 'delete')
  @HttpCode(204)
  async delete(
    @Param('id', new IdParamPipe()) id: number,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    await this.vehicleService.delete(id, user.id, permissionMeta);
  }
}
