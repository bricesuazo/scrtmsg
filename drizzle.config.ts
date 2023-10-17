import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({
  path: '.env.local',
});

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default {
  schema: './src/db/schema.ts',
  driver: 'turso',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
