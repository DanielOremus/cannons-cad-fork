import { ErrorCode } from '@project/shared';

export class AppError extends Error {
  public readonly code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(resource?: string) {
    super(`${resource ? resource : 'Resource'} not found!`, ErrorCode.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  public readonly issues = [];
  constructor(resource: string) {
    super('Validation failed!', ErrorCode.VALIDATION_FAILED);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message ? message : 'Unauthorized', ErrorCode.UNAUTHORIZED);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.CONFLICT) {
    super(message, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message ? message : 'Access denied', ErrorCode.FORBIDDEN);
  }
}
