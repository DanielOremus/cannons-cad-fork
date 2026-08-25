import { createCitationSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateCitationDto extends createZodDto(createCitationSchema) {}
