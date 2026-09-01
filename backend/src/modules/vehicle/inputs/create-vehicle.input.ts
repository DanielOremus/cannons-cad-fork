import { CharacterEntity } from '../../character/entities/character.entity.js';
import { CreateVehicleDto } from '../dto/create-vehicle.dto.js';

export type CreateVehicleInput = Omit<CreateVehicleDto, 'characterId'> & {
  owner: CharacterEntity['id'];
};
