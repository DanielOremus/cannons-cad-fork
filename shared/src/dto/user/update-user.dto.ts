import * as z from 'zod/v4';
import {
  updateProfileSchema,
  updateEmailSchema,
  updateUserSchema,
} from '../../validators/user.schema.js';

export type UpdateUserEmailDto = z.infer<typeof updateEmailSchema>;
export type UpdateUserProfileDto = z.infer<typeof updateProfileSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
