import { PaginatedList, PaginationDto, PermissionScope } from '@project/shared';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleRepository } from './vehicle.repository';
import { Injectable } from '@nestjs/common';
import { CharacterRepository } from '../character/character.repository';
import { NotFoundError } from '../../shared/errors/app.error';
import { VehicleMapper } from './vehicle.mapper';
import { VehicleDto } from './dto/get-vehicle.dto';
import { UnitOfWork } from '../../core/database/unit-of-work';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { OwnershipService } from '../../shared/modules/ownership/ownership.service';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly characterRepository: CharacterRepository,
    private readonly vehicleMapper: VehicleMapper,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
  ) {}
  async search(licensePlate: string) {
    const vehicle = await this.vehicleRepository.findByLicensePlate(licensePlate, ['owner']);
    if (!vehicle) throw new NotFoundError('Vehicle');

    return this.vehicleMapper.toReadDto(vehicle);
  }
  async findManyByOwner(
    ownerId: number,
    pagination: PaginationDto,
  ): Promise<PaginatedList<VehicleDto>> {
    const result = await this.vehicleRepository.findByCharacter(ownerId, pagination);

    return {
      limit: pagination.limit,
      page: pagination.page,
      items: this.vehicleMapper.toDtoList(result.items),
      total: result.total,
    };
  }
  async create(dto: CreateVehicleDto, userId: string, scope: PermissionScope): Promise<VehicleDto> {
    const character = await this.characterRepository.findById(dto.characterId);
    if (!character) throw new NotFoundError('Character');
    this.ownershipService.checkCharacter(character, userId, scope);

    const { characterId: owner, ...rest } = dto;
    const vehicle = await this.vehicleRepository.create({ owner, ...rest });
    await this.uow.saveChanges();

    return this.vehicleMapper.toReadDto(vehicle);
  }
  async update(vehicleId: number, dto: UpdateVehicleDto, userId: string, scope: PermissionScope) {
    const vehicle = await this.vehicleRepository.findById(vehicleId, ['owner']);
    if (!vehicle) throw new NotFoundError('Vehicle');

    this.ownershipService.checkVehicle(vehicle, userId, scope);
    await this.vehicleRepository.update(vehicle, dto);
    await this.uow.saveChanges();
  }
  async delete(vehicleId: number, userId: string, scope: PermissionScope) {
    const vehicle = await this.vehicleRepository.findById(vehicleId, ['owner']);
    if (!vehicle) throw new NotFoundError('Vehicle');

    this.ownershipService.checkVehicle(vehicle, userId, scope);
    await this.vehicleRepository.delete(vehicle);
    await this.uow.saveChanges();
  }
}
