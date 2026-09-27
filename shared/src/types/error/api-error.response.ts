import type { ValidationIssue } from './validation.error.js';
import { ErrorCode } from './error.code.js';

// export type ApiErrorResponse =
//   | {
//       errorCode: typeof ErrorCode.VALIDATION_FAILED;
//       errorMessage?: string;
//       errorIssues: ValidationIssue[];
//     }
//   | {
//       errorCode: Exclude<ErrorCodeType, typeof ErrorCode.VALIDATION_FAILED>;
//       errorMessage?: string;
//       errorIssues?: never;
//     };

export type ApiErrorResponse = {
  errorCode: ErrorCode;
  errorMessage?: string;
  errorIssues?: ValidationIssue[];
};

export type ApiSocketErrorData = {
  errorCode: ErrorCode;
  errorMessage?: string;
};
