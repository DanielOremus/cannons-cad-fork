import { getUsersQuerySchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UsersFilterDto extends ZodDto(getUsersQuerySchema) {}
