import * as z from "zod/v4"
import { CharacterFlag, Gender } from "../types/character.js"

const nameValidator = z
  .string()
  .trim()
  .min(3)
  .transform((v) => {
    const sliced = v.slice(1)
    return v[0]?.toUpperCase() + sliced.toLowerCase()
  })

const dobValidator = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format")
  .transform((v) => new Date(v + "T00:00:00.000Z"))
  .refine((v) => v <= new Date(), "Cannot be in the future")

export const characterCreateSchema = z.object({
  firstName: nameValidator,
  lastName: nameValidator,
  dob: dobValidator,
  gender: z.enum(Gender),
  idNumber: z
    .string()
    .trim()
    .length(5)
    .regex(/^[a-zA-Z0-9]+$/, {
      error: "Must contain only numbers and letters",
    })
    .transform((v) => v.toUpperCase()),
  phoneNumber: z.nullish(z.string().trim().min(5)),
  address: z.nullish(z.string().trim().min(5)),
  hasGunPermit: z.boolean().default(false),
  flags: z.array(z.enum(CharacterFlag)).default([]),
})

export const characterSearchSchema = z.object({
  firstName: nameValidator,
  lastName: nameValidator,
  dob: dobValidator,
})
