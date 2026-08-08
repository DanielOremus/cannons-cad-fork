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
export type { PaginationDto, PaginationRequest, PaginatedList } from './dto/pagination.js';

export type { PublicUserResponseDto, PrivateUserResponseDto } from './dto/user/get-user.dto.js';
export type {
  LoginUserDto,
  RegisterUserDto,
  ConfirmUserEmailDto,
} from './dto/user/auth-user.dto.js';
export type { UpdateUserDto, UpdateUserEmailDto } from './dto/user/update-user.dto.js';

export type {
  CreateCharacterDto,
  CreateCharacterResponseDto,
} from './dto/character/create-character.dto.js';
export type {
  SearchCharacterDto,
  SearchCharacterResponseDto,
} from './dto/character/search-character.dto.js';
export { type CharacterDto } from './dto/character/get-character.dto.js';
export { type VehicleDto } from './dto/vehicle/get-vehicle.dto.js';
export { type DriverLicenseDto } from './dto/driver-license/get-driver-license.dto.js';
export type { ChargeDto, CitationDto } from './dto/citation/get-citation.dto.js';

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

export { idValidator, uuidValidator } from './validators/common.schema.js';

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
