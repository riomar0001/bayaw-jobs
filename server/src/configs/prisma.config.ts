import { env } from 'cloudflare:workers';
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@/generated/prisma/client';

// D1 ignores transactions: Prisma runs each statement on its own (no rollback).
const prisma = new PrismaClient({ adapter: new PrismaD1(env.DB) });

export default prisma;
