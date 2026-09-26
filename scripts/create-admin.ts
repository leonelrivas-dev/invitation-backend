import 'dotenv/config';
import { randomUUID } from 'crypto';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const rl = readline.createInterface({
    input,
    output,
  });

  try {
    const email = (await rl.question('Email: ')).trim().toLowerCase();

    const password = await rl.question('Password: ');

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const existingUser = await prisma.admin_users.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error(`Admin user "${email}" already exists`);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const adminUser = await prisma.admin_users.create({
      data: {
        id: randomUUID(),
        email,
        password_hash: passwordHash,
      },
    });

    console.log(`\nAdmin user created successfully: ${adminUser.email}`);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(
    '\nFailed to create admin user:',
    error instanceof Error ? error.message : error,
  );

  process.exit(1);
});
