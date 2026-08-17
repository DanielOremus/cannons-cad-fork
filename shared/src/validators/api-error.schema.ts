import * as z from 'zod/v4';

const issuePathSchema = z.array(z.union([z.string(), z.number()]));

export const structuredApiIssueSchema = z.object({
  path: issuePathSchema,
  code: z.string(),
  message: z.string(),
});

export const backendValidationIssueSchema = z.object({
  field: z.union([z.string(), z.number()]),
  code: z.string(),
  params: z.unknown().optional(),
});

export const backendApiErrorSchema = z.object({
  errorCode: z.string(),
  errorMessage: z.string().optional(),
  errorMsg: z.string().optional(),
  errorIssues: z.array(backendValidationIssueSchema).optional(),
});

export const structuredApiErrorSchema = z.object({
  status: z.number().optional(),
  code: z.string(),
  detail: z.string(),
  issues: z.array(structuredApiIssueSchema).optional(),
});

export type StructuredApiIssue = z.infer<typeof structuredApiIssueSchema>;
export type BackendValidationIssue = z.infer<typeof backendValidationIssueSchema>;
export type BackendApiError = z.infer<typeof backendApiErrorSchema>;
export type StructuredApiError = z.infer<typeof structuredApiErrorSchema>;
