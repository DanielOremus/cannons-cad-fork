import { CharacterEntity } from '../../character/entities/character.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

export type CreateVehicleInput = Omit<CreateVehicleDto, 'characterId'> & {
  owner: CharacterEntity['id'];
};
