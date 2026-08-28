import { updateProfileSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class UpdateProfileDto extends ZodDto(updateProfileSchema) {}
