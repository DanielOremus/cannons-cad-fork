//Types
export { UserRole } from './types/user/user.role.js';
export { UserStatus } from './types/user/user.status.js';
export { ErrorCode } from './types/error.code.js';
export { CharacterGender } from './types/character/character.gender.js';
export { CharacterFlag } from './types/character/character.flag.js';
export { DriverCategory } from './types/driver.category.js';
export { PermissionAction } from './types/permission/permission.action.js';
export { PermissionResource } from './types/permission/permission.resource.js';
export { PermissionScope } from './types/permission/permission.scope.js';
export {
  type Permission,
  ResourceActions,
  type ResourceAction,
  type RequiredPermission,
} from './types/permission/index.js';

//Dto
export type { PaginationDto, PaginationRequest } from './dto/pagination.js';

export type {
  PublicUserResponseDto,
  LoginUserDto,
  RegisterUserDto,
  PrivateUserResponseDto,
} from './dto/user.js';

export type {
  CreateCharacterDto,
  CreateCharacterRequest,
} from './dto/character/create-character.js';
export type {
  SearchCharacterDto,
  SearchCharacterRequest,
  SearchCharacterResponseDto,
} from './dto/character/search-character.js';

//Validation schemas

export {
  characterCreateSchema,
  characterSearchSchema,
  searchCharacterResponseSchema,
} from './validators/character.schema.js';

export { paginationSchema } from './validators/pagination.schema.js';

export {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateEmailSchema,
  confirmEmailSchema,
  privateUserResponseSchema,
  publicUserResponseSchema,
} from './validators/user.schema.js';

//Utils

export {
  hasPermission,
  hasPermissionFromSet,
  hasPermissionFromRoles,
  getPermissionsFromRoles,
  accountActive,
} from './utils/auth.helpers.js';
