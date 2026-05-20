import { config } from 'dotenv';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Monorepo: API .env is the usual source of DATABASE_URL
config({ path: path.resolve(__dirname, '../../apps/api/.env') });
config({ path: path.resolve(__dirname, '.env') });

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@127.0.0.1:5432/my_project';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
