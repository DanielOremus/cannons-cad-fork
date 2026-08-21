// import * as z from 'zod/v4';

// export const backendApiErrorSchema = z.object({
//   errorCode: z.string(),
//   errorMessage: z.string().optional(),
//   errorMsg: z.string().optional(),
//   errorIssues: z.array(backendValidationIssueSchema).optional(),
// });

// export const structuredApiErrorSchema = z.object({
//   status: z.number().optional(),
//   code: z.string(),
//   detail: z.string(),
// });

// export type BackendValidationIssue = z.infer<typeof backendValidationIssueSchema>;
// export type BackendApiError = z.infer<typeof backendApiErrorSchema>;
// export type StructuredApiError = z.infer<typeof structuredApiErrorSchema>;
