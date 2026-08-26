import { updateCitationSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class UpdateCitationDto extends ZodDto(updateCitationSchema) {}
