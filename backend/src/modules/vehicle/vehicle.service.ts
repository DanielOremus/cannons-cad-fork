import { PaginatedList, PaginationDto, PermissionMeta } from '@project/shared';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { VehicleRepository } from './vehicle.repository.js';
import { Injectable } from '@nestjs/common';
import { CharacterRepository } from '../character/character.repository.js';
import { ForbiddenError, NotFoundError } from '../../shared/errors/app.error.js';
import { VehicleMapper } from './vehicle.mapper.js';
import { VehicleDto } from './dto/get-vehicle.dto.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { OwnershipService } from '../../shared/modules/ownership/ownership.service.js';
import { getScopesOrThrow } from '../../shared/utils/permission.helpers.js';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly characterRepository: CharacterRepository,
    private readonly vehicleMapper: VehicleMapper,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
  ) {}
  async search(licensePlate: string, permissionMeta: PermissionMeta) {
    const vehicle = await this.vehicleRepository.findByLicensePlate(licensePlate, ['owner']);
    if (!vehicle) throw new NotFoundError('Vehicle');

    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) throw new ForbiddenError();

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
  async create(dto: CreateVehicleDto, userId: string): Promise<VehicleDto> {
    const character = await this.characterRepository.findById(dto.characterId);
    if (!character) throw new NotFoundError('Character');
    //Owns character (only own)
    this.ownershipService.checkCharacter(character, userId);

    const { characterId: owner, ...rest } = dto;
    const vehicle = await this.vehicleRepository.create({ owner, ...rest });
    await this.uow.saveChanges();

    return this.vehicleMapper.toReadDto(vehicle);
  }
  async update(
    vehicleId: number,
    dto: UpdateVehicleDto,
    userId: string,
    permissionMeta: PermissionMeta,
  ) {
    const vehicle = await this.vehicleRepository.findById(vehicleId, ['owner']);
    if (!vehicle) throw new NotFoundError('Vehicle');

    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) this.ownershipService.checkVehicle(vehicle, userId);

    await this.vehicleRepository.update(vehicle, dto);
    await this.uow.saveChanges();
  }
  async delete(vehicleId: number, userId: string, permissionMeta: PermissionMeta) {
    const vehicle = await this.vehicleRepository.findById(vehicleId, ['owner']);
    if (!vehicle) throw new NotFoundError('Vehicle');

    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) this.ownershipService.checkVehicle(vehicle, userId);

    await this.vehicleRepository.delete(vehicle);
    await this.uow.saveChanges();
  }
}
