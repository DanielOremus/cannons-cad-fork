import * as z from 'zod/v4';

const configSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  ENV: z.enum(['production', 'development', 'test']).default('development'),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_TTL: z.coerce.number().int().positive().default(900), //15 minutes
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_TTL: z.coerce.number().int().positive().default(604800), //7 days
  DATABASE_URL: z.string(),
});

export function validate(config: Record<string, unknown>) {
  const result = configSchema.safeParse(config);
  if (!result.success)
    throw new Error('App config validation error: ' + result.error.message);
  return result.data;
}

export type EnvConfig = z.infer<typeof configSchema>;
