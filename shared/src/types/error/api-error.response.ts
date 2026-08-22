import type { ValidationIssue } from './validation.error.js';

export type ApiErrorResponse = {
  errorCode: string;
  errorMessage?: string;
  errorMsg?: string;
  errorIssues?: ValidationIssue[];
};
