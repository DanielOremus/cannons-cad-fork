import * as z from 'zod/v4';
import {
  registerUserSchema,
  loginUserSchema,
  confirmEmailSchema,
} from '../../validators/user.schema.js';

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type ConfirmUserEmailDto = z.infer<typeof confirmEmailSchema>;
