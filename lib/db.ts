// lib/prisma.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/src/generated/client";

const connectionString = process.env.DATABASE_URL;

// 1. PostgreSQL ulanishini yaratamiz
const pool = new Pool({ connectionString });

// 2. Prisma adapterni ulaymiz
const adapter = new PrismaPg(pool);

// 3. Global o'zgaruvchi (Next.js hot-reload uchun)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
