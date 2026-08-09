import { loginUserSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class LoginUserDto extends createZodDto(loginUserSchema) {}
