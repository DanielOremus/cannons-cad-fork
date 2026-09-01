import { registerUserSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class RegisterUserDto extends ZodDto(registerUserSchema) {}
