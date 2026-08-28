import * as z from 'zod/v4';
import { UserStatus } from '../types/user/user.status.js';
import { UserRole } from '../types/user/user.role.js';
import { paginationSchema } from './pagination.schema.js';
import { SortOrder } from '../types/sort.order.js';
import { UserSortOption } from '../types/user/user.sort-option.js';

const nameValidator = z
  .string()
  .min(3)
  .max(20)
  .refine((name) => /^[a-zA-Z0-9]+$/.test(name), {
    params: {
      code: 'invalid_format',
      required: 'alphanumeric',
    },
  });
const captchaValidator = z.string().trim().nonempty().max(2048, 'Captcha token is invalid');

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().trim().nonempty(),
  captchaToken: captchaValidator,
});

export const registerUserSchema = z.object({
  email: z.email().toLowerCase(),
  name: nameValidator,
  password: z.string().regex(/^\S*$/, 'Must not contain spaces').min(4),
  confirmPassword: z.string(),
  captchaToken: captchaValidator,
});

export const getUsersQuerySchema = paginationSchema.extend({
  status: z.enum(UserStatus).optional(),
  sortBy: z.enum(UserSortOption).default('createdAt'),
  sortOrder: z.enum(SortOrder).default('desc'),
});

export const updateProfileSchema = z.object({
  name: nameValidator,
});

export const updateUserSchema = z
  .object({
    status: z.enum(UserStatus),
    roles: z.array(z.enum(UserRole)),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });

export const updateEmailSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().trim().nonempty(),
});
export const confirmEmailSchema = z.object({
  code: z.string().refine((code) => /^\d{6}$/.test(code), {
    params: {
      code: 'invalid_format',
    },
  }),
});
