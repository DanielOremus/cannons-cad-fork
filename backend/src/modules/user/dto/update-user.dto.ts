import { updateUserSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class UpdateUserDto extends ZodDto(updateUserSchema) {}
