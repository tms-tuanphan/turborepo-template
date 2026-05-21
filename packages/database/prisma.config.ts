import { config } from 'dotenv';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Root .env: Docker (POSTGRES_*). apps/api/.env: DATABASE_URL + API secrets.
config({ path: path.resolve(__dirname, '../../.env') });
config({ path: path.resolve(__dirname, '../../apps/api/.env') });
config({ path: path.resolve(__dirname, '.env') });

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5433/my_project';

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
