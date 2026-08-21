import * as z from 'zod/v4';
import type { ValidationIssue } from '../types/error/validation.error.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const validationIssueSchema = z.custom<ValidationIssue>((value) => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (typeof value.field === 'string' ||
      typeof value.field === 'number' ||
      typeof value.field === 'symbol') &&
    typeof value.code === 'string'
  );
});

export const apiErrorResponseSchema = z.object({
  errorCode: z.string(),
  errorMessage: z.string().optional(),
  errorMsg: z.string().optional(),
  errorIssues: z.array(validationIssueSchema).optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
