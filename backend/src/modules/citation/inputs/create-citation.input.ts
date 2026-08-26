import { CharacterEntity } from '../../character/entities/character.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { VehicleEntity } from '../../vehicle/entities/vehicle.entity';
import { CreateCitationDto } from '../dto/create-citation.dto';
import { CitationEntity } from '../entities/citation.entity';

export type CreateCitationInput = Omit<
  CreateCitationDto,
  'issuedCharacterId' | 'issuedVehicleId'
> & {
  issuedCharacter: CitationEntity['issuedCharacter'] | CharacterEntity['id'];
  issuedVehicle: CitationEntity['issuedVehicle'] | VehicleEntity['id'];
  issuedBy: UserEntity['id'];
};
