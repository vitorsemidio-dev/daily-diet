import { config } from 'dotenv'
import { z } from 'zod'

const nodeEnvSchem = z
  .enum(['development', 'test', 'production'])
  .default('production')

const nodeEnv = nodeEnvSchem.parse(process.env.NODE_ENV)

if (nodeEnv === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
