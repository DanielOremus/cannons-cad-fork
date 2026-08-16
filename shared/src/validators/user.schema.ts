import * as z from 'zod/v4';

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

export const updateProfileSchema = z.object({
  name: nameValidator,
});

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
