const { PrismaClient } = require("@prisma/client");

async function testConnection(url, label) {
  console.log(`Testing ${label}...`);
  const p = new PrismaClient({
    datasources: { db: { url } },
  });
  try {
    const res = await p.worker.findFirst();
    console.log(`SUCCESS with ${label}! Worker found:`, res?.name);
    return true;
  } catch (e) {
    console.error(`FAILED with ${label}:`, e.message);
    return false;
  } finally {
    await p.$disconnect();
  }
}

async function main() {
  const url6543 = "postgresql://postgres.zfhcsisbtrueedbrfdog:Hoshino%40143%24%24%24@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const url5432 = "postgresql://postgres.zfhcsisbtrueedbrfdog:Hoshino%40143%24%24%24@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres";
  const directUrl = "postgresql://postgres:Hoshino%40143%24%24%24@db.zfhcsisbtrueedbrfdog.supabase.co:5432/postgres";

  await testConnection(url6543, "Port 6543 (Transaction Pooler)");
  await testConnection(url5432, "Port 5432 (Session Pooler)");
  await testConnection(directUrl, "Direct db.zfhcsisbtrueedbrfdog.supabase.co:5432");
}

main();
