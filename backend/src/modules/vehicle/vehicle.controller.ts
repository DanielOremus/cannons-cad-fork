import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Get,
  Req,
  UseGuards,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { type Request } from 'express';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { SearchVehicleDto } from './dto/search-vehicle.dto';

@Controller('/vehicles')
@UseGuards(AuthGuard, PermissionsGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/search')
  @RequirePermission('vehicle', 'search')
  async search(@Query(new ZodValidationPipe(SearchVehicleDto.schema)) query: SearchVehicleDto) {
    return await this.vehicleService.search(query.plate);
  }
  @Post('/create')
  @RequirePermission('vehicle', 'create')
  @HttpCode(201)
  async create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(CreateVehicleDto.schema)) dto: CreateVehicleDto,
  ) {
    return await this.vehicleService.create(dto, req.user!.id, req.permissionScope!);
  }
  @Patch('/:id')
  @RequirePermission('vehicle', 'update')
  @HttpCode(204)
  async update(
    @Req() req: Request,
    @Param('id', new IdParamPipe()) id: number,
    @Body(new ZodValidationPipe(UpdateVehicleDto.schema)) dto: UpdateVehicleDto,
  ) {
    await this.vehicleService.update(id, dto, req.user!.id, req.permissionScope!);
  }
  @Delete('/:id')
  @RequirePermission('vehicle', 'delete')
  @HttpCode(204)
  async delete(@Req() req: Request, @Param('id', new IdParamPipe()) id: number) {
    await this.vehicleService.delete(id, req.user!.id, req.permissionScope!);
  }
}
