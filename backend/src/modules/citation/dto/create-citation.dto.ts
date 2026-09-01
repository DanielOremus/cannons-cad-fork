import { createCitationSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class CreateCitationDto extends ZodDto(createCitationSchema) {}
