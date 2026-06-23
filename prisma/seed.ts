import { UserRole } from "../generated/prisma/client";
import { createScriptPrismaClient } from "./runtime";

const { prisma, pool } = createScriptPrismaClient();

async function main() {
  await prisma.state.upsert({
    where: { code: "SP" },
    update: { name: "São Paulo" },
    create: { code: "SP", name: "São Paulo" },
  });

  await prisma.state.upsert({
    where: { code: "RJ" },
    update: { name: "Rio de Janeiro" },
    create: { code: "RJ", name: "Rio de Janeiro" },
  });

  await prisma.user.upsert({
    where: { email: "admin@vivici.com.br" },
    update: {
      fullName: "Vivici Admin",
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      email: "admin@vivici.com.br",
      fullName: "Vivici Admin",
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
