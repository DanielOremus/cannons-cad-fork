import type { ValidationIssue } from './validation.error.js';
import type { ErrorCode } from './error.code.ts';

export type ApiErrorResponse = {
  errorCode: ErrorCode;
  errorMessage?: string;
  errorIssues?: ValidationIssue[];
};


// export type ApiErrorResponse =
//   | {
//       errorCode: 'VALIDATION_FAILED';
//       errorMessage?: string;
//       errorIssues: ValidationIssue[];
//     }
//   | {
//       errorCode: Exclude<ErrorCode, 'VALIDATION_FAILED'>;
//       errorMessage?: string;
//       errorIssues?: never;
//     };