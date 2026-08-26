import * as z from 'zod/v4';

export function ZodDto<TSchema extends z.ZodType>(schema: TSchema) {
  type DataType = z.infer<TSchema>;
  class BaseDtoClass {
    static schema: TSchema = schema;
    constructor(data: DataType) {
      Object.assign(this, data);
    }
  }
  return BaseDtoClass as unknown as {
    new (data: DataType): DataType;
    schema: TSchema;
  };
}
