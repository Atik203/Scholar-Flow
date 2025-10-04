/**
 * Seed script for Plan data
 * Run with: node prisma/seedPlans.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const plans = [
  {
    code: "free",
    name: "Free",
    priceCents: 0,
    currency: "USD",
    interval: "month",
    stripePriceId: null,
    features: {
      list: [
        "Up to 10 papers per month",
        "Basic AI summaries",
        "Personal workspace",
        "Standard search",
        "Email support",
        "Mobile app access",
      ],
      limits: {
        maxPapers: 10,
        maxCollections: 3,
        maxWorkspaceMembers: 1,
        aiQueries: 50,
      },
    },
    active: true,
  },
  {
    code: "pro_monthly",
    name: "Pro",
    priceCents: 2900, // $29.00
    currency: "USD",
    interval: "month",
    stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly_id",
    features: {
      list: [
        "Unlimited papers",
        "Advanced AI insights",
        "Team collaboration (up to 5)",
        "Semantic search",
        "Priority support",
        "Advanced annotations",
        "Citation management",
        "API access",
        "Custom collections",
        "Export to all formats",
      ],
      limits: {
        maxPapers: -1, // unlimited
        maxCollections: -1,
        maxWorkspaceMembers: 5,
        aiQueries: 1000,
      },
    },
    active: true,
  },
  {
    code: "pro_annual",
    name: "Pro (Annual)",
    priceCents: 29000, // $290.00
    currency: "USD",
    interval: "year",
    stripePriceId: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_pro_annual_id",
    features: {
      list: [
        "Unlimited papers",
        "Advanced AI insights",
        "Team collaboration (up to 5)",
        "Semantic search",
        "Priority support",
        "Advanced annotations",
        "Citation management",
        "API access",
        "Custom collections",
        "Export to all formats",
      ],
      limits: {
        maxPapers: -1,
        maxCollections: -1,
        maxWorkspaceMembers: 5,
        aiQueries: 1000,
      },
    },
    active: true,
  },
  {
    code: "team_monthly",
    name: "Team",
    priceCents: 8900, // $89.00
    currency: "USD",
    interval: "month",
    stripePriceId: process.env.STRIPE_PRICE_TEAM_MONTHLY || "price_team_monthly_id",
    features: {
      list: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced collaboration",
        "Team analytics",
        "SSO integration",
        "Admin controls",
        "Custom workflows",
        "Dedicated support",
        "Training sessions",
        "SLA guarantee",
      ],
      limits: {
        maxPapers: -1,
        maxCollections: -1,
        maxWorkspaceMembers: -1,
        aiQueries: 5000,
      },
    },
    active: true,
  },
  {
    code: "team_annual",
    name: "Team (Annual)",
    priceCents: 89000, // $890.00
    currency: "USD",
    interval: "year",
    stripePriceId: process.env.STRIPE_PRICE_TEAM_ANNUAL || "price_team_annual_id",
    features: {
      list: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced collaboration",
        "Team analytics",
        "SSO integration",
        "Admin controls",
        "Custom workflows",
        "Dedicated support",
        "Training sessions",
        "SLA guarantee",
      ],
      limits: {
        maxPapers: -1,
        maxCollections: -1,
        maxWorkspaceMembers: -1,
        aiQueries: 5000,
      },
    },
    active: true,
  },
  {
    code: "enterprise_monthly",
    name: "Enterprise",
    priceCents: 0, // Custom pricing - contact sales
    currency: "USD",
    interval: "month",
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "price_enterprise_monthly_id",
    features: {
      list: [
        "Everything in Team",
        "Custom integrations",
        "On-premise deployment",
        "Advanced security",
        "Custom AI models",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom training",
        "Compliance certifications",
        "Usage analytics",
      ],
      limits: {
        maxPapers: -1,
        maxCollections: -1,
        maxWorkspaceMembers: -1,
        aiQueries: -1,
      },
    },
    active: true,
  },
  {
    code: "enterprise_annual",
    name: "Enterprise (Annual)",
    priceCents: 0, // Custom pricing - contact sales
    currency: "USD",
    interval: "year",
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || "price_enterprise_annual_id",
    features: {
      list: [
        "Everything in Team",
        "Custom integrations",
        "On-premise deployment",
        "Advanced security",
        "Custom AI models",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom training",
        "Compliance certifications",
        "Usage analytics",
      ],
      limits: {
        maxPapers: -1,
        maxCollections: -1,
        maxWorkspaceMembers: -1,
        aiQueries: -1,
      },
    },
    active: true,
  },
];

async function seedPlans() {
  console.log("🌱 Starting plan seeding...");

  try {
    // Delete existing plans (optional - comment out if you want to keep existing data)
    // await prisma.plan.deleteMany({});
    // console.log("🗑️  Cleared existing plans");

    // Upsert plans (create or update)
    for (const plan of plans) {
      const result = await prisma.plan.upsert({
        where: { code: plan.code },
        update: plan,
        create: plan,
      });
      console.log(`✅ Upserted plan: ${result.name} (${result.code})`);
    }

    console.log("\n🎉 Plan seeding completed successfully!");
    console.log(`📊 Total plans: ${plans.length}`);
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedPlans()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
