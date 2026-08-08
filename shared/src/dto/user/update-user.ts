import * as z from 'zod/v4';
import { updateProfileSchema, updateEmailSchema } from '../../validators/user.schema.js';

export type UpdateUserEmailDto = z.infer<typeof updateEmailSchema>;
export type UpdateUserDto = z.infer<typeof updateProfileSchema>;
