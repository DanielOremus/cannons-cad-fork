//Types
export { UserRole } from './types/user/user.role.js';
export { UserStatus } from './types/user/user.status.js';
export { ErrorCode } from './types/error/error.code.js';
export { CharacterGender } from './types/character/character.gender.js';
export { CharacterFlag } from './types/character/character.flag.js';
export { VehicleFlag } from './types/vehicle/vehicle.flag.js';
export { VehicleType } from './types/vehicle/vehicle.type.js';
export { DriverCategory } from './types/driver.category.js';
export { PermissionAction } from './types/permission/permission.action.js';
export { PermissionResource } from './types/permission/permission.resource.js';
export { PermissionScope } from './types/permission/permission.scope.js';
export { type ValidationIssue } from './types/error/validation.error.js';
export {
  type Permission,
  ResourceActions,
  type ResourceAction,
  type RequiredPermission,
} from './types/permission/index.js';

//Dto
export type { PaginationDto, PaginationRequest } from './dto/pagination.js';

export { PublicUserResponseDto, PrivateUserResponseDto } from './dto/user/get-user.js';
export type { LoginUserDto, RegisterUserDto, ConfirmUserEmailDto } from './dto/user/auth-user.js';
export type { UpdateUserDto, UpdateUserEmailDto } from './dto/user/update-user.js';

export type { CreateCharacterDto } from './dto/character/create-character.js';
export type {
  SearchCharacterDto,
  SearchCharacterResponseDto,
} from './dto/character/search-character.js';

//Validation schemas

export { createCharacterSchema, searchCharacterSchema } from './validators/character.schema.js';

export { paginationSchema } from './validators/pagination.schema.js';

export {
  registerUserSchema,
  loginUserSchema,
  updateProfileSchema,
  updateEmailSchema,
  confirmEmailSchema,
} from './validators/user.schema.js';

//Utils

export {
  hasPermission,
  hasPermissionFromSet,
  hasPermissionFromRoles,
  getPermissionsFromRoles,
  accountActive,
} from './utils/auth.helpers.js';
export { mapZodIssue } from './utils/validation.helpers.js';
export { nameof } from './utils/object.helpers.js';
