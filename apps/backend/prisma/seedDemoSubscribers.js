/**
 * Demo subscribers with real Stripe test-mode subscriptions.
 *
 * Each demo user gets a test-clock simulation: clock frozen back
 * (trial + N monthly cycles) -> advanced through every billing boundary ->
 * each cycle finalizes and charges a real invoice. The DB rows mirror
 * exactly what webhook.controller.ts writes on checkout.session.completed +
 * invoice.paid, so admin subscribers/payments/revenue pages show real data.
 *
 * --cycles=N  number of paid monthly invoices per subscriber (default 1).
 * Flags on individual demo users: cancelAfter (CANCELED + churn),
 * refundFirstPayment (REFUNDED payment), failLastCycle (FAILED payment +
 * PAST_DUE subscription).
 *
 * Run:     yarn ts-node prisma/seedDemoSubscribers.js --cycles=4
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
const CYCLE_DAYS = 30;
const CLOCK_NAME_PREFIX = 'demo-sub-';
const DEMO_METADATA_KEY = 'demoSeed';

const cyclesArg = process.argv.find((arg) => arg.startsWith('--cycles='));
const CYCLES = cyclesArg
  ? Math.min(Math.max(parseInt(cyclesArg.split('=')[1], 10) || 1, 1), 12)
  : 1;

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
    refundFirstPayment: true,
  },
  {
    email: 'aisha.khan@scholarflow.com',
    name: 'Aisha Khan',
    firstName: 'Aisha',
    lastName: 'Khan',
    institution: 'ETH Zurich',
    fieldOfStudy: 'Quantum Computing',
    planCode: 'team_monthly',
    cancelAfter: true,
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
  {
    email: 'pro.researcher@scholarflow.com',
    name: 'Pro Researcher',
    firstName: 'Pro',
    lastName: 'Researcher',
    institution: 'University of Dhaka',
    fieldOfStudy: 'Machine Learning',
    planCode: 'pro_monthly',
    failLastCycle: true,
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

async function attachDeclinedCard(customerId) {
  // Raw card numbers are blocked on this account; the classic test token
  // tok_chargeDeclined maps to a Visa that fails at charge time.
  let paymentMethod;
  try {
    paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_chargeDeclined' },
    });
  } catch (error) {
    console.warn(`   declined token rejected (${error.message})`);
    return null;
  }

  try {
    const attached = await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });
    return attached.id;
  } catch (error) {
    console.warn(`   declined card attach rejected (${error.message})`);
    return null;
  }
}

function mapSubscriptionStatus(stripeStatus) {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return 'ACTIVE';
    case 'past_due':
      return 'PAST_DUE';
    case 'canceled':
    case 'unpaid':
      return 'CANCELED';
    default:
      return 'EXPIRED';
  }
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

async function upsertSubscriptionRow({
  userId,
  planId,
  customerId,
  subscription,
  status,
}) {
  const item = subscription.items?.data?.[0];
  const periodStart = item?.current_period_start
    ? new Date(item.current_period_start * 1000)
    : null;
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000)
    : null;

  const data = {
    userId,
    workspaceId: null,
    planId,
    status,
    provider: 'STRIPE',
    providerCustomerId: customerId,
    providerSubscriptionId: subscription.id,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
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

  const existing = await prisma.subscription.findFirst({
    where: { providerSubscriptionId: subscription.id },
  });

  return existing
    ? prisma.subscription.update({ where: { id: existing.id }, data })
    : prisma.subscription.create({ data });
}

async function upsertInvoicePayment({
  userId,
  subscriptionId,
  invoice,
  status,
}) {
  const paidAt = invoice.status_transitions?.paid_at
    ? new Date(invoice.status_transitions.paid_at * 1000)
    : null;
  const createdAt = paidAt || new Date(invoice.created * 1000);

  const data = {
    userId,
    subscriptionId,
    provider: 'STRIPE',
    amountCents: status === 'SUCCEEDED' ? invoice.amount_paid : invoice.amount_due || 0,
    currency: (invoice.currency || 'usd').toUpperCase(),
    transactionId: invoice.id,
    status,
    raw: JSON.parse(JSON.stringify(invoice)),
    createdAt,
  };

  const existing = await prisma.payment.findUnique({
    where: { transactionId: invoice.id },
  });

  return existing
    ? prisma.payment.update({ where: { id: existing.id }, data })
    : prisma.payment.create({ data });
}

async function updateUserStripeFields({
  userId,
  demo,
  plan,
  customerId,
  subscription,
}) {
  const item = subscription.items?.data?.[0];
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000)
    : null;

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
}

async function refundOldestPayment(userId, invoices) {
  const existingRefund = await prisma.payment.findFirst({
    where: { userId, status: 'REFUNDED' },
  });
  if (existingRefund) return existingRefund.transactionId;

  const paid = invoices
    .filter((invoice) => invoice.status === 'paid' && invoice.amount_paid > 0)
    .sort((a, b) => a.created - b.created);
  if (paid.length === 0) return null;

  const target = paid[0];
  const payment = await prisma.payment.findUnique({
    where: { transactionId: target.id },
  });
  if (!payment) return null;

  const rawIntent = target.payment_intent;
  const paymentIntentId =
    typeof rawIntent === 'string' ? rawIntent : rawIntent?.id || null;

  if (paymentIntentId) {
    try {
      await stripe.refunds.create({ payment_intent: paymentIntentId });
    } catch (error) {
      console.warn(`   refund API failed (${error.message}); marking locally`);
    }
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'REFUNDED',
      raw: { ...(payment.raw || {}), refundedAt: new Date().toISOString() },
    },
  });

  return target.id;
}

async function upsertLocalFailedPayment({
  userId,
  subscriptionId,
  transactionId,
  amountCents,
  currency,
}) {
  const data = {
    userId,
    subscriptionId,
    provider: 'STRIPE',
    amountCents,
    currency,
    transactionId,
    status: 'FAILED',
    raw: {
      demoSeed: true,
      reason:
        'card_declined (simulated locally — Stripe account blocks decline tokens)',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  };

  const existing = await prisma.payment.findUnique({
    where: { transactionId },
  });

  return existing
    ? prisma.payment.update({ where: { id: existing.id }, data })
    : prisma.payment.create({ data });
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

  const cycles = CYCLES;
  const clockName = `${CLOCK_NAME_PREFIX}${demo.email}`;
  let clock = await findClockByName(clockName);

  if (!clock) {
    // End the last cycle ~5 days ago so the mirrored current period runs
    // into the future (the next renewal shows as upcoming, not overdue).
    const backdateDays = TRIAL_PERIOD_DAYS + (cycles - 1) * CYCLE_DAYS + 5;
    clock = await stripe.testHelpers.testClocks.create({
      frozen_time: unixNow() - backdateDays * 24 * 60 * 60,
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

  const goodCardId = await ensureDefaultCard(customer);

  const existingSubscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'all',
    limit: 100,
  });

  let subscription = existingSubscriptions.data.find(
    (candidate) => candidate.metadata?.userId === user.id
  );

  if (!subscription) {
    subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan.stripePriceId }],
      trial_period_days: TRIAL_PERIOD_DAYS,
      default_payment_method: goodCardId,
      metadata: {
        userId: user.id,
        planTier: demo.planCode.split('_')[0],
        [DEMO_METADATA_KEY]: 'true',
      },
    });
  }

  // Walk the clock across every billing boundary so each cycle finalizes a
  // real invoice. Draft invoices get a one-hour nudge to attempt payment.
  let declinedCardApplied = false;
  for (let index = 0; index < cycles; index += 1) {
    const isLastCycle = index === cycles - 1;

    if (demo.failLastCycle && isLastCycle) {
      const declinedCardId = await attachDeclinedCard(customer.id);
      if (declinedCardId) {
        declinedCardApplied = true;
        await stripe.customers.update(customer.id, {
          invoice_settings: { default_payment_method: declinedCardId },
        });
      } else {
        console.warn(
          '   decline simulation blocked by Stripe — marking the failure locally'
        );
      }
    }

    const boundary =
      subscription.start_date +
      (TRIAL_PERIOD_DAYS + index * CYCLE_DAYS) * 24 * 60 * 60;
    clock = await advanceClockTo(clock, Math.min(boundary, unixNow() + 3600));

    const current = await stripe.subscriptions.retrieve(subscription.id, {
      expand: ['latest_invoice'],
    });
    const latestInvoice = current.latest_invoice;
    if (!latestInvoice || latestInvoice.status === 'draft') {
      clock = await advanceClockTo(
        clock,
        Math.min(boundary + 3600, unixNow() + 7200)
      );
    }
  }

  if (demo.failLastCycle) {
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: goodCardId },
    });
  }

  // Mirror a healthy upcoming renewal: cross the next boundary once if the
  // current period already ended (calendar-month billing drifts past 30 days).
  if (!demo.failLastCycle && !demo.cancelAfter) {
    for (let guard = 0; guard < 2; guard += 1) {
      const current = await stripe.subscriptions.retrieve(subscription.id);
      const end = current.items?.data?.[0]?.current_period_end;
      if (!end || end * 1000 > Date.now()) break;
      clock = await advanceClockTo(clock, end + 3600);
    }
  }

  // Cancel one subscription so churn and CANCELED state are real data.
  let finalSubscription = await stripe.subscriptions.retrieve(subscription.id);
  if (demo.cancelAfter && finalSubscription.status !== 'canceled') {
    finalSubscription = await stripe.subscriptions.cancel(subscription.id);
  }

  const status =
    demo.failLastCycle && !declinedCardApplied
      ? 'PAST_DUE'
      : mapSubscriptionStatus(finalSubscription.status);

  const localSubscription = await upsertSubscriptionRow({
    userId: user.id,
    planId: plan.id,
    customerId: customer.id,
    subscription: finalSubscription,
    status,
  });

  // Mirror every invoice (paid + failed) into Payment rows.
  const invoiceList = await stripe.invoices.list({
    subscription: subscription.id,
    limit: 100,
  });

  let paidCount = 0;
  let failedInvoiceId = null;

  // Fallback when the account blocks decline simulation: record the failed
  // renewal and PAST_DUE state locally instead of via Stripe.
  if (demo.failLastCycle && !declinedCardApplied) {
    failedInvoiceId = `demo_failed_invoice_${subscription.id}`;
    await upsertLocalFailedPayment({
      userId: user.id,
      subscriptionId: localSubscription.id,
      transactionId: failedInvoiceId,
      amountCents: plan.priceCents,
      currency: (plan.currency || 'usd').toUpperCase(),
    });
  }

  for (const invoice of invoiceList.data.slice().reverse()) {
    if (invoice.status === 'paid') {
      if (invoice.amount_paid > 0) {
        await upsertInvoicePayment({
          userId: user.id,
          subscriptionId: localSubscription.id,
          invoice,
          status: 'SUCCEEDED',
        });
        paidCount += 1;
      }
    } else if (
      invoice.status !== 'draft' &&
      invoice.status !== 'void' &&
      (invoice.amount_due || 0) > 0
    ) {
      failedInvoiceId = invoice.id;
      await upsertInvoicePayment({
        userId: user.id,
        subscriptionId: localSubscription.id,
        invoice,
        status: 'FAILED',
      });
    }
  }

  const refundedInvoiceId = demo.refundFirstPayment
    ? await refundOldestPayment(user.id, invoiceList.data)
    : null;

  await updateUserStripeFields({
    userId: user.id,
    demo,
    plan,
    customerId: customer.id,
    subscription: finalSubscription,
  });

  return {
    email: demo.email,
    plan: plan.name,
    role: roleForPlanCode(demo.planCode),
    status,
    subscriptionId: finalSubscription.id,
    paidInvoices: paidCount,
    failedInvoiceId: failedInvoiceId || '-',
    refundedInvoiceId: refundedInvoiceId || '-',
    periodEnd: formatDate(
      finalSubscription.items?.data?.[0]?.current_period_end
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

  console.log(
    `🌱 Seeding demo subscribers with real paid invoices (${CYCLES} cycle(s))...`
  );

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  const results = [];
  const failures = [];

  for (const demo of DEMO_USERS) {
    console.log(`\n▶ ${demo.email} (${demo.planCode})`);
    try {
      const result = await seedUser(demo, hashedPassword);
      results.push(result);
      console.log(
        `   ✅ ${result.plan} [${result.status}] — ${result.paidInvoices} paid invoice(s)`
      );
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
