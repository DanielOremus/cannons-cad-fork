import * as z from 'zod/v4';
import { UserStatus } from '../types/user/user.status.js';
import { UserRole } from '../types/user/user.role.js';

const nameValidator = z
  .string()
  .min(3)
  .regex(/^[a-zA-Z]$/, { error: 'Can only contain letters and numbers' });
const captchaValidator = z.string().trim().nonempty().max(2048, 'Captcha token is invalid');

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().trim().nonempty(),
  captchaToken: captchaValidator,
});

export const registerSchema = z
  .object({
    email: z.email().toLowerCase(),
    name: nameValidator,
    password: z.string().regex(/^\S*$/, 'Must not contain spaces').min(4),
    confirmPassword: z.string(),
    captchaToken: captchaValidator,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'The passwords do not match',
    path: ['confirmPassword'],
  })
  .transform((data) => {
    const { confirmPassword, ...rest } = data;
    return rest;
  });

export const updateProfileSchema = z.object({
  name: nameValidator,
});

export const updateEmailSchema = z.object({
  email: z.email().toLowerCase,
  password: z.string().trim().nonempty(),
});
export const confirmEmailSchema = z.object({
  code: z.string().regex(/^\d{6}$/, { error: 'Invalid code format' }),
});

export const publicUserResponseSchema = z.object({
  name: z.string(),
  roles: z.array(z.enum(UserRole)),
  status: z.enum(UserStatus),
  createdAt: z.string(),
});

export const privateUserResponseSchema = publicUserResponseSchema.extend({
  email: z.email(),
  emailConfirmed: z.boolean(),
});
