const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
  } catch (e) {
    console.error('Smoke test error:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
