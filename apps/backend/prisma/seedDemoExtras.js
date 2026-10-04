/**
 * Demo extras — fills every admin page and every demo role with data.
 *
 * Adds, for the ten Project_Show.md accounts:
 *   - Content moderation queue (ContentReport)
 *   - System alerts (SystemAlert)
 *   - Outbound webhooks + delivery history (WebhookEndpoint / WebhookDelivery)
 *   - API keys (ApiKey)
 *   - Admin reports (AdminReport)
 *   - Persisted platform settings (SystemSetting)
 *   - Per-role engagement: notifications, usage events, search history,
 *     citation exports, research notes, annotations, discussions, AI chats,
 *     AI insight threads, audit entries, preferences.
 *
 * Idempotent: every row uses a deterministic `demo-*` id and is upserted.
 * Safe:   cleanup only deletes rows whose id starts with `demo-`.
 *
 * Run:     yarn ts-node --transpile-only prisma/seedDemoExtras.js
 * Cleanup: yarn ts-node --transpile-only prisma/seedDemoExtras.js --cleanup
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { PrismaClient } = require('../src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const CLEANUP = process.argv.includes('--cleanup');

const DEMO_EMAILS = [
  'teamlead@scholarflow.com',
  'pro.researcher@scholarflow.com',
  'researcher@scholarflow.com',
  'admin@scholarflow.com',
  'emily.carter@scholarflow.com',
  'michael.chen@scholarflow.com',
  'sofia.rodriguez@scholarflow.com',
  'david.okafor@scholarflow.com',
  'aisha.khan@scholarflow.com',
  'lucas.meyer@scholarflow.com',
];

// Per-user volumes. Bob is already rich from seedDemoLibrary, so keep his
// additions minimal; everyone else gets enough for charts and lists.
const ENGAGEMENT = {
  'teamlead@scholarflow.com': { usage: 0, searches: 0, exports: 0, notes: 0, annotations: 0, aiChats: 0, insightThreads: 1 },
  'pro.researcher@scholarflow.com': { usage: 30, searches: 6, exports: 3, notes: 2, annotations: 3, aiChats: 2, insightThreads: 1 },
  'researcher@scholarflow.com': { usage: 25, searches: 6, exports: 2, notes: 2, annotations: 2, aiChats: 1, insightThreads: 0 },
  'admin@scholarflow.com': { usage: 20, searches: 5, exports: 0, notes: 0, annotations: 0, aiChats: 0, insightThreads: 0 },
  'emily.carter@scholarflow.com': { usage: 24, searches: 6, exports: 2, notes: 3, annotations: 2, aiChats: 1, insightThreads: 1 },
  'michael.chen@scholarflow.com': { usage: 16, searches: 5, exports: 2, notes: 0, annotations: 0, aiChats: 0, insightThreads: 0 },
  'sofia.rodriguez@scholarflow.com': { usage: 12, searches: 4, exports: 0, notes: 1, annotations: 1, aiChats: 0, insightThreads: 0 },
  'david.okafor@scholarflow.com': { usage: 12, searches: 4, exports: 0, notes: 1, annotations: 1, aiChats: 0, insightThreads: 0 },
  'aisha.khan@scholarflow.com': { usage: 12, searches: 4, exports: 0, notes: 1, annotations: 1, aiChats: 0, insightThreads: 0 },
  'lucas.meyer@scholarflow.com': { usage: 12, searches: 4, exports: 0, notes: 1, annotations: 1, aiChats: 0, insightThreads: 0 },
};

const HOUR = 3600000;
const DAY = 86400000;
const daysAgo = (days, hours = 0) => new Date(Date.now() - days * DAY - hours * HOUR);
const daysAhead = (days) => new Date(Date.now() + days * DAY);
const slug = (email) => email.split('@')[0].replace(/[^a-z0-9]+/g, '-').toLowerCase();
const did = (...parts) => `demo-${parts.join('-')}`;
const log = (msg) => console.log(`   ${msg}`);

const USAGE_KINDS = [
  'upload',
  'paper_view',
  'reading_session',
  'ai_summary',
  'semantic_search',
  'annotation_created',
  'editor_open',
  'citation_export',
  'ai_chat',
  'workspace_view',
];
const ADMIN_USAGE_KINDS = [
  'admin_view',
  'user_management',
  'report_export',
  'audit_view',
  'settings_update',
  'ai_keys_view',
];

const SEARCH_POOL = [
  'prompt injection defenses',
  'mcp tool poisoning',
  'multi-agent debate robustness',
  'uncertainty calibration llm',
  'retrieval augmented generation',
  'ai safety benchmarks',
  'citation graph clustering',
  'federated learning privacy',
];
const QUERY_POOL = [
  'agent security benchmark results',
  'indirect prompt injection mitigation',
  'llm uncertainty quantification',
  'multi-agent collaboration protocols',
  'benchmark contamination detection',
  'tool use safety evaluation',
  'academic citation recommendation',
  'peer review automation ethics',
];

async function upsertRow(model, id, data) {
  return model.upsert({
    where: { id },
    update: data,
    create: { id, ...data },
  });
}

async function cleanup() {
  console.log('Cleaning up demo extras (ids starting with "demo-")...');
  const models = [
    ['webhookDelivery', prisma.webhookDelivery],
    ['webhookEndpoint', prisma.webhookEndpoint],
    ['discussionMessage', prisma.discussionMessage],
    ['discussionThread', prisma.discussionThread],
    ['aIInsightMessage', prisma.aIInsightMessage],
    ['aIInsightThread', prisma.aIInsightThread],
    ['aIConversationMessage', prisma.aIConversationMessage],
    ['aIConversation', prisma.aIConversation],
    ['notification', prisma.notification],
    ['usageEvent', prisma.usageEvent],
    ['searchHistory', prisma.searchHistory],
    ['citationExport', prisma.citationExport],
    ['researchNote', prisma.researchNote],
    ['annotation', prisma.annotation],
    ['activityLogEntry', prisma.activityLogEntry],
    ['apiKey', prisma.apiKey],
    ['adminReport', prisma.adminReport],
    ['contentReport', prisma.contentReport],
    ['systemAlert', prisma.systemAlert],
  ];
  for (const [name, model] of models) {
    const result = await model.deleteMany({
      where: { id: { startsWith: 'demo-' } },
    });
    if (result.count > 0) console.log(`   removed ${result.count} × ${name}`);
  }
  console.log('Demo extras removed.');
}

async function loadContext() {
  const byEmail = {};
  for (const email of DEMO_EMAILS) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isDeleted) {
      throw new Error(`Demo user missing or deleted: ${email} (run seed.js first)`);
    }
    byEmail[email] = user;
  }

  const workspaces = {};
  const papers = {};
  const collections = {};
  for (const email of DEMO_EMAILS) {
    const user = byEmail[email];
    workspaces[email] = await prisma.workspace.findFirst({
      where: { ownerId: user.id, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true },
    });
    papers[email] = await prisma.paper.findMany({
      where: { uploaderId: user.id, isDeleted: false },
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    collections[email] = await prisma.collection.findMany({
      where: { ownerId: user.id, isDeleted: false },
      select: { id: true, name: true },
      take: 3,
    });
  }
  return { byEmail, workspaces, papers, collections };
}

// ---------------------------------------------------------------------------
// Admin: content moderation
// ---------------------------------------------------------------------------
async function seedModeration(ctx) {
  const admin = ctx.byEmail['admin@scholarflow.com'];
  const bobPapers = ctx.papers['teamlead@scholarflow.com'];
  const bobCollections = ctx.collections['teamlead@scholarflow.com'];
  const emily = ctx.byEmail['emily.carter@scholarflow.com'];
  const emilyMessage = await prisma.discussionMessage.findFirst({
    where: { userId: emily.id, isDeleted: false },
    orderBy: { createdAt: 'asc' },
    select: { id: true, content: true },
  });

  const paper = (i) => bobPapers[i] || bobPapers[0] || { id: 'paper', title: 'Paper' };
  const collection = (i) => bobCollections[i] || bobCollections[0] || { id: 'collection', name: 'Collection' };

  const specs = [
    {
      key: '01', type: 'PAPER', contentId: paper(0).id, contentTitle: paper(0).title,
      preview: 'The abstract claims benchmark coverage that the results table does not support.',
      reporter: 'aisha.khan@scholarflow.com', reason: 'MISINFORMATION', status: 'PENDING',
      description: 'Claims are broader than the evidence in Tables 3-5.', days: 0.4,
    },
    {
      key: '02', type: 'COMMENT', contentId: emilyMessage ? emilyMessage.id : 'comment',
      contentTitle: 'Comment on "Which attack taxonomy should we use?"',
      preview: emilyMessage ? emilyMessage.content.slice(0, 140) : 'Discussion comment',
      reporter: 'david.okafor@scholarflow.com', reason: 'HARASSMENT', status: 'PENDING',
      description: 'The reply targets a person instead of the argument.', days: 1.2,
    },
    {
      key: '03', type: 'COLLECTION', contentId: collection(1).id, contentTitle: collection(1).name,
      preview: 'Collection description stuffed with unrelated external links.',
      reporter: 'lucas.meyer@scholarflow.com', reason: 'SPAM', status: 'PENDING',
      description: 'Looks like link-farm behaviour.', days: 2.1,
    },
    {
      key: '04', type: 'PAPER', contentId: paper(1).id, contentTitle: paper(1).title,
      preview: 'Large verbatim section appears to match a publisher PDF.',
      reporter: 'emily.carter@scholarflow.com', reason: 'COPYRIGHT', status: 'UNDER_REVIEW',
      description: 'Cross-checking against the DOI record.', assignedToId: admin.id, days: 3.4,
    },
    {
      key: '05', type: 'PROFILE', contentId: ctx.byEmail['aisha.khan@scholarflow.com'].id,
      contentTitle: 'Aisha Khan — profile',
      preview: 'Profile bio contains promotional content.',
      reporter: 'michael.chen@scholarflow.com', reason: 'INAPPROPRIATE', status: 'UNDER_REVIEW',
      assignedToId: admin.id, days: 4.8,
    },
    {
      key: '06', type: 'COMMENT', contentId: emilyMessage ? emilyMessage.id : 'comment',
      contentTitle: 'Comment on multi-agent debate thread',
      preview: 'Aggressive language flagged by two members.',
      reporter: 'david.okafor@scholarflow.com', reason: 'HARASSMENT', status: 'RESOLVED',
      action: 'removed', resolvedById: admin.id, resolvedAt: daysAgo(5, 3), days: 6.5,
    },
    {
      key: '07', type: 'PAPER', contentId: paper(2).id, contentTitle: paper(2).title,
      preview: 'Uploader account shared the same link in five collections.',
      reporter: 'aisha.khan@scholarflow.com', reason: 'SPAM', status: 'RESOLVED',
      action: 'warning', resolvedById: admin.id, resolvedAt: daysAgo(7, 6), days: 9.2,
    },
    {
      key: '08', type: 'PAPER', contentId: paper(3).id, contentTitle: paper(3).title,
      preview: 'Reviewer disagrees with the paper findings rather than the conduct.',
      reporter: 'researcher@scholarflow.com', reason: 'MISINFORMATION', status: 'DISMISSED',
      resolvedById: admin.id, resolvedAt: daysAgo(9, 2), days: 11.5,
    },
    {
      key: '09', type: 'COLLECTION', contentId: collection(0).id, contentTitle: collection(0).name,
      preview: 'Reported for unclear visibility settings.',
      reporter: 'lucas.meyer@scholarflow.com', reason: 'OTHER', status: 'DISMISSED',
      resolvedById: admin.id, resolvedAt: daysAgo(12, 1), days: 13.8,
    },
  ];

  for (const spec of specs) {
    await upsertRow(prisma.contentReport, did('cr', spec.key), {
      contentType: spec.type,
      contentId: spec.contentId,
      contentTitle: spec.contentTitle || null,
      contentPreview: spec.preview || null,
      reporterId: ctx.byEmail[spec.reporter].id,
      reason: spec.reason,
      description: spec.description || null,
      status: spec.status,
      assignedToId: spec.assignedToId || null,
      action: spec.action || null,
      resolvedAt: spec.resolvedAt || null,
      resolvedById: spec.resolvedById || null,
      createdAt: daysAgo(spec.days),
    });
  }
  return specs.length;
}

// ---------------------------------------------------------------------------
// Admin: system alerts
// ---------------------------------------------------------------------------
async function seedAlerts(ctx) {
  const admin = ctx.byEmail['admin@scholarflow.com'];

  const specs = [
    {
      key: '01', category: 'SECURITY', severity: 'CRITICAL', resolved: false,
      title: 'Repeated failed sign-ins for one account',
      message: '18 failed attempts in 10 minutes for sofia.rodriguez@scholarflow.com.',
      metadata: { email: 'sofia.rodriguez@scholarflow.com', attempts: 18 }, days: 0.2,
    },
    {
      key: '02', category: 'BILLING', severity: 'WARNING', resolved: false,
      title: 'Payment failed — Pro subscription',
      message: 'The latest renewal for pro.researcher@scholarflow.com was declined.',
      metadata: { plan: 'pro_monthly' }, days: 0.6,
    },
    {
      key: '03', category: 'STORAGE', severity: 'WARNING', resolved: false,
      title: 'Workspace nearing storage quota',
      message: 'The "ML" workspace is at 82% of its storage quota.',
      metadata: { workspace: 'ML', percent: 82 }, days: 1.1,
    },
    {
      key: '04', category: 'PROCESSING', severity: 'WARNING', resolved: false,
      title: 'Extraction queue backlog',
      message: '7 PDFs waiting in the extraction queue longer than 10 minutes.',
      metadata: { queued: 7 }, days: 1.9,
    },
    {
      key: '05', category: 'BILLING', severity: 'INFO', resolved: true,
      title: 'Invoice paid',
      message: 'Team (Annual) renewed for lucas.meyer@scholarflow.com ($890.00).',
      metadata: { amountCents: 89000 }, days: 2.4,
    },
    {
      key: '06', category: 'SECURITY', severity: 'WARNING', resolved: true,
      title: 'Rate-limit spike on /api/auth',
      message: 'Traffic returned to normal after 6 minutes; no accounts affected.',
      metadata: { rpm: 420 }, days: 3.2,
    },
    {
      key: '07', category: 'SYSTEM', severity: 'INFO', resolved: true,
      title: 'Deployment completed',
      message: 'API build 1.3.6 deployed successfully to production.',
      metadata: { version: '1.3.6' }, days: 4.7,
    },
    {
      key: '08', category: 'USER', severity: 'INFO', resolved: true,
      title: '12 new registrations this week',
      message: 'Registration volume is up 24% compared to last week.',
      metadata: { count: 12, change: 0.24 }, days: 6.3,
    },
    {
      key: '09', category: 'SYSTEM', severity: 'WARNING', resolved: true,
      title: 'API latency above target',
      message: 'p95 latency reached 640ms for 5 minutes on shared database time.',
      metadata: { p95ms: 640 }, days: 8.1,
    },
  ];

  for (const spec of specs) {
    await upsertRow(prisma.systemAlert, did('alert', spec.key), {
      category: spec.category,
      severity: spec.severity,
      title: spec.title,
      message: spec.message,
      metadata: spec.metadata || null,
      resolved: spec.resolved,
      resolvedAt: spec.resolved ? daysAgo(spec.days - 0.3) : null,
      resolvedById: spec.resolved ? admin.id : null,
      createdAt: daysAgo(spec.days),
    });
  }
  return specs.length;
}

// ---------------------------------------------------------------------------
// Admin: outbound webhooks + deliveries
// ---------------------------------------------------------------------------
async function seedWebhooks(ctx) {
  // Retire the old test artifacts for a clean console.
  await prisma.webhookEndpoint.updateMany({
    where: { name: { startsWith: 'Test' }, isDeleted: false },
    data: { isDeleted: true },
  });

  const endpoints = [
    {
      id: did('whe', 'slack'), name: 'Slack — Billing Alerts',
      url: 'https://hooks.slack.com/services/demo/T000/B000',
      events: ['invoice.paid', 'invoice.payment_failed'], status: 'ACTIVE', days: 21,
    },
    {
      id: did('whe', 'analytics'), name: 'Analytics Collector',
      url: 'https://analytics.scholarflow.dev/ingest',
      events: ['paper.created', 'user.created'], status: 'ACTIVE', days: 34,
    },
    {
      id: did('whe', 'zapier'), name: 'Zapier — Research Workflow',
      url: 'https://hooks.zapier.com/hooks/catch/demo/42',
      events: ['paper.created', 'annotation.created'], status: 'ERROR', days: 12,
    },
  ];

  for (const endpoint of endpoints) {
    await upsertRow(prisma.webhookEndpoint, endpoint.id, {
      name: endpoint.name,
      url: endpoint.url,
      description: `Demo endpoint for ${endpoint.name}`,
      secretHash: `demo_secret_hash_${endpoint.id}`,
      secretPrefix: 'whsec_de',
      events: endpoint.events,
      status: endpoint.status,
      createdAt: daysAgo(endpoint.days),
    });
  }

  // 24 deliveries: 16 SUCCESS, 5 FAILED, 3 PENDING.
  const statusFor = (i) => {
    if (i % 8 === 5) return 'FAILED';
    if (i % 8 === 7) return 'PENDING';
    return 'SUCCESS';
  };
  const deliveryIds = [];
  for (let i = 0; i < 24; i += 1) {
    const endpoint = endpoints[i % endpoints.length];
    const status = statusFor(i);
    const event = endpoint.events[i % endpoint.events.length];
    const createdAt = daysAgo(i / 3.4 + 0.1);
    const id = did('whd', String(i + 1).padStart(2, '0'));
    deliveryIds.push({ id, endpointId: endpoint.id, status, createdAt });
    await upsertRow(prisma.webhookDelivery, id, {
      endpointId: endpoint.id,
      event,
      payload: {
        id: `evt_demo_${i + 1}`,
        type: event,
        created: Math.floor(createdAt.getTime() / 1000),
        data: { demoSeed: true },
      },
      status,
      statusCode: status === 'SUCCESS' ? 200 : status === 'FAILED' ? 500 : null,
      responseBody: status === 'SUCCESS' ? '{"ok":true}' : status === 'FAILED' ? 'upstream timeout' : null,
      durationMs: status === 'PENDING' ? null : 80 + ((i * 37) % 320),
      attempts: status === 'FAILED' ? 3 : 1,
      createdAt,
      completedAt: status === 'PENDING' ? null : new Date(createdAt.getTime() + 420),
    });
  }

  for (const endpoint of endpoints) {
    const rows = deliveryIds.filter((d) => d.endpointId === endpoint.id);
    const failed = rows.filter((d) => d.status === 'FAILED').length;
    const last = rows.reduce((max, d) => (d.createdAt > max ? d.createdAt : max), new Date(0));
    await prisma.webhookEndpoint.update({
      where: { id: endpoint.id },
      data: {
        totalDeliveries: rows.length,
        failedDeliveries: failed,
        lastTriggered: rows.length ? last : null,
      },
    });
  }
  return endpoints.length + deliveryIds.length;
}

// ---------------------------------------------------------------------------
// Admin: API keys
// ---------------------------------------------------------------------------
async function seedApiKeys(ctx) {
  const specs = [
    {
      key: '01', name: 'Analytics Pipeline', createdBy: 'admin@scholarflow.com',
      scopes: ['analytics:read', 'reports:read'], status: 'ACTIVE',
      totalRequests: 12480, lastUsedHours: 5, days: 45,
      description: 'Nightly export into the lab dashboard.',
    },
    {
      key: '02', name: 'Zotero Sync', createdBy: 'pro.researcher@scholarflow.com',
      scopes: ['papers:read', 'citations:read'], status: 'ACTIVE',
      totalRequests: 3180, lastUsedHours: 31, days: 30,
      description: 'Two-way sync with a personal Zotero library.',
    },
    {
      key: '03', name: 'Thesis Import Bot', createdBy: 'emily.carter@scholarflow.com',
      scopes: ['papers:write', 'collections:write'], status: 'ACTIVE',
      totalRequests: 764, lastUsedHours: 78, days: 18,
      description: 'Imports weekly arXiv drops into the lab collection.',
    },
    {
      key: '04', name: 'Legacy Export (deprecated)', createdBy: 'admin@scholarflow.com',
      scopes: ['export:read'], status: 'REVOKED',
      totalRequests: 214, lastUsedHours: 960, days: 120,
      description: 'Replaced by the Reports module.',
    },
  ];

  for (const spec of specs) {
    const id = did('apikey', spec.key);
    await upsertRow(prisma.apiKey, id, {
      name: spec.name,
      keyHash: `demo_key_hash_${spec.key}`,
      keyPrefix: `sf_live_demo${spec.key}`,
      description: spec.description,
      scopes: spec.scopes,
      status: spec.status,
      rateLimit: 1000,
      createdById: ctx.byEmail[spec.createdBy].id,
      lastUsedAt: daysAgo(0, spec.lastUsedHours),
      totalRequests: spec.totalRequests,
      createdAt: daysAgo(spec.days),
    });
  }

  await prisma.apiKey.updateMany({
    where: { name: 'Test', isDeleted: false },
    data: { isDeleted: true },
  });
  return specs.length;
}

// ---------------------------------------------------------------------------
// Admin: reports
// ---------------------------------------------------------------------------
async function seedReports(ctx) {
  const admin = ctx.byEmail['admin@scholarflow.com'];
  const specs = [
    {
      key: '01', name: 'Weekly Usage Digest', type: 'USAGE', status: 'SCHEDULED', format: 'CSV',
      schedule: '0 9 * * 1', nextRunAt: daysAhead(3), enabled: true, days: 40,
      config: { range: '7d', sections: ['usage', 'top-papers'] },
    },
    {
      key: '02', name: 'Monthly Revenue Summary', type: 'FINANCIAL', status: 'READY', format: 'CSV',
      generatedAt: daysAgo(2), fileSize: '184 KB', enabled: true, days: 62,
      config: { range: '30d' },
    },
    {
      key: '03', name: 'User Growth — Q3', type: 'USER', status: 'READY', format: 'JSON',
      generatedAt: daysAgo(7), fileSize: '96 KB', enabled: true, days: 20,
      config: { quarter: 'Q3', includeDeleted: false },
    },
    {
      key: '04', name: 'Content Moderation Summary', type: 'CONTENT', status: 'GENERATING', format: 'CSV',
      enabled: true, days: 0.1, config: { range: '30d', includeDismissed: true },
    },
    {
      key: '05', name: 'System Health Snapshot', type: 'SYSTEM', status: 'FAILED', format: 'JSON',
      enabled: false, days: 5, config: { error: 'Export worker timed out after 60s' },
    },
  ];

  for (const spec of specs) {
    await upsertRow(prisma.adminReport, did('report', spec.key), {
      name: spec.name,
      description: `${spec.name} (demo data)`,
      type: spec.type,
      status: spec.status,
      format: spec.format,
      fileSize: spec.fileSize || null,
      generatedAt: spec.generatedAt || null,
      schedule: spec.schedule || null,
      nextRunAt: spec.nextRunAt || null,
      recipients: ['admin@scholarflow.com'],
      enabled: spec.enabled,
      config: spec.config || null,
      createdById: admin.id,
      createdAt: daysAgo(spec.days),
    });
  }
  return specs.length;
}

// ---------------------------------------------------------------------------
// Admin: platform settings
// ---------------------------------------------------------------------------
async function seedSettings(ctx) {
  const admin = ctx.byEmail['admin@scholarflow.com'];
  await prisma.systemSetting.upsert({
    where: { key: 'platform' },
    update: { updatedById: admin.id },
    create: {
      key: 'platform',
      value: {
        platformName: 'ScholarFlow',
        supportEmail: 'support@scholarflow.com',
        sessionTimeoutMinutes: 1440,
        emailNotificationsEnabled: true,
        registrationAlertsEnabled: true,
        storageQuotaGb: 100,
        twoFactorRequired: false,
      },
      updatedById: admin.id,
    },
  });
}

// ---------------------------------------------------------------------------
// Per-role engagement
// ---------------------------------------------------------------------------
const NOTIFICATION_SETS = {
  'teamlead@scholarflow.com': [
    ['COMMENT', 'Emily commented on your paper', 'Emily Carter: "The chunking holds up on long PDFs."', 'emily.carter@scholarflow.com', false],
    ['ACHIEVEMENT', 'Milestone: 5,000 chunks embedded', 'Your library crossed 5,000 embedded chunks.', null, true],
  ],
  'pro.researcher@scholarflow.com': [
    ['SHARE', 'Bob shared a paper with you', 'Edit access to "Agent Security Bench".', 'teamlead@scholarflow.com', false],
    ['COMMENT', 'Emily replied to your note', 'Emily Carter: "Try the uncertainty-aware protocol here."', 'emily.carter@scholarflow.com', false],
    ['SYSTEM', 'Weekly research digest', '4 new papers matched your interests this week.', null, true],
  ],
  'researcher@scholarflow.com': [
    ['PAPER', 'New paper matched your topic', 'A new benchmark paper on tool-use safety was added.', null, false],
    ['SYSTEM', 'Storage at 40%', 'Your workspace is using 40% of the free quota.', null, true],
    ['ACHIEVEMENT', 'First citation export', 'You exported your first citation in APA format.', null, true],
  ],
  'admin@scholarflow.com': [
    ['SYSTEM', 'Nightly backup completed', 'Database backup finished in 42 seconds.', null, true],
    ['SYSTEM', '12 new registrations', 'Registration volume is up 24% this week.', null, false],
    ['SYSTEM', 'Moderation queue needs review', '3 reports are waiting in the moderation queue.', null, false],
  ],
  'emily.carter@scholarflow.com': [
    ['COMMENT', 'Bob replied to your comment', 'Bob: "Agreed — let us map the cases onto those stages."', 'teamlead@scholarflow.com', false],
    ['MENTION', 'You were mentioned in a discussion', 'Sofia mentioned you in "Reproducibility checklist".', 'sofia.rodriguez@scholarflow.com', false],
    ['PAPER', 'Your paper passed extraction', 'Embeddings are ready for your latest upload.', null, true],
  ],
  'michael.chen@scholarflow.com': [
    ['SHARE', 'Bob shared a paper with you (view only)', 'You can read "InjecAgent" but not edit it.', 'teamlead@scholarflow.com', false],
    ['SYSTEM', 'Access request approved', 'Your workspace access was extended.', null, true],
    ['COLLECTION', 'New collection shared', 'Agent Security was shared with you.', 'teamlead@scholarflow.com', true],
  ],
  'sofia.rodriguez@scholarflow.com': [
    ['SHARE', 'Bob shared a paper with you', 'Edit access to "DebUnc: Uncertainty-Aware Debate".', 'teamlead@scholarflow.com', false],
    ['COMMENT', 'Michael commented on your paper', 'Michael Chen: "Great baseline choice."', 'michael.chen@scholarflow.com', false],
    ['SYSTEM', 'Annual plan renewed', 'Your Pro annual subscription renewed successfully.', null, true],
  ],
  'david.okafor@scholarflow.com': [
    ['SHARE', 'Emily shared a collection', 'You now have access to "Quantum Notes".', 'emily.carter@scholarflow.com', false],
    ['COMMENT', 'Sofia replied in a discussion', 'Sofia Rodriguez: "The table mapping is convincing."', 'sofia.rodriguez@scholarflow.com', false],
    ['SYSTEM', 'Team invoice paid', 'Your Team monthly invoice was paid.', null, true],
  ],
  'aisha.khan@scholarflow.com': [
    ['SHARE', 'Bob shared a paper with you', 'View access to "MCPTox".', 'teamlead@scholarflow.com', false],
    ['SYSTEM', 'Subscription canceled', 'Your Team plan is Canceled — access continues until the period end.', null, false],
    ['ACHIEVEMENT', 'Annotation streak', 'You annotated papers 5 days in a row.', null, true],
  ],
  'lucas.meyer@scholarflow.com': [
    ['INVITE', 'You were invited to a workspace', 'Bob invited you to the ML workspace.', 'teamlead@scholarflow.com', false],
    ['SHARE', 'Emily shared a paper with you', 'Edit access to "IMAD: Multi-Agent Debate".', 'emily.carter@scholarflow.com', false],
    ['SYSTEM', 'Annual plan active', 'Your Team annual subscription is active.', null, true],
  ],
};

function usageKindFor(email, i) {
  const adminKinds = email === 'admin@scholarflow.com';
  const pool = adminKinds ? ADMIN_USAGE_KINDS : USAGE_KINDS;
  return pool[i % pool.length];
}

async function seedEngagement(ctx) {
  let totals = { notifications: 0, usage: 0, searches: 0, exports: 0, notes: 0, annotations: 0, threads: 0, aiChats: 0, insight: 0, activity: 0 };

  for (const email of DEMO_EMAILS) {
    const user = ctx.byEmail[email];
    const s = slug(email);
    const config = ENGAGEMENT[email];
    const ownPapers = ctx.papers[email];
    const ownCollections = ctx.collections[email];
    const ownWorkspace = ctx.workspaces[email];

    // Notifications
    const notifs = NOTIFICATION_SETS[email] || [];
    for (let i = 0; i < notifs.length; i += 1) {
      const [type, title, message, actor, read] = notifs[i];
      await upsertRow(prisma.notification, did('notif', s, String(i + 1).padStart(2, '0')), {
        userId: user.id,
        type,
        title,
        message,
        actorId: actor ? ctx.byEmail[actor].id : null,
        read: Boolean(read),
        starred: i === 0 && email === 'admin@scholarflow.com',
        actionUrl: '/dashboard/notifications',
        createdAt: daysAgo(i * 1.7 + 0.3),
      });
      totals.notifications += 1;
    }

    // Usage events spread over 30 days
    for (let i = 0; i < config.usage; i += 1) {
      await upsertRow(prisma.usageEvent, did('use', s, String(i + 1).padStart(3, '0')), {
        userId: user.id,
        workspaceId: ownWorkspace ? ownWorkspace.id : null,
        kind: usageKindFor(email, i),
        units: 1,
        paperId: ownPapers.length ? ownPapers[i % ownPapers.length].id : null,
        createdAt: daysAgo((i % 30) + (i % 5) * 0.05),
      });
      totals.usage += 1;
    }

    // Search history
    for (let i = 0; i < config.searches; i += 1) {
      const query = i % 2 === 0 ? SEARCH_POOL[(i + user.email.length) % SEARCH_POOL.length] : QUERY_POOL[(i * 3) % QUERY_POOL.length];
      await upsertRow(prisma.searchHistory, did('search', s, String(i + 1).padStart(2, '0')), {
        userId: user.id,
        query,
        filters: { type: i % 2 === 0 ? 'semantic' : 'papers' },
        results: { count: 2 + (i % 5) },
        createdAt: daysAgo(i * 0.9 + 0.2),
      });
      totals.searches += 1;
    }

    // Citation exports
    const formats = ['APA', 'BIBTEX', 'IEEE', 'MLA'];
    for (let i = 0; i < config.exports && ownPapers.length; i += 1) {
      const paper = ownPapers[i % ownPapers.length];
      await upsertRow(prisma.citationExport, did('export', s, String(i + 1).padStart(2, '0')), {
        userId: user.id,
        paperId: paper.id,
        format: formats[i % formats.length],
        content: `${paper.title} — ${formats[i % formats.length]} citation (demo)`,
        metadata: { count: 1 },
        exportedAt: daysAgo(i * 2.2 + 0.6),
        createdAt: daysAgo(i * 2.2 + 0.6),
      });
      totals.exports += 1;
    }

    // Research notes
    const noteTitles = [
      ['Reproducibility checklist', 'FINDINGS', 'Re-run every headline number with a fixed seed before submission.'],
      ['Related-work gaps', 'LITERATURE', 'Missing comparison against the 2025 tool-use safety surveys.'],
      ['Method sketch', 'METHODOLOGY', 'Two-stage protocol: screening pass, then uncertainty-weighted debate.'],
    ];
    for (let i = 0; i < config.notes; i += 1) {
      const [title, noteType, content] = noteTitles[i % noteTitles.length];
      await upsertRow(prisma.researchNote, did('note', s, String(i + 1).padStart(2, '0')), {
        userId: user.id,
        paperId: ownPapers.length ? ownPapers[i % ownPapers.length].id : null,
        title,
        content,
        tags: ['demo', noteType.toLowerCase()],
        noteType,
        visibility: 'PRIVATE',
        isStarred: i === 0,
        wordCount: content.split(/\s+/).length,
        excerpt: content.slice(0, 80),
        createdAt: daysAgo(i * 1.4 + 0.4),
      });
      totals.notes += 1;
    }

    // Annotations (not for Michael — keeps the view-only story clean)
    for (let i = 0; i < config.annotations && ownPapers.length; i += 1) {
      const paper = ownPapers[i % ownPapers.length];
      await upsertRow(prisma.annotation, did('ann', s, String(i + 1).padStart(2, '0')), {
        paperId: paper.id,
        userId: user.id,
        type: i % 3 === 0 ? 'COMMENT' : 'HIGHLIGHT',
        text: i % 3 === 0 ? 'Worth citing in related work.' : 'Key claim to verify.',
        color: i % 3 === 0 ? '#2196F3' : '#FFEB3B',
        positionIndex: i,
        anchor: {
          page: 1 + (i % 4),
          viewport: { scale: 1.2, rotation: 0 },
          coordinates: { x: 0.14, y: 0.24 + (i % 5) * 0.08, width: 0.48, height: 0.03 },
          selectedText: 'robustness of multi-agent deliberation',
        },
        createdAt: daysAgo(i * 1.1 + 0.5),
      });
      totals.annotations += 1;
    }

    // Discussion thread in the user's own workspace + replies
    if (ownWorkspace) {
      const threadId = did('disc', s, '01');
      await upsertRow(prisma.discussionThread, threadId, {
        workspaceId: ownWorkspace.id,
        userId: user.id,
        title: i0Title(email),
        content: i0Body(email),
        isPinned: email === 'teamlead@scholarflow.com',
        tags: ['demo', 'planning'],
        createdAt: daysAgo(6.4),
      });
      const responders = ['emily.carter@scholarflow.com', 'pro.researcher@scholarflow.com', 'sofia.rodriguez@scholarflow.com'].filter((e) => e !== email);
      const replies = [
        `${user.name || 'Member'} — I ran the same check and got the same ordering.`,
        'One caveat: the long-PDF slice is small, so treat the gap as directional.',
        'Agreed. I will add the full table to the shared collection tonight.',
      ];
      for (let i = 0; i < 3; i += 1) {
        await upsertRow(prisma.discussionMessage, did('disc', s, '01', String(i + 1).padStart(2, '0')), {
          threadId,
          userId: ctx.byEmail[responders[i % responders.length]].id,
          content: replies[i],
          createdAt: daysAgo(6.2 - i * 0.3),
        });
        totals.threads += 1;
      }
      totals.threads += 1;
    }

    // AI chat history
    for (let i = 0; i < config.aiChats; i += 1) {
      const convId = did('conv', s, String(i + 1).padStart(2, '0'));
      const contextPaper = ownPapers.length ? ownPapers[i % ownPapers.length] : null;
      await upsertRow(prisma.aIConversation, convId, {
        userId: user.id,
        title: contextPaper ? `Questions about ${contextPaper.title}` : 'Research planning',
        model: 'gpt-5.4-mini',
        workspaceId: ownWorkspace ? ownWorkspace.id : null,
        context: contextPaper ? { type: 'paper', id: contextPaper.id, title: contextPaper.title } : null,
        createdAt: daysAgo(i * 1.8 + 1),
      });
      const turns = [
        ['user', contextPaper ? `Summarize the main contribution of ${contextPaper.title} in two sentences.` : 'Draft a reading plan for this week.'],
        ['assistant', 'The paper proposes a staged evaluation protocol and shows consistent gains over the baseline across three benchmarks.'],
        ['user', 'What are the limitations?'],
        ['assistant', 'The evaluation covers English-only datasets and two model families; the long-context slice is small, so the robustness claim is directional.'],
      ];
      for (let t = 0; t < turns.length; t += 1) {
        await upsertRow(prisma.aIConversationMessage, did('conv', s, String(i + 1).padStart(2, '0'), 'm', String(t + 1)), {
          conversationId: convId,
          role: turns[t][0],
          content: turns[t][1],
          model: turns[t][0] === 'assistant' ? 'gpt-5.4-mini' : null,
          tokensUsed: turns[t][0] === 'assistant' ? 180 + t * 24 : null,
          costCents: turns[t][0] === 'assistant' ? 0.06 : null,
          createdAt: daysAgo(i * 1.8 + 1, -t * 0.02),
        });
      }
      totals.aiChats += 1;
    }

    // AI insight thread on a paper
    if (config.insightThreads > 0 && ownPapers.length) {
      const paper = ownPapers[0];
      const threadId = did('insight', s, '01');
      await upsertRow(prisma.aIInsightThread, threadId, {
        paperId: paper.id,
        userId: user.id,
        title: `Questions about ${paper.title}`,
        metadata: { model: 'gpt-5.4-mini' },
        createdAt: daysAgo(2.6),
      });
      const qa = [
        ['user', 'What problem does this paper solve?'],
        ['assistant', 'It tackles unsafe tool use in agent pipelines and proposes an evaluation-driven defense.'],
        ['user', 'Which result is the strongest?'],
        ['assistant', 'The staged protocol reduces attack success while keeping task accuracy within 3% of the baseline.'],
      ];
      for (let t = 0; t < qa.length; t += 1) {
        await upsertRow(prisma.aIInsightMessage, did('insight', s, '01', 'm', String(t + 1)), {
          threadId,
          paperId: paper.id,
          role: qa[t][0],
          content: qa[t][1],
          createdById: qa[t][0] === 'user' ? user.id : null,
          createdAt: daysAgo(2.6, -t * 0.05),
        });
      }
    }

    // Audit trail entries across entities
    const entities = [
      ['paper', 'created', 'Uploaded a new paper to the workspace'],
      ['paper', 'updated', 'Updated the abstract after review'],
      ['collection', 'created', 'Created a topic collection'],
      ['annotation', 'created', 'Highlighted a key finding'],
      ['discussion', 'created', 'Opened a discussion thread'],
      ['citation', 'exported', 'Exported citations in APA format'],
      ['workspace', 'updated', 'Adjusted workspace settings'],
      ['member', 'joined', 'A collaborator accepted an invitation'],
      ['ai', 'summarized', 'Generated an AI summary'],
      ['paper', 'shared', 'Shared a paper with view access'],
    ];
    for (let i = 0; i < entities.length; i += 1) {
      const [entity, action, message] = entities[i];
      const entityId =
        entity === 'paper' && ownPapers.length
          ? ownPapers[i % ownPapers.length].id
          : entity === 'collection' && ownCollections.length
            ? ownCollections[i % ownCollections.length].id
            : ownWorkspace
              ? ownWorkspace.id
              : user.id;
      await upsertRow(prisma.activityLogEntry, did('audit', s, String(i + 1).padStart(2, '0')), {
        userId: user.id,
        workspaceId: ownWorkspace ? ownWorkspace.id : null,
        entity,
        entityId,
        action,
        details: { message },
        severity: i === 4 ? 'WARNING' : 'INFO',
        createdAt: daysAgo(i * 2.7 + 0.5),
      });
      totals.activity += 1;
    }

    // Preference row (upsert by userId — not demo-prefixed)
    await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        theme: 'system',
        language: 'en',
        defaultCitationStyle: 'APA',
        notificationPreferences: { email: true, push: true, digest: true },
        privacySettings: { profileVisibility: 'team', showActivity: true },
      },
    });
  }

  return totals;
}

function i0Title(email) {
  const titles = {
    'teamlead@scholarflow.com': 'Cross-lab reproducibility checklist',
    'pro.researcher@scholarflow.com': 'Which uncertainty metric should we standardize on?',
    'researcher@scholarflow.com': 'Benchmark contamination — how strict should we be?',
    'admin@scholarflow.com': 'Platform policy: retention for deleted workspaces',
    'emily.carter@scholarflow.com': 'Long-PDF chunking strategy',
    'michael.chen@scholarflow.com': 'Reading list for the safety survey',
    'sofia.rodriguez@scholarflow.com': 'Protocol for the ablation rerun',
    'david.okafor@scholarflow.com': 'Dataset licensing check',
    'aisha.khan@scholarflow.com': 'Quantum benchmark baselines',
    'lucas.meyer@scholarflow.com': 'Neuroscience dataset pairing',
  };
  return titles[email] || 'Research planning';
}

function i0Body(email) {
  const bodies = {
    'teamlead@scholarflow.com': 'Pinned: add every headline number to the shared sheet before Friday. Reply here with the slice you own.',
    'pro.researcher@scholarflow.com': 'Calibration vs. entropy — which one holds up on the long-context slice? Post your numbers here.',
    'researcher@scholarflow.com': 'Proposal: flag any benchmark overlap above 15% and rerun the subset. Thoughts?',
    'admin@scholarflow.com': 'Draft policy: deleted workspaces are retained for 30 days, then purged. Objections by Friday.',
    'emily.carter@scholarflow.com': 'Two-stage chunking held accuracy on the 80-page PDFs. Posting the config for review.',
    'michael.chen@scholarflow.com': 'Collecting the key surveys for the related-work section — add anything missing.',
    'sofia.rodriguez@scholarflow.com': 'Rerunning the ablation with a fixed seed tonight; results in the morning.',
    'david.okafor@scholarflow.com': 'Checking whether the dataset license allows redistribution of the processed split.',
    'aisha.khan@scholarflow.com': 'Baselines for the quantum benchmark need a second implementation. Volunteers?',
    'lucas.meyer@scholarflow.com': 'Pairing the EEG corpus with the behavioral labels — checking alignment first.',
  };
  return bodies[email] || 'Planning thread for the next sprint.';
}

async function main() {
  if (CLEANUP) {
    await cleanup();
    return;
  }

  console.log('Seeding demo extras...\n');
  const ctx = await loadContext();
  log(`users loaded: ${DEMO_EMAILS.length}`);

  const moderation = await seedModeration(ctx);
  log(`content reports: ${moderation}`);

  const alerts = await seedAlerts(ctx);
  log(`system alerts: ${alerts}`);

  const webhooks = await seedWebhooks(ctx);
  log(`webhook endpoints + deliveries: ${webhooks}`);

  const apiKeys = await seedApiKeys(ctx);
  log(`api keys: ${apiKeys}`);

  const reports = await seedReports(ctx);
  log(`admin reports: ${reports}`);

  await seedSettings(ctx);
  log('platform settings persisted');

  const engagement = await seedEngagement(ctx);
  log(
    `engagement: ${engagement.notifications} notifications, ${engagement.usage} usage events, ` +
      `${engagement.searches} searches, ${engagement.exports} exports, ${engagement.notes} notes, ` +
      `${engagement.annotations} annotations, ${engagement.threads} discussion rows, ` +
      `${engagement.aiChats} ai chats, ${engagement.activity} audit entries`
  );

  console.log('\nDone. Re-run anytime (idempotent); use --cleanup to remove demo extras.');
}

main()
  .catch((error) => {
    console.error('\nSeeder failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
