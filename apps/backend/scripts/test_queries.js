require("dotenv/config");
const prisma = require("../dist/app/shared/prisma").default;

async function runTests(round) {
  console.log(`--- Round ${round} ---`);

  const usersWithPapers = await prisma.$queryRaw`
    SELECT DISTINCT p."uploaderId" as id
    FROM "Paper" p
    WHERE p."isDeleted" = false
    LIMIT 1
  `;

  const userId = usersWithPapers[0]?.id;
  if (!userId) {
    console.log("No users with papers found\n");
    return;
  }

  const start1 = Date.now();
  await prisma.$queryRaw`
    SELECT p.id, p.title
    FROM "Paper" p
    WHERE p."uploaderId" = ${userId}
      AND p."isDeleted" = false
    ORDER BY p."createdAt" DESC
    LIMIT 21
  `;
  console.log(`  listByUser: ${Date.now() - start1}ms`);

  const start2 = Date.now();
  await prisma.$queryRaw`
    SELECT id, title FROM "Paper"
    WHERE "isDeleted" = false
    ORDER BY "createdAt" DESC
    LIMIT 21
  `;
  console.log(`  listAll: ${Date.now() - start2}ms`);

  const start3 = Date.now();
  await prisma.$queryRaw`
    SELECT id, title FROM "Paper"
    WHERE "isDeleted" = false
      AND title % ${'the'}
    ORDER BY similarity(title, ${'the'}) DESC
    LIMIT 20
  `;
  console.log(`  trigram search: ${Date.now() - start3}ms`);

  console.log("");
}

async function main() {
  console.log("=== Query Performance Test (3 rounds) ===\n");
  for (let i = 1; i <= 3; i++) {
    await runTests(i);
  }
  console.log("=== Done ===");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
