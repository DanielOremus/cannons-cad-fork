import { ErrorCode } from '@project/shared';

export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(resource?: string) {
    super(
      `${resource ? resource : 'Resource'} not found!`,
      ErrorCode.NOT_FOUND,
    );
  }
}

// export class ValidationError extends AppError {
//   public readonly;
//   constructor(resource: string) {
//     super('Validation failed!', ErrorCode.VALIDATION_FAILED);
//   }
// }

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message ? message : 'Unauthorized', ErrorCode.UNAUTHORIZED);
  }
}

export class AlreadyExistsError extends AppError {
  constructor(message?: string) {
    super(
      message ? message : 'Resource already exists',
      ErrorCode.ALREADY_EXISTS,
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message ? message : 'Access denied', ErrorCode.FORBIDDEN);
  }
}
