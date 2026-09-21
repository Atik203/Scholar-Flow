/**
 * Demo subscribers with real Stripe test-mode subscriptions.
 *
 * Each demo user gets a test-clock simulation: clock frozen 15 days ago ->
 * 14-day trial -> clock advanced to now -> trial ends, invoice finalized and
 * charged -> subscription active with a paid invoice. The DB rows mirror
 * exactly what webhook.controller.ts writes on checkout.session.completed +
 * invoice.paid, so admin subscribers/payments pages show real data.
 *
 * Run:     yarn ts-node prisma/seedDemoSubscribers.js
 * Cleanup: yarn ts-node prisma/seedDemoSubscribers.js --cleanup
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { PrismaClient } = require('../src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
const Stripe = require('stripe');

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DEFAULT_PASSWORD = 'password123';
const TRIAL_PERIOD_DAYS = 14;
const CLOCK_BACKDATE_DAYS = 15;
const CLOCK_NAME_PREFIX = 'demo-sub-';
const DEMO_METADATA_KEY = 'demoSeed';

const ROLE_BY_TIER = {
  pro: 'PRO_RESEARCHER',
  team: 'TEAM_LEAD',
};

const DEMO_USERS = [
  {
    email: 'emily.carter@scholarflow.com',
    name: 'Emily Carter',
    firstName: 'Emily',
    lastName: 'Carter',
    institution: 'Massachusetts Institute of Technology',
    fieldOfStudy: 'Artificial Intelligence',
    planCode: 'pro_monthly',
  },
  {
    email: 'michael.chen@scholarflow.com',
    name: 'Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    institution: 'Stanford University',
    fieldOfStudy: 'Machine Learning',
    planCode: 'pro_monthly',
  },
  {
    email: 'sofia.rodriguez@scholarflow.com',
    name: 'Sofia Rodriguez',
    firstName: 'Sofia',
    lastName: 'Rodriguez',
    institution: 'University of Oxford',
    fieldOfStudy: 'Computational Biology',
    planCode: 'pro_annual',
  },
  {
    email: 'david.okafor@scholarflow.com',
    name: 'David Okafor',
    firstName: 'David',
    lastName: 'Okafor',
    institution: 'Harvard University',
    fieldOfStudy: 'Data Science',
    planCode: 'team_monthly',
  },
  {
    email: 'aisha.khan@scholarflow.com',
    name: 'Aisha Khan',
    firstName: 'Aisha',
    lastName: 'Khan',
    institution: 'ETH Zurich',
    fieldOfStudy: 'Quantum Computing',
    planCode: 'team_monthly',
  },
  {
    email: 'lucas.meyer@scholarflow.com',
    name: 'Lucas Meyer',
    firstName: 'Lucas',
    lastName: 'Meyer',
    institution: 'Max Planck Institute',
    fieldOfStudy: 'Neuroscience',
    planCode: 'team_annual',
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const unixNow = () => Math.floor(Date.now() / 1000);

const roleForPlanCode = (planCode) =>
  ROLE_BY_TIER[planCode.split('_')[0]] || 'RESEARCHER';

const formatDate = (seconds) =>
  seconds ? new Date(seconds * 1000).toISOString().slice(0, 10) : '-';

async function findClockByName(name) {
  let startingAfter;

  for (let page = 0; page < 5; page += 1) {
    const result = await stripe.testHelpers.testClocks.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    const match = result.data.find((clock) => clock.name === name);
    if (match) return match;
    if (!result.has_more) return null;

    startingAfter = result.data[result.data.length - 1].id;
  }

  return null;
}

async function findCustomerForUser(clockId, userId) {
  const customers = await stripe.customers.list({
    test_clock: clockId,
    limit: 100,
  });

  return (
    customers.data.find(
      (customer) => customer.metadata?.userId === userId
    ) || null
  );
}

async function attachTestCard(customerId) {
  try {
    const paymentMethod = await stripe.paymentMethods.attach('pm_card_visa', {
      customer: customerId,
    });
    return paymentMethod.id;
  } catch (error) {
    console.warn(
      `   pm_card_visa rejected (${error.message}); creating a fresh test card`
    );
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2036,
        cvc: '314',
      },
    });
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });
    return paymentMethod.id;
  }
}

async function ensureDefaultCard(customer) {
  if (customer.invoice_settings?.default_payment_method) {
    return customer.invoice_settings.default_payment_method;
  }

  const paymentMethodId = await attachTestCard(customer.id);
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });
  return paymentMethodId;
}

async function waitForClockReady(clockId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const clock = await stripe.testHelpers.testClocks.retrieve(clockId);
    if (clock.status === 'ready') return clock;
    await sleep(2000);
  }

  throw new Error(`Test clock ${clockId} did not become ready in time`);
}

async function advanceClockTo(clock, targetTime) {
  if (clock.status === 'ready' && clock.frozen_time >= targetTime) {
    return clock;
  }

  await stripe.testHelpers.testClocks.advance(clock.id, {
    frozen_time: targetTime,
  });

  return waitForClockReady(clock.id);
}

async function resolvePaidInvoice(subscriptionId, clockId) {
  let subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['latest_invoice'],
  });
  let invoice = subscription.latest_invoice;

  if (!invoice || invoice.status !== 'paid') {
    // Subscription invoices stay in draft for ~1 hour after creation; push
    // the clock past that window so Stripe finalizes and charges the card.
    await stripe.testHelpers.testClocks.advance(clockId, {
      frozen_time: unixNow() + 3600,
    });
    await waitForClockReady(clockId);

    subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice'],
    });
    invoice = subscription.latest_invoice;
  }

  if (!invoice || invoice.status !== 'paid') {
    throw new Error(
      `Invoice for ${subscriptionId} is not paid (status: ${
        invoice ? invoice.status : 'missing'
      })`
    );
  }

  return { subscription, invoice };
}

async function syncToDatabase({
  demo,
  plan,
  userId,
  subscription,
  invoice,
  customerId,
}) {
  const item = subscription.items.data[0];
  const periodStart = item.current_period_start
    ? new Date(item.current_period_start * 1000)
    : null;
  const periodEnd = item.current_period_end
    ? new Date(item.current_period_end * 1000)
    : null;

  const subscriptionData = {
    userId,
    workspaceId: null,
    planId: plan.id,
    status: 'ACTIVE',
    provider: 'STRIPE',
    providerCustomerId: customerId,
    providerSubscriptionId: subscription.id,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
    trialStart: subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : null,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
    seats: 1,
    startedAt: new Date(subscription.start_date * 1000),
    expiresAt: periodEnd,
  };

  const existingSubscription = await prisma.subscription.findFirst({
    where: { providerSubscriptionId: subscription.id },
  });

  const localSubscription = existingSubscription
    ? await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: subscriptionData,
      })
    : await prisma.subscription.create({ data: subscriptionData });

  const paidAt = invoice.status_transitions?.paid_at
    ? new Date(invoice.status_transitions.paid_at * 1000)
    : new Date();

  const paymentData = {
    userId,
    subscriptionId: localSubscription.id,
    provider: 'STRIPE',
    amountCents: invoice.amount_paid,
    currency: (invoice.currency || 'usd').toUpperCase(),
    transactionId: invoice.id,
    status: 'SUCCEEDED',
    raw: JSON.parse(JSON.stringify(invoice)),
    createdAt: paidAt,
  };

  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId: invoice.id },
  });

  if (existingPayment) {
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: paymentData,
    });
  } else {
    await prisma.payment.create({ data: paymentData });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: roleForPlanCode(demo.planCode),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: plan.stripePriceId,
      stripeCurrentPeriodEnd: periodEnd,
    },
  });

  return localSubscription;
}

async function seedUser(demo, hashedPassword) {
  const plan = await prisma.plan.findFirst({
    where: { code: demo.planCode, isDeleted: false },
  });

  if (!plan) {
    throw new Error(`Plan ${demo.planCode} not found`);
  }

  if (!plan.stripePriceId) {
    throw new Error(`Plan ${demo.planCode} has no Stripe price ID`);
  }

  const user = await prisma.user.upsert({
    where: { email: demo.email },
    update: {
      password: hashedPassword,
      role: roleForPlanCode(demo.planCode),
      isDeleted: false,
    },
    create: {
      email: demo.email,
      name: demo.name,
      firstName: demo.firstName,
      lastName: demo.lastName,
      institution: demo.institution,
      fieldOfStudy: demo.fieldOfStudy,
      password: hashedPassword,
      role: roleForPlanCode(demo.planCode),
      image: null,
    },
  });

  const clockName = `${CLOCK_NAME_PREFIX}${demo.email}`;
  let clock = await findClockByName(clockName);

  if (!clock) {
    clock = await stripe.testHelpers.testClocks.create({
      frozen_time: unixNow() - CLOCK_BACKDATE_DAYS * 24 * 60 * 60,
      name: clockName,
    });
  }

  let customer = await findCustomerForUser(clock.id, user.id);

  if (!customer) {
    customer = await stripe.customers.create({
      email: demo.email,
      name: demo.name,
      test_clock: clock.id,
      metadata: { userId: user.id, [DEMO_METADATA_KEY]: 'true' },
    });
  }

  const paymentMethodId = await ensureDefaultCard(customer);

  const existingSubscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'all',
    limit: 10,
  });

  let subscription = existingSubscriptions.data.find(
    (candidate) => candidate.metadata?.userId === user.id
  );

  if (!subscription) {
    subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan.stripePriceId }],
      trial_period_days: TRIAL_PERIOD_DAYS,
      default_payment_method: paymentMethodId,
      metadata: {
        userId: user.id,
        planTier: demo.planCode.split('_')[0],
        [DEMO_METADATA_KEY]: 'true',
      },
    });
  }

  await advanceClockTo(clock, unixNow());

  const { subscription: activeSubscription, invoice } = await resolvePaidInvoice(
    subscription.id,
    clock.id
  );

  await syncToDatabase({
    demo,
    plan,
    userId: user.id,
    subscription: activeSubscription,
    invoice,
    customerId: customer.id,
  });

  return {
    email: demo.email,
    plan: plan.name,
    role: roleForPlanCode(demo.planCode),
    subscriptionId: activeSubscription.id,
    invoiceId: invoice.id,
    amount: `$${(invoice.amount_paid / 100).toFixed(2)}`,
    trialEnd: formatDate(activeSubscription.trial_end),
    periodEnd: formatDate(
      activeSubscription.items.data[0]?.current_period_end
    ),
  };
}

async function cleanup() {
  for (const demo of DEMO_USERS) {
    const user = await prisma.user.findUnique({
      where: { email: demo.email },
    });

    if (user) {
      await prisma.payment.deleteMany({ where: { userId: user.id } });
      await prisma.subscription.deleteMany({ where: { userId: user.id } });
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isDeleted: true,
          role: 'RESEARCHER',
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      console.log(`   🗑️  Removed DB rows for ${demo.email}`);
    }

    const clock = await findClockByName(`${CLOCK_NAME_PREFIX}${demo.email}`);
    if (clock) {
      await stripe.testHelpers.testClocks.del(clock.id);
      console.log(`   🗑️  Deleted test clock for ${demo.email}`);
    }

    const customers = await stripe.customers.list({
      email: demo.email,
      limit: 100,
    });
    for (const customer of customers.data) {
      if (!customer.test_clock) {
        await stripe.customers.del(customer.id);
        console.log(`   🗑️  Deleted Stripe customer ${customer.id}`);
      }
    }
  }
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing from apps/backend/.env');
  }

  if (process.argv.includes('--cleanup')) {
    console.log('🧹 Cleaning up demo subscribers...');
    await cleanup();
    console.log('✅ Demo subscribers removed');
    return;
  }

  console.log('🌱 Seeding demo subscribers with paid-after-trial subscriptions...');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  const results = [];
  const failures = [];

  for (const demo of DEMO_USERS) {
    console.log(`\n▶ ${demo.email} (${demo.planCode})`);
    try {
      const result = await seedUser(demo, hashedPassword);
      results.push(result);
      console.log(`   ✅ ${result.plan} — ${result.invoiceId} ${result.amount}`);
    } catch (error) {
      failures.push({ email: demo.email, error: error.message });
      console.error(`   ❌ ${error.message}`);
    }
  }

  console.log('\n=== Demo subscribers ===');
  console.table(results);

  if (failures.length > 0) {
    console.error('\n=== Failures ===');
    console.table(failures);
    process.exitCode = 1;
    return;
  }

  console.log(
    `\n🎉 ${results.length}/${DEMO_USERS.length} demo subscribers seeded. Password: ${DEFAULT_PASSWORD}`
  );
}

main()
  .catch((error) => {
    console.error('❌ Demo seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
