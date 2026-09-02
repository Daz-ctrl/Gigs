const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.$queryRawUnsafe(`SELECT * FROM public.profiles;`);
  console.log("PROFILES IN SUPABASE:", profiles);
}

main().finally(() => prisma.$disconnect());
