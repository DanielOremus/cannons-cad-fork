export const UserStatus = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export const UserRole = ["police", "dispatch", "civilian", "admin", "registered"] as const
export type UserRole = (typeof UserRole)[number]

export const PermissionResource = ["user", "vehicle", "character"] as const
export type PermissionResource = (typeof PermissionResource)[number]

export const PermissionAction = [
  "create",
  "read",
  "read-own",
  "update",
  "update-own",
  "delete",
  "delete-own",
] as const
export type PermissionAction = (typeof PermissionAction)[number]

export type Permission = `${PermissionResource}:${PermissionAction}`

export const RolePermissions = {
  admin: [],
  civilian: [
    "character:create",
    "character:read-own",
    "character:update-own",
    "character:delete-own",
  ],
  dispatch: [],
  police: [],
  registered: [],
} as const satisfies Record<UserRole, Permission[]>
