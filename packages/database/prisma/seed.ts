import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

import {
  PrismaClient,
  UserRole,
  UserStatus,
} from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required for seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main(): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.warn(
      '[seed] Skip: set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD to create admin user.',
    );
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      role: UserRole.admin,
      status: UserStatus.active,
    },
    create: {
      email,
      password: hashed,
      role: UserRole.admin,
      status: UserStatus.active,
    },
  });

  console.log(`[seed] Admin user ready: ${email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
