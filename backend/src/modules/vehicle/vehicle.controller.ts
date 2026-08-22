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
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { type Request } from 'express';
import { licensePlateValidator } from '@project/shared';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe';

@Controller('/vehicles')
@UseGuards(AuthGuard, PermissionsGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/create')
  @RequirePermission('vehicle', 'create')
  @HttpCode(201)
  async create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(CreateVehicleDto.schema)) dto: CreateVehicleDto,
  ) {
    return await this.vehicleService.create(req.user!.id, req.permissionScope!, dto);
  }
  @Get('/search')
  @RequirePermission('vehicle', 'search')
  async search(@Query('plate', new ZodValidationPipe(licensePlateValidator)) plate: string) {
    return await this.vehicleService.search(plate);
  }
  @Delete('/:id')
  @RequirePermission('vehicle', 'delete')
  @HttpCode(204)
  async delete(@Req() req: Request, @Param('id', new IdParamPipe()) id: number) {
    await this.vehicleService.delete(id, req.user!.id, req.permissionScope!);
  }
}
