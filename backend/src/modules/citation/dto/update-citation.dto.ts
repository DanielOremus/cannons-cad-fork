import { updateCitationSchema } from '@project/shared/src/validators/citation.schema';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class UpdateCitationDto extends ZodDto(updateCitationSchema) {}
