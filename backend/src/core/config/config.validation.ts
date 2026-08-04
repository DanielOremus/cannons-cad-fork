import * as z from 'zod/v4';

const configSchema = z.object({
  port: z.coerce.number().int().positive().default(3000),
  env: z.enum(['production', 'development', 'test']).default('development'),
  cookieSecret: z.string(),
  turnstile: z.object({
    secret: z.string(),
    apiUrl: z.string(),
  }),
  jwt: z.object({
    access: z.object({
      secret: z.string(),
      ttl: z.coerce.number().int().positive().default(900), //15 minutes
    }),
    refresh: z.object({
      secret: z.string(),
      ttl: z.coerce.number().int().positive().default(604800), //7 days
    }),
  }),
  redis: z.object({
    host: z.string(),
    port: z.coerce.number().int().positive(),
    user: z.string(),
    password: z.string(),
  }),
  database: z.object({
    url: z.string(),
    host: z.string(),
    port: z.coerce.number().int().positive(),
    user: z.string(),
    password: z.string(),
    name: z.string(),
  }),
  mailer: z.object({
    host: z.string(),
    port: z.coerce.number().int().positive(),
    user: z.string(),
    password: z.string(),
    secure: z.stringbool(),
  }),
  email: z.object({
    username: z.string(),
    confirmationTtl: z.coerce.number().int().positive(),
  }),
});

export function validate(config: Record<string, unknown>) {
  const result = configSchema.safeParse(config);
  if (!result.success) throw new Error('App config validation error: ' + result.error.message);
  return result.data;
}

export type EnvConfig = z.infer<typeof configSchema>;
