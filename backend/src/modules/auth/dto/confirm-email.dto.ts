import { confirmEmailSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class ConfirmEmailDto extends ZodDto(confirmEmailSchema) {}
