const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking and cleaning user records in Supabase...");

  // Find customers with kameswara or test emails
  const customers = await prisma.customer.findMany();
  console.log("Existing Customers in DB:", customers.map(c => ({ id: c.id, email: c.email, name: c.name })));

  const workers = await prisma.worker.findMany();
  console.log("Existing Workers in DB:", workers.map(w => ({ id: w.id, name: w.name, phone: w.phone })));

  // Delete customer records matching kameswara.surya or test emails so they can start fresh
  const deletedCust = await prisma.customer.deleteMany({
    where: {
      OR: [
        { email: { contains: "kameswara", mode: "insensitive" } },
        { email: { contains: "surya", mode: "insensitive" } },
        { id: { startsWith: "sb-" } },
        { id: { startsWith: "usr-" } },
      ],
    },
  });
  console.log("Deleted test customers:", deletedCust.count);

  // Delete worker records matching custom/test IDs
  const deletedWorkers = await prisma.worker.deleteMany({
    where: {
      OR: [
        { phone: { contains: "kameswara", mode: "insensitive" } },
        { phone: { contains: "surya", mode: "insensitive" } },
        { id: { startsWith: "sb-" } },
        { id: { startsWith: "usr-" } },
      ],
    },
  });
  console.log("Deleted test workers:", deletedWorkers.count);

  // Also clean profiles table in Supabase via raw query
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM public.profiles;`);
    console.log("Cleared public.profiles table.");
  } catch (e) {
    console.warn("Note on profiles table:", e.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
