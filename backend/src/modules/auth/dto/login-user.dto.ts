import { loginUserSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class LoginUserDto extends ZodDto(loginUserSchema) {}
