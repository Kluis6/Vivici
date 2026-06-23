import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "@/generated/prisma/client";
import { getPgConnectionString, getPgSslConfig } from "@/lib/database-url";
import { getServerEnv } from "@/lib/env";

declare global {
  var prisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (globalThis.prisma) {
    return globalThis.prisma;
  }

  const env = getServerEnv();
  const pool = new Pool({
    connectionString: getPgConnectionString(env.DATABASE_URL),
    ssl: getPgSslConfig(env.DATABASE_URL),
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
  }

  return prisma;
}
