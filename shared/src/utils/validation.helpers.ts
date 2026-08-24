import * as z from 'zod/v4';
import type {
  ValidationIssue,
  IssueCode,
  ValidationIssues,
} from '../types/error/validation.error.js';

function generateIssueObj<C extends IssueCode>(
  issue: z.core.$ZodIssue,
  code: C,
  params: ValidationIssues[C],
): ValidationIssue {
  return {
    code,
    field: issue.path.join('.'),
    params,
  } satisfies ValidationIssue<C>;
}

export function mapZodIssue(issue: z.core.$ZodIssue): ValidationIssue {
  switch (issue.code) {
    case 'too_big':
      return generateIssueObj(issue, 'too_big', {
        type: issue.origin,
        max: issue.maximum,
        inclusive: issue.inclusive ?? false,
      });
      break;
    case 'too_small':
      return generateIssueObj(issue, 'too_small', {
        type: issue.origin,
        min: issue.minimum,
        inclusive: issue.inclusive ?? false,
      });
      break;
    case 'invalid_format':
      return generateIssueObj(issue, 'invalid_format', { required: issue.format });
    case 'invalid_type':
      return generateIssueObj(issue, 'invalid_type', { required: issue.expected });
    // case "not_multiple_of":
    //   return generateIssueObj(issue, "invalid_enum_value", {entered: issue.input, allowed: issue.})
    case 'invalid_value':
      return generateIssueObj(issue, 'invalid_value', {
        allowed: issue.values,
      });
      break;
    case 'custom':
      const code = issue.params?.code as IssueCode;
      if (code === 'invalid_format')
        return generateIssueObj(issue, 'invalid_format', { required: issue.params!.required as string });
      if (code === 'in_future') return generateIssueObj(issue, 'in_future', undefined);
      return generateIssueObj(issue, 'custom', { message: issue.message });
      break;
    default:
      return generateIssueObj(issue, 'custom', { message: issue.message });
      break;
  }
}
// export function extractParams<I extends z.core.$ZodIssue>(issue: I, myCode: IssueCode) {
//   return {

//   } satisfies ValidationIssues[typeof myCode];
// }
