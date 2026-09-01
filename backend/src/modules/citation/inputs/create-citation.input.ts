import { CharacterEntity } from '../../character/entities/character.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { VehicleEntity } from '../../vehicle/entities/vehicle.entity.js';
import { CreateCitationDto } from '../dto/create-citation.dto.js';
import { CitationEntity } from '../entities/citation.entity.js';

export type CreateCitationInput = Omit<
  CreateCitationDto,
  'issuedCharacterId' | 'issuedVehicleId'
> & {
  issuedCharacter: CitationEntity['issuedCharacter'] | CharacterEntity['id'];
  issuedVehicle: CitationEntity['issuedVehicle'] | VehicleEntity['id'];
  issuedBy: UserEntity['id'];
};
