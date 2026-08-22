import type { ValidationIssue } from './validation.error.js';
import { ErrorCode, type ErrorCode as ErrorCodeType } from './error.code.js';

export type ApiErrorResponse =
  | {
      errorCode: typeof ErrorCode.VALIDATION_FAILED;
      errorMessage?: string;
      errorIssues: ValidationIssue[];
    }
  | {
      errorCode: Exclude<ErrorCodeType, typeof ErrorCode.VALIDATION_FAILED>;
      errorMessage?: string;
      errorIssues?: never;
    };