import { ZodDto } from '../../../shared/dto/zod.dto.js';
import { createUnitMemberSchema } from '@project/shared';

export class CreateUnitMemberDto extends ZodDto(createUnitMemberSchema) {}
