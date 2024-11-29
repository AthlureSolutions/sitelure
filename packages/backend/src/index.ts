// packages/backend/src/index.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
}

main();
