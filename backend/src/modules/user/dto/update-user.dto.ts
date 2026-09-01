import { updateUserSchema } from '@project/shared';
import { updateProfileSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UpdateUserDto extends ZodDto(updateUserSchema) {}
export class UpdateProfileDto extends ZodDto(updateProfileSchema) {}
