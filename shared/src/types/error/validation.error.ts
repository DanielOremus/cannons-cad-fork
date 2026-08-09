import * as z from 'zod/v4';

export type ValidationIssue<C extends IssueCode = IssueCode> = {
  field: string | number | symbol;
  code: C;
  params: ValidationIssues[C];
};

//Base types

export type ValidationIssues = {
  too_small: {
    type: z.core.$ZodIssueTooSmall['origin'];
    min: z.core.$ZodIssueTooSmall['minimum'];
    inclusive: boolean;
  };
  too_big: {
    type: z.core.$ZodIssueTooSmall['origin'];
    max: z.core.$ZodIssueTooBig['maximum'];
    inclusive: boolean;
  };
  invalid_enum_value: {
    allowed: (string | number)[];
    entered: unknown;
  };
  invalid_format: {
    format: string;
  };
  invalid_type: {
    required: string;
  };
  custom: {
    message: string;
  };
  not_unique: void;
};

export type IssueCode = keyof ValidationIssues;
