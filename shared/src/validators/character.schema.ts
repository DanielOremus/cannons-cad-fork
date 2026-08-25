import * as z from 'zod/v4';
import { CharacterFlag } from '../types/character/character.flag.js';
import { CharacterGender } from '../types/character/character.gender.js';

const flagsValidator = z.array(z.enum(CharacterFlag));

const nameValidator = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .refine((name) => /^[a-zA-Z]+$/.test(name), {
    params: {
      code: 'invalid_format',
      required: 'alphabetic',
    },
  })
  .transform((v) => {
    const sliced = v.slice(1);
    return v[0]?.toUpperCase() + sliced.toLowerCase();
  });

const dobValidator = z.string().superRefine((dob, ctx) => {
  const hasValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dob);
  if (!hasValidFormat) {
    ctx.addIssue({
      code: 'custom',
      params: {
        code: 'invalid_format',
        required: 'YYYY-MM-DD',
      },
    });
    return;
  }
  const dobDate = new Date(dob + 'T00:00:00.000Z');
  if (dobDate > new Date()) {
    ctx.addIssue({
      code: 'custom',
      params: {
        code: 'in_future',
      },
    });
  }
});

export const createCharacterSchema = z.object({
  firstName: nameValidator,
  lastName: nameValidator,
  dob: dobValidator,
  gender: z.enum(CharacterGender),
  phoneNumber: z.nullish(z.string().trim().min(5)),
  address: z.nullish(z.string().trim().min(5)),
  hasGunPermit: z.boolean().default(false),
  flags: flagsValidator.default([]),
});

export const searchCharacterSchema = z.object({
  firstName: nameValidator,
  lastName: nameValidator,
  dob: dobValidator,
});

export const updateCharacterSchema = createCharacterSchema
  .partial()
  .extend({ flags: flagsValidator.optional() })
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });
