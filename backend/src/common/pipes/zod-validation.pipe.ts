import * as z from 'zod/v4';
import { ValidationError } from '../../shared/errors/app.error';
import { PipeTransform } from '@nestjs/common';
import { mapZodIssue } from '@project/shared';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly zodSchema: z.ZodType) {}
  transform(value: unknown) {
    const result = this.zodSchema.safeParse(value);
    if (!result.success) {
      //mapping issues to my validation error

      const myIssues = result.error.issues.map((issue) => {
        console.log(issue);
        return mapZodIssue(issue);
      });
      throw new ValidationError(myIssues);
    }
    return result.data;
  }
}
