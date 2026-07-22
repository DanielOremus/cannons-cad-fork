import { confirmEmailSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class ConfirmEmailDto extends createZodDto(confirmEmailSchema) {}
