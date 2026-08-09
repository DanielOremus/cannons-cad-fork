import * as z from 'zod/v4';
import { ValidationError } from '../../shared/errors/app.error';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { mapZodIssue } from '@project/shared';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly zodSchema: z.ZodType) {}
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.zodSchema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof z.ZodError) {
        //mapping issues to my validation error
        const myIssues = error.issues.map((issue) => {
          console.log(issue);
          return mapZodIssue(issue);
        });
        throw new ValidationError(myIssues);
      }
      throw error;
    }
  }
}
