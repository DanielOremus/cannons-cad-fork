import * as z from 'zod/v4';

const nameValidator = z
  .string()
  .min(3)
  .regex(/^[a-zA-Z0-9]+$/, { error: 'Can only contain letters and numbers' });
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
// .refine((data) => data.password === data.confirmPassword, {
//   message: 'The passwords do not match',
//   params: {
//     code: 'not_same_as',
//     field: 'password',
//   },
//   path: ['confirmPassword'],
// })
// .transform((data) => {
//   const { confirmPassword, ...rest } = data;
//   return rest;
// });

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
