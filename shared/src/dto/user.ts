import * as z from 'zod/v4';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateEmailSchema,
  confirmEmailSchema,
  privateUserResponseSchema,
  publicUserResponseSchema,
} from '../validators/user.schema.js';
import type { UserRole } from '../types/user/user.role.js';
import type { UserStatus } from '../types/user/user.status.js';

export type RegisterUserDto = z.infer<typeof registerSchema>;
export type LoginUserDto = z.infer<typeof loginSchema>;
export type UpdateSelfUserDto = z.infer<typeof updateEmailSchema>;
export type UpdateUserEmailDto = z.infer<typeof updateProfileSchema>;
export type ConfirmUserEmailDto = z.infer<typeof confirmEmailSchema>;

export type PrivateUserResponseDto = z.infer<typeof privateUserResponseSchema>;

export type PublicUserResponseDto = z.infer<typeof publicUserResponseSchema>;
