import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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
  })

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
  })

  console.log('✅ Database seeded successfully!')
  console.log('Created plans:', { freePlan: freePlan.name, proPlan: proPlan.name })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })