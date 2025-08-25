const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Default password for all demo users
const DEFAULT_PASSWORD = 'password123';

async function main() {
  console.log('🌱 Seeding database...');

  // Hash the default password
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  console.log('🔒 Using default password for all demo users:', DEFAULT_PASSWORD);

  // Create admin user if not exists
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@scholarflow.com' },
    update: {},
    create: {
      email: 'admin@scholarflow.com',
      name: 'ScholarFlow Admin',
      firstName: 'ScholarFlow',
      lastName: 'Admin',
      institution: 'ScholarFlow Inc.',
      fieldOfStudy: 'Computer Science',
      password: hashedPassword,
      role: 'ADMIN',
      image: null,
    },
  });

  // Create sample users for different roles
  const researcherUser = await prisma.user.upsert({
    where: { email: 'researcher@scholarflow.com' },
    update: {},
    create: {
      email: 'researcher@scholarflow.com',
      name: 'John Researcher',
      firstName: 'John',
      lastName: 'Researcher',
      institution: 'MIT',
      fieldOfStudy: 'Artificial Intelligence',
      password: hashedPassword,
      role: 'RESEARCHER',
      image: null,
    },
  });

  const proResearcherUser = await prisma.user.upsert({
    where: { email: 'pro.researcher@scholarflow.com' },
    update: {},
    create: {
      email: 'pro.researcher@scholarflow.com',
      name: 'Jane Pro Researcher',
      firstName: 'Jane',
      lastName: 'Pro Researcher',
      institution: 'Stanford University',
      fieldOfStudy: 'Machine Learning',
      password: hashedPassword,
      role: 'PRO_RESEARCHER',
      image: null,
    },
  });

  const teamLeadUser = await prisma.user.upsert({
    where: { email: 'teamlead@scholarflow.com' },
    update: {},
    create: {
      email: 'teamlead@scholarflow.com',
      name: 'Bob Team Lead',
      firstName: 'Bob',
      lastName: 'Team Lead',
      institution: 'Harvard University',
      fieldOfStudy: 'Data Science',
      password: hashedPassword,
      role: 'TEAM_LEAD',
      image: null,
    },
  });

  // Create sample plans
  const freePlan = await prisma.plan.upsert({
    where: { code: 'free' },
    update: {},
    create: {
      code: 'free',
      name: 'Free Plan',
      priceCents: 0,
      currency: 'USD',
      interval: 'month',
      features: {
        maxPapers: 100,
        maxCollections: 5,
        aiFeatures: false,
        collaboration: false,
      },
      active: true,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { code: 'pro' },
    update: {},
    create: {
      code: 'pro',
      name: 'Pro Plan',
      priceCents: 1000, // $10.00
      currency: 'USD',
      interval: 'month',
      features: {
        maxPapers: -1, // unlimited
        maxCollections: -1,
        aiFeatures: true,
        collaboration: true,
        prioritySupport: true,
      },
      active: true,
    },
  });

  const institutionalPlan = await prisma.plan.upsert({
    where: { code: 'institutional' },
    update: {},
    create: {
      code: 'institutional',
      name: 'Institutional Plan',
      priceCents: 5000, // $50.00
      currency: 'USD',
      interval: 'month',
      features: {
        maxPapers: -1, // unlimited
        maxCollections: -1,
        aiFeatures: true,
        collaboration: true,
        prioritySupport: true,
        adminDashboard: true,
        multiWorkspace: true,
        apiAccess: true,
      },
      active: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('🔑 Default password for all demo users:', DEFAULT_PASSWORD);
  console.log('👥 Created users:', { 
    admin: adminUser.email, 
    researcher: researcherUser.email,
    proResearcher: proResearcherUser.email,
    teamLead: teamLeadUser.email
  });
  console.log('📋 Created plans:', { 
    freePlan: freePlan.name, 
    proPlan: proPlan.name,
    institutionalPlan: institutionalPlan.name
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
