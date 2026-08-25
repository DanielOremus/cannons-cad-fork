import { CreateCitationDto } from '../dto/create-citation.dto';
import { CitationEntity } from '../entities/citation.entity';

export type CreateCitationInput = Omit<
  CreateCitationDto,
  'issuedCharacterId' | 'issuedVehicleId'
> & {
  issuedCharacter: CitationEntity['issuedCharacter'];
  issuedVehicle: CitationEntity['issuedVehicle'];
};
