const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to Supabase PostgreSQL...");
  const workers = await prisma.worker.findMany({
    include: { society: true },
  });
  console.log("SUCCESS! Connected to Supabase!");
  console.log(`Found ${workers.length} workers in Supabase cloud.`);
  for (const w of workers) {
    console.log(` - ${w.name} (${w.skills}) | Society: ${w.society?.name}`);
  }
}

main()
  .catch((e) => {
    console.error("Connection failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
