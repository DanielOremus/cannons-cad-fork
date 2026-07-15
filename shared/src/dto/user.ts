import * as z from "zod/v4"
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateEmailSchema,
  confirmEmailSchema,
} from "../validators/user.schema.js"
import type { UserRole, UserStatus } from "../types/user.js"

export type RegisterUserDto = z.infer<typeof registerSchema>
export type LoginUserDto = z.infer<typeof loginSchema>
export type UpdateSelfUserDto = z.infer<typeof updateEmailSchema>
export type UpdateUserEmailDto = z.infer<typeof updateProfileSchema>
export type ConfirmUserEmailDto = z.infer<typeof confirmEmailSchema>

export type MyProfileDto = UserProfileDto & { email: string }

export type UserProfileDto = {
  name: string
  status: UserStatus
  createdAt: string
  role: UserRole
}
