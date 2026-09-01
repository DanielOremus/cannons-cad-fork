import { loginUserSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class LoginUserDto extends ZodDto(loginUserSchema) {}
