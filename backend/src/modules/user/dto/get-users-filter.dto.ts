import { getUsersQuerySchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class UsersFilterDto extends ZodDto(getUsersQuerySchema) {}
