import { confirmEmailSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class ConfirmEmailDto extends ZodDto(confirmEmailSchema) {}
