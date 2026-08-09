import { registerUserSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class RegisterUserDto extends createZodDto(registerUserSchema) {}
