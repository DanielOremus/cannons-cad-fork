import { updateUnitMemberSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UpdateUnitMemberDto extends ZodDto(updateUnitMemberSchema) {}
