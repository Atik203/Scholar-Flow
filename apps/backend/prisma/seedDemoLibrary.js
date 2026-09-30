/**
 * Demo library seeder — fills every demo role with a real, coherent library.
 *
 * Uploads the curated PDF set (IntentGate + FYDP folders) to S3, runs the real
 * extraction pipeline (text chunks + pgvector embeddings), then builds the
 * supporting demo data: workspaces, members, collections, a citation network
 * (for the Citation Graph), annotations, notebooks/notes, discussions,
 * notifications, analytics events, and activity entries.
 *
 * Usage:
 *   yarn ts-node --transpile-only prisma/seedDemoLibrary.js
 *   yarn ts-node --transpile-only prisma/seedDemoLibrary.js --cleanup-e2e
 *   yarn ts-node --transpile-only prisma/seedDemoLibrary.js --cleanup
 *   yarn ts-node --transpile-only prisma/seedDemoLibrary.js --limit=1
 *   yarn ts-node --transpile-only prisma/seedDemoLibrary.js --skip-extraction
 *   yarn ts-node --transpile-only prisma/seedDemoLibrary.js --extract-only
 *
 * Idempotent: existing papers are detected by PaperFile.originalFilename +
 * uploader, so re-runs only create what is missing.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fs = require('fs');
const { PrismaClient } = require('../src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { StorageService } = require('../src/app/modules/papers/storage.service');
const {
  documentExtractionService,
} = require('../src/app/services/documentExtractionService');

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(`--${name}`);
const getArg = (name, fallback) => {
  const match = args.find((a) => a.startsWith(`--${name}=`));
  return match ? match.split('=')[1] : fallback;
};

const LIMIT = getArg('limit') ? parseInt(getArg('limit'), 10) : null;
const CLEANUP = hasFlag('cleanup');
const CLEANUP_E2E = hasFlag('cleanup-e2e');
const SKIP_EXTRACTION = hasFlag('skip-extraction');
const EXTRACT_ONLY = hasFlag('extract-only');

// ---------------------------------------------------------------------------
// Curated PDF set
// ---------------------------------------------------------------------------

const SECURITY_DIR = 'E:/PROJECT/IntentGate/pdfs';
const DEBATE_DIR = 'E:/FYDP/pdfs';

const PDFS = [
  {
    file: 'ASB.pdf',
    dir: SECURITY_DIR,
    cluster: 'security',
    title:
      'Agent Security Bench (ASB): A Benchmark for Attacks and Defenses in LLM Agents',
    authors: ['Zhang, H.', 'Cui, J.', 'Lu, Y.'],
    year: 2024,
    venue: 'arXiv preprint',
    tags: ['agent-security', 'llm-agents', 'benchmark', 'attacks'],
    abstract:
      'A comprehensive benchmark that formalizes attacks and defenses across the LLM agent pipeline, covering planning, memory and tool use. It evaluates ten attack types and ten defense strategies across thirteen LLM backbones on novel agent tasks.',
  },
  {
    file: 'InjectAgent.pdf',
    dir: SECURITY_DIR,
    cluster: 'security',
    title:
      'InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated LLM Agents',
    authors: ['Zhan, Q.', 'Liang, Z.', 'Ying, Z.'],
    year: 2024,
    venue: 'ACL Findings',
    tags: ['prompt-injection', 'tool-use', 'agent-security', 'benchmark'],
    abstract:
      'Studies how attackers can hijack tool-integrated LLM agents through indirect prompt injections embedded in tool outputs. Introduces a benchmark of 1,054 attack cases over 17 user tools and 62 attacker tools.',
  },
  {
    file: 'MCPTox.pdf',
    dir: SECURITY_DIR,
    cluster: 'security',
    title:
      'MCPTox: Tool Poisoning Attacks on Model Context Protocol Servers',
    authors: ['Wang, Z.', 'Chen, K.', 'Liu, X.'],
    year: 2025,
    venue: 'arXiv preprint',
    tags: ['mcp', 'tool-poisoning', 'agent-security', 'attacks'],
    abstract:
      'Reveals that poisoned tool descriptions served through the Model Context Protocol can manipulate agent behavior, exfiltrate data and bypass safety policies. Evaluates attack success across popular MCP clients and agent frameworks.',
  },
  {
    file: 'ToolGate.pdf',
    dir: SECURITY_DIR,
    cluster: 'security',
    title:
      'ToolGate: Guarding Tool-Integrated Agents Against Poisoned Tool Descriptions',
    authors: ['Li, R.', 'Zhao, M.', 'Sun, P.'],
    year: 2025,
    venue: 'arXiv preprint',
    tags: ['defense', 'tool-use', 'agent-security', 'tool-poisoning'],
    abstract:
      'Proposes a runtime gate that verifies tool descriptions and invocation traces before an agent acts on them. Reduces tool-poisoning success rates while preserving task utility on agentic benchmarks.',
  },
  {
    file: 'CONSENSAGENT.pdf',
    dir: DEBATE_DIR,
    cluster: 'debate',
    title:
      'ConsensAgent: Consensus-Based Multi-Agent Collaboration for Complex Research Tasks',
    authors: ['Kushwaha, P.', 'Madhavan, S. A.'],
    year: 2025,
    venue: 'arXiv preprint',
    tags: ['multi-agent', 'consensus', 'collaboration', 'llm'],
    abstract:
      'A multi-agent framework where specialized agents iteratively propose, critique and converge on answers through a consensus protocol. Improves factual accuracy and coverage on complex research-style tasks.',
  },
  {
    file: 'DebUnc.pdf',
    dir: DEBATE_DIR,
    cluster: 'debate',
    title:
      'DebUnc: Uncertainty-Aware Debate for Large Language Model Reasoning',
    authors: ['Nakamura, R.', 'Gupta, A.'],
    year: 2025,
    venue: 'arXiv preprint',
    tags: ['debate', 'uncertainty', 'reasoning', 'multi-agent'],
    abstract:
      'Introduces uncertainty-aware communication between debating agents, weighting arguments by calibrated confidence. Shows that uncertainty signals improve both answer quality and robustness under adversarial agents.',
  },
  {
    file: 'estornell_liu.pdf',
    dir: DEBATE_DIR,
    cluster: 'debate',
    title:
      'Multi-Agent Deliberation and the Wisdom of Crowds in LLM Ensembles',
    authors: ['Estornell, A.', 'Liu, Y.'],
    year: 2025,
    venue: 'arXiv preprint',
    tags: ['debate', 'aggregation', 'wisdom-of-crowds', 'llm'],
    abstract:
      'Analyzes when multi-agent deliberation outperforms simple aggregation of independent model answers, and identifies conditions under which deliberation amplifies errors instead of correcting them.',
  },
  {
    file: 'IMAD.pdf',
    dir: DEBATE_DIR,
    cluster: 'debate',
    title:
      'IMAD: Information-Theoretic Multi-Agent Debate for Robust Reasoning',
    authors: ['Shen, T.', 'Kim, J.'],
    year: 2025,
    venue: 'arXiv preprint',
    tags: ['debate', 'information-theory', 'robustness', 'multi-agent'],
    abstract:
      'Frames multi-agent debate as information aggregation and selects debate partners to maximize mutual information. Yields more robust reasoning under misleading or adversarial arguments.',
  },
  {
    file: 'Minority .pdf',
    dir: DEBATE_DIR,
    cluster: 'debate',
    title:
      'Minority-Veto: Robustness of Multi-Agent Deliberation under Adversarial Majorities',
    authors: ['Haddad, N.', 'Petrov, D.'],
    year: 2025,
    venue: 'arXiv preprint',
    tags: ['debate', 'robustness', 'adversarial', 'minority'],
    abstract:
      'Shows that a small truthful minority can be drowned out during debate, and introduces a veto mechanism that lets low-agreement signals block unsafe consensus.',
  },
  {
    file: 'MoA.pdf',
    dir: DEBATE_DIR,
    cluster: 'debate',
    title:
      'Mixture-of-Agents: Layered Collaboration of Large Language Models',
    authors: ['Wang, J.', 'Wang, L.', 'Zhang, Y.'],
    year: 2024,
    venue: 'arXiv preprint',
    tags: ['mixture-of-agents', 'collaboration', 'llm', 'aggregation'],
    abstract:
      'Introduces a layered mixture-of-agents architecture in which models iteratively refine each other\u2019s answers within and across layers. Achieves state-of-the-art results on several benchmarks using open models.',
  },
];

const PDF_FILENAMES = PDFS.map((p) => p.file);

// Citation network (file key -> file key) applied inside each user\u2019s library.
const CITATION_EDGES = [
  ['InjectAgent.pdf', 'ToolGate.pdf', 'Discusses defenses evaluated against indirect injection attacks.'],
  ['InjectAgent.pdf', 'ASB.pdf', 'Uses the attack taxonomy introduced by the benchmark.'],
  ['ASB.pdf', 'MCPTox.pdf', 'Extends the attack evaluation to poisoned tool descriptions.'],
  ['MCPTox.pdf', 'ToolGate.pdf', 'Compares against runtime tool-verification defenses.'],
  ['ToolGate.pdf', 'ASB.pdf', 'Reports defense efficacy on the benchmark suite.'],
  ['MoA.pdf', 'CONSENSAGENT.pdf', 'Motivates layered agent collaboration.'],
  ['CONSENSAGENT.pdf', 'DebUnc.pdf', 'Adopts uncertainty-aware critique messages.'],
  ['DebUnc.pdf', 'IMAD.pdf', 'Builds on information-theoretic partner selection.'],
  ['Minority.pdf', 'IMAD.pdf', 'Analyzes failure modes under adversarial majorities.'],
  ['estornell_liu.pdf', 'DebUnc.pdf', 'Provides the wisdom-of-crowds analysis cited for debate design.'],
  ['CONSENSAGENT.pdf', 'MCPTox.pdf', 'Motivates securing agent tool access in collaborations.'],
  ['DebUnc.pdf', 'ASB.pdf', 'Evaluates robustness against agent-level attacks.'],
  ['IMAD.pdf', 'ToolGate.pdf', 'Applies gated verification to debate participants.'],
  ['MoA.pdf', 'InjectAgent.pdf', 'Discusses injection risks in multi-model pipelines.'],
  ['Minority.pdf', 'CONSENSAGENT.pdf', 'Challenges consensus protocols under adversarial participants.'],
  ['ToolGate.pdf', 'MCPTox.pdf', 'Responds directly to tool-poisoning threat models.'],
];

const fileIdByKey = (file) => file.replace('.pdf', '').replace(' ', '').toLowerCase();
const EDGE_BY_PAIR = new Map(
  CITATION_EDGES.map(([from, to, context]) => [`${from}|${to}`, context])
);

// Normalize "Minority .pdf" for lookups
const normalize = (f) => f.replace(/\s+/g, ' ').trim();
const PDF_BY_KEY = new Map(PDFS.map((p) => [normalize(p.file), p]));

// ---------------------------------------------------------------------------
// Demo users and per-role paper distribution
// ---------------------------------------------------------------------------

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

const ASSIGNMENTS = [
  { email: 'teamlead@scholarflow.com', primary: true, files: PDF_FILENAMES.map(normalize) },
  {
    email: 'pro.researcher@scholarflow.com',
    files: ['ASB.pdf', 'InjectAgent.pdf', 'MCPTox.pdf', 'ToolGate.pdf', 'MoA.pdf', 'DebUnc.pdf'],
  },
  {
    email: 'emily.carter@scholarflow.com',
    workspaceName: 'Emily Carter Lab',
    files: ['CONSENSAGENT.pdf', 'DebUnc.pdf', 'estornell_liu.pdf', 'IMAD.pdf', 'Minority .pdf'],
  },
  {
    email: 'michael.chen@scholarflow.com',
    workspaceName: 'Michael Chen Workspace',
    files: ['MoA.pdf', 'ASB.pdf', 'InjectAgent.pdf', 'IMAD.pdf'],
  },
  {
    email: 'researcher@scholarflow.com',
    files: ['MCPTox.pdf', 'ToolGate.pdf', 'ASB.pdf'],
  },
  {
    email: 'admin@scholarflow.com',
    files: ['MoA.pdf', 'DebUnc.pdf', 'ASB.pdf'],
  },
  {
    email: 'sofia.rodriguez@scholarflow.com',
    workspaceName: 'Sofia Rodriguez Lab',
    files: ['InjectAgent.pdf', 'CONSENSAGENT.pdf'],
  },
  {
    email: 'david.okafor@scholarflow.com',
    workspaceName: 'David Okafor Group',
    files: ['MCPTox.pdf', 'IMAD.pdf'],
  },
  {
    email: 'aisha.khan@scholarflow.com',
    workspaceName: 'Aisha Khan Lab',
    files: ['ToolGate.pdf', 'DebUnc.pdf'],
  },
  {
    email: 'lucas.meyer@scholarflow.com',
    workspaceName: 'Lucas Meyer Research',
    files: ['ASB.pdf', 'Minority .pdf'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log('  ', ...a);
const step = (title) => console.log(`\n=== ${title} ===`);

const daysAgo = (days, jitterHours = 8) =>
  new Date(Date.now() - days * 86400000 - Math.floor(Math.random() * jitterHours) * 3600000);

const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;
const excerptOf = (text, n = 160) => text.replace(/\s+/g, ' ').slice(0, n);

async function byEmail(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`Demo user missing: ${email} — run prisma/seed.js first`);
  return user;
}

async function ensureWorkspace(user, preferredName) {
  const existing = await prisma.workspace.findFirst({
    where: { ownerId: user.id, isDeleted: false },
    orderBy: { createdAt: 'asc' },
  });
  if (existing) {
    const member = await prisma.workspaceMember.findFirst({
      where: { workspaceId: existing.id, userId: user.id },
    });
    if (!member) {
      await prisma.workspaceMember.create({
        data: { workspaceId: existing.id, userId: user.id, role: 'OWNER' },
      });
    } else if (member.isDeleted) {
      await prisma.workspaceMember.update({
        where: { id: member.id },
        data: { isDeleted: false },
      });
    }
    return { workspace: existing, created: false };
  }

  const name = preferredName || `${user.firstName || 'Demo'} Workspace`;
  const workspace = await prisma.workspace.create({
    data: {
      name,
      description: `Research workspace for ${user.name || user.email}`,
      ownerId: user.id,
      color: 'blue',
      visibility: 'PRIVATE',
    },
  });
  await prisma.workspaceSettings.create({ data: { workspaceId: workspace.id } });
  await prisma.workspaceMember.create({
    data: { workspaceId: workspace.id, userId: user.id, role: 'OWNER' },
  });
  return { workspace, created: true };
}

async function waitForEmbeddings(paperId, timeoutMs = 120000) {
  const started = Date.now();
  for (;;) {
    const pending = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS pending FROM "PaperChunk"
      WHERE "paperId" = ${paperId} AND "isDeleted" = false AND embedding IS NULL
    `;
    if (pending[0]?.pending === 0) return true;
    if (Date.now() - started > timeoutMs) return false;
    await sleep(2000);
  }
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

async function cleanupSeededData() {
  step('Cleanup: seeded demo library');
  const users = await prisma.user.findMany({ where: { email: { in: DEMO_EMAILS } } });
  const userIds = users.map((u) => u.id);

  const files = await prisma.paperFile.findMany({
    where: { originalFilename: { in: PDF_FILENAMES }, paper: { uploaderId: { in: userIds } } },
    select: { paperId: true },
  });
  const paperIds = files.map((f) => f.paperId);

  if (paperIds.length) {
    await prisma.citation.deleteMany({
      where: { OR: [{ sourcePaperId: { in: paperIds } }, { targetPaperId: { in: paperIds } }] },
    });
    await prisma.paperShare.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.usageEvent.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.annotation.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.collectionPaper.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.researchNote.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.discussionMessage.deleteMany({ where: { thread: { paperId: { in: paperIds } } } });
    await prisma.discussionThread.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.paperChunk.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.paperFile.deleteMany({ where: { paperId: { in: paperIds } } });
    await prisma.paper.deleteMany({ where: { id: { in: paperIds } } });
  }

  // Draft papers created by the seeder (no file)
  const drafts = await prisma.paper.findMany({
    where: { uploaderId: { in: userIds }, title: { startsWith: 'Thesis Draft' } },
    select: { id: true },
  });
  if (drafts.length) {
    await prisma.paper.deleteMany({ where: { id: { in: drafts.map((d) => d.id) } } });
  }

  await prisma.collectionPaper.deleteMany({
    where: { collection: { ownerId: { in: userIds } } },
  });
  await prisma.collectionMember.deleteMany({
    where: { collection: { ownerId: { in: userIds } } },
  });
  await prisma.collection.deleteMany({ where: { ownerId: { in: userIds } } });

  await prisma.researchNote.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.notebookSection.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.notebook.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.discussionMessage.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.discussionThread.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.searchHistory.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.citationExport.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.usageEvent.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.activityLogEntry.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.workspaceInvitation.deleteMany({ where: { invitedById: { in: userIds } } });
  await prisma.workspaceMember.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.workspaceSettings.deleteMany({ where: { workspace: { ownerId: { in: userIds } } } });
  await prisma.workspace.deleteMany({
    where: {
      ownerId: { in: userIds },
      name: {
        in: [
          'Emily Carter Lab',
          'Michael Chen Workspace',
          'Sofia Rodriguez Lab',
          'David Okafor Group',
          'Aisha Khan Lab',
          'Lucas Meyer Research',
        ],
      },
    },
  });

  log(`Removed ${paperIds.length} seeded papers + supporting demo data`);
}

async function cleanupE2E() {
  step('Cleanup: e2e test junk');
  const users = await prisma.user.findMany({
    where: { email: { startsWith: 'e2e.' } },
    select: { id: true },
  });
  const userIds = users.map((u) => u.id);
  if (!userIds.length) {
    log('No e2e users found');
    return;
  }

  const papers = await prisma.paper.updateMany({
    where: { uploaderId: { in: userIds } },
    data: { isDeleted: true },
  });
  const workspaces = await prisma.workspace.updateMany({
    where: { ownerId: { in: userIds } },
    data: { isDeleted: true },
  });
  const collections = await prisma.collection.updateMany({
    where: { ownerId: { in: userIds } },
    data: { isDeleted: true },
  });
  await prisma.workspaceMember.updateMany({
    where: { userId: { in: userIds } },
    data: { isDeleted: true },
  });
  await prisma.user.updateMany({ where: { id: { in: userIds } }, data: { isDeleted: true } });

  log(
    `Soft-deleted ${userIds.length} e2e users, ${papers.count} papers, ` +
      `${workspaces.count} workspaces, ${collections.count} collections`
  );
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

async function seedSinglePaper(user, workspaceId, pdf, index) {
  const existing = await prisma.paperFile.findFirst({
    where: { originalFilename: pdf.file, paper: { uploaderId: user.id } },
  });
  if (existing) return { paperId: existing.paperId, skipped: true };

  const filePath = path.join(pdf.dir, pdf.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`   ! missing file: ${filePath}`);
    return null;
  }

  const buffer = fs.readFileSync(filePath);
  const safeName = pdf.file.replace(/[^a-zA-Z0-9._-]/g, '-');
  const objectKey = `papers/${workspaceId}/${Date.now()}-${index}-${safeName}`;
  await StorageService.putObject({
    key: objectKey,
    body: buffer,
    contentType: 'application/pdf',
  });

  const paper = await prisma.paper.create({
    data: {
      workspaceId,
      uploaderId: user.id,
      title: pdf.title,
      abstract: pdf.abstract,
      metadata: {
        authors: pdf.authors,
        year: pdf.year,
        venue: pdf.venue,
        keywords: pdf.tags,
      },
      source: 'upload',
      isDraft: false,
      isPublished: true,
      processingStatus: 'UPLOADED',
      originalFormat: 'pdf',
      originalMimeType: 'application/pdf',
      language: 'en',
      tags: pdf.tags,
      citationCount: pdf.cluster === 'security' ? 40 + index * 7 : 25 + index * 5,
    },
  });

  await prisma.paperFile.create({
    data: {
      paperId: paper.id,
      storageProvider: 's3',
      objectKey,
      contentType: 'application/pdf',
      sizeBytes: buffer.length,
      originalFilename: pdf.file,
    },
  });

  return { paperId: paper.id, skipped: false };
}

async function extractPaper(paperId, title) {
  const t0 = Date.now();
  const result = await documentExtractionService.extractFromDocument(paperId);
  if (!result.success) {
    console.warn(`   ! extraction failed for "${title}": ${result.error}`);
    return false;
  }
  const done = await waitForEmbeddings(paperId);
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  log(`extracted + embedded "${title.slice(0, 60)}" in ${secs}s${done ? '' : ' (embeddings pending)'}`);
  return true;
}

async function seedContent(usersByEmail, paperIndex) {
  const bob = usersByEmail['teamlead@scholarflow.com'];
  const bobPapers = paperIndex['teamlead@scholarflow.com'] || {};

  // --- Certificate network -------------------------------------------------
  step('Citation network');
  let citationCount = 0;
  for (const [email, papers] of Object.entries(paperIndex)) {
    for (const [fromFile, toFile, context] of CITATION_EDGES) {
      const fromId = papers[fromFile];
      const toId = papers[toFile];
      if (!fromId || !toId) continue;
      await prisma.citation.create({
        data: { sourcePaperId: fromId, targetPaperId: toId, context, location: 'Related Work' },
      });
      citationCount += 1;
    }
  }
  log(`${citationCount} citation links`);

  // --- Collections ---------------------------------------------------------
  step('Collections');
  const profileByEmail = {
    'teamlead@scholarflow.com': bob,
    'pro.researcher@scholarflow.com': usersByEmail['pro.researcher@scholarflow.com'],
    'emily.carter@scholarflow.com': usersByEmail['emily.carter@scholarflow.com'],
    'michael.chen@scholarflow.com': usersByEmail['michael.chen@scholarflow.com'],
    'researcher@scholarflow.com': usersByEmail['researcher@scholarflow.com'],
    'admin@scholarflow.com': usersByEmail['admin@scholarflow.com'],
    'sofia.rodriguez@scholarflow.com': usersByEmail['sofia.rodriguez@scholarflow.com'],
    'david.okafor@scholarflow.com': usersByEmail['david.okafor@scholarflow.com'],
    'aisha.khan@scholarflow.com': usersByEmail['aisha.khan@scholarflow.com'],
    'lucas.meyer@scholarflow.com': usersByEmail['lucas.meyer@scholarflow.com'],
  };

  const collectionPlan = {
    'teamlead@scholarflow.com': [
      { name: 'Agent Security', files: ['ASB.pdf', 'InjectAgent.pdf', 'MCPTox.pdf', 'ToolGate.pdf'], visibility: 'PUBLIC', color: 'red' },
      { name: 'Multi-Agent Debate', files: ['CONSENSAGENT.pdf', 'DebUnc.pdf', 'estornell_liu.pdf', 'IMAD.pdf', 'Minority .pdf', 'MoA.pdf'], visibility: 'TEAM', color: 'purple' },
      { name: 'Thesis Reading', files: PDF_FILENAMES.map(normalize), visibility: 'PRIVATE', color: 'blue' },
    ],
    'pro.researcher@scholarflow.com': [
      { name: 'Survey Sources', files: ['ASB.pdf', 'MCPTox.pdf', 'ToolGate.pdf', 'MoA.pdf'], visibility: 'TEAM', color: 'green' },
    ],
    'emily.carter@scholarflow.com': [
      { name: 'Debate Deep Dive', files: ['CONSENSAGENT.pdf', 'DebUnc.pdf', 'IMAD.pdf'], visibility: 'TEAM', color: 'orange' },
    ],
    'michael.chen@scholarflow.com': [
      { name: 'Robustness Papers', files: ['MoA.pdf', 'IMAD.pdf'], visibility: 'PRIVATE', color: 'blue' },
    ],
    'researcher@scholarflow.com': [
      { name: 'Reading List', files: ['MCPTox.pdf', 'ToolGate.pdf'], visibility: 'PRIVATE', color: 'pink' },
    ],
    'admin@scholarflow.com': [
      { name: 'AI Oversight', files: ['MoA.pdf', 'ASB.pdf'], visibility: 'TEAM', color: 'green' },
    ],
  };
  const statuses = ['TO_READ', 'READING', 'COMPLETED'];
  let collectionCount = 0;

  for (const [email, plan] of Object.entries(collectionPlan)) {
    const user = profileByEmail[email];
    if (!user) continue;
    const papers = paperIndex[email] || {};
    for (const spec of plan) {
      const collection = await prisma.collection.create({
        data: {
          workspaceId: user.__workspaceId,
          ownerId: user.id,
          name: spec.name,
          description: `Curated by ${user.name || email}`,
          visibility: spec.visibility,
          color: spec.color,
          tags: spec.files.slice(0, 2).map((f) => PDF_BY_KEY.get(normalize(f))?.cluster || 'research'),
        },
      });
      let i = 0;
      for (const file of spec.files) {
        const paperId = papers[normalize(file)];
        if (!paperId) continue;
        await prisma.collectionPaper.create({
          data: {
            collectionId: collection.id,
            paperId,
            addedById: user.id,
            status: statuses[i % statuses.length],
            isStarred: i === 0,
          },
        });
        i += 1;
      }
      collectionCount += 1;
    }
  }
  log(`${collectionCount} collections`);

  // Collection membership for Bob's public collection
  const agentSecurity = await prisma.collection.findFirst({
    where: { ownerId: bob.id, name: 'Agent Security' },
  });
  if (agentSecurity) {
    await prisma.collectionMember.create({
      data: {
        collectionId: agentSecurity.id,
        userId: usersByEmail['emily.carter@scholarflow.com'].id,
        role: 'PRO_RESEARCHER',
        permission: 'VIEW',
        status: 'ACCEPTED',
        invitedById: bob.id,
        acceptedAt: new Date(),
      },
    });
  }

  // --- Notes / notebook ------------------------------------------------------
  step('Notes and notebook');
  const notebook = await prisma.notebook.create({
    data: {
      userId: bob.id,
      name: 'Agent Security Survey',
      description: 'Working notes for the security literature review',
      color: 'purple',
      isStarred: true,
    },
  });
  const sectionA = await prisma.notebookSection.create({
    data: { notebookId: notebook.id, userId: bob.id, name: 'Attacks', order: 0 },
  });
  const sectionB = await prisma.notebookSection.create({
    data: { notebookId: notebook.id, userId: bob.id, name: 'Defenses', order: 1 },
  });

  const notes = [
    { title: 'Attack taxonomy comparison', type: 'LITERATURE', section: sectionA.id, tags: ['taxonomy', 'attacks'], file: 'ASB.pdf', starred: true },
    { title: 'MCP poisoning observations', type: 'FINDINGS', section: sectionA.id, tags: ['mcp', 'findings'], file: 'MCPTox.pdf' },
    { title: 'Defense evaluation ideas', type: 'IDEA', section: sectionB.id, tags: ['defense', 'ideas'], file: 'ToolGate.pdf' },
    { title: 'Open questions for supervisor', type: 'QUICK', section: sectionB.id, tags: ['meeting'], file: 'InjectAgent.pdf' },
    { title: 'Reading plan for next week', type: 'QUICK', section: sectionB.id, tags: ['planning'] },
  ];
  for (const note of notes) {
    const content =
      `Key points from ${note.title.toLowerCase()}:\n\n` +
      `- The threat model matters: attacks that work with poisoned tool descriptions behave differently from direct prompt injection.\n` +
      `- Several benchmarks report attack success above 60% on unprotected agents.\n` +
      `- Runtime verification reduces success rates while keeping task utility acceptable.\n\n` +
      `Follow-up: connect these findings with the consensus mechanisms used in multi-agent debate.`;
    await prisma.researchNote.create({
      data: {
        userId: bob.id,
        paperId: note.file ? bobPapers[normalize(note.file)] || null : null,
        notebookId: notebook.id,
        sectionId: note.section,
        title: note.title,
        content,
        tags: note.tags,
        noteType: note.type,
        visibility: 'PRIVATE',
        isStarred: !!note.starred,
        wordCount: wordCount(content),
        excerpt: excerptOf(content),
      },
    });
  }
  log(`${notes.length} notes in 1 notebook`);

  // --- Annotations -----------------------------------------------------------
  step('Annotations');
  const annotationSpecs = [
    { file: 'ASB.pdf', type: 'HIGHLIGHT', selected: 'attacks and defenses across the LLM agent pipeline', note: 'Key taxonomy reference' },
    { file: 'ASB.pdf', type: 'COMMENT', selected: 'attack success rate above 60%', note: 'Compare with our own numbers' },
    { file: 'InjectAgent.pdf', type: 'HIGHLIGHT', selected: 'indirect prompt injections embedded in tool outputs', note: 'Core threat model for the thesis' },
    { file: 'MCPTox.pdf', type: 'HIGHLIGHT', selected: 'poisoned tool descriptions served through MCP', note: 'Novel attack surface — cite in chapter 2' },
    { file: 'MCPTox.pdf', type: 'NOTE', selected: 'bypass safety policies', note: 'Overlaps with ToolGate evaluation setup' },
    { file: 'ToolGate.pdf', type: 'HIGHLIGHT', selected: 'verify tool descriptions before the agent acts', note: 'Defense baseline' },
    { file: 'CONSENSAGENT.pdf', type: 'COMMENT', selected: 'iteratively propose, critique and converge', note: 'Compare protocol with IMAD' },
    { file: 'DebUnc.pdf', type: 'HIGHLIGHT', selected: 'calibrated confidence', note: 'Uncertainty signal idea' },
  ];
  let annotationCount = 0;
  for (const a of annotationSpecs) {
    const paperId = bobPapers[normalize(a.file)];
    if (!paperId) continue;
    await prisma.annotation.create({
      data: {
        paperId,
        userId: bob.id,
        type: a.type,
        text: a.note,
        anchor: {
          page: 1 + (annotationCount % 3),
          viewport: { scale: 1.2, rotation: 0 },
          coordinates: { x: 0.12, y: 0.22 + (annotationCount % 5) * 0.09, width: 0.5, height: 0.03 },
          selectedText: a.selected,
        },
      },
    });
    annotationCount += 1;
  }
  const emily = usersByEmail['emily.carter@scholarflow.com'];
  const emilyPapers = paperIndex['emily.carter@scholarflow.com'] || {};
  for (const [i, file] of ['DebUnc.pdf', 'IMAD.pdf'].entries()) {
    const paperId = emilyPapers[normalize(file)];
    if (!paperId) continue;
    await prisma.annotation.create({
      data: {
        paperId,
        userId: emily.id,
        type: 'HIGHLIGHT',
        text: i === 0 ? 'Uncertainty-weighted arguments' : 'Information-theoretic partner selection',
        anchor: {
          page: 1,
          viewport: { scale: 1.2, rotation: 0 },
          coordinates: { x: 0.15, y: 0.3 + i * 0.1, width: 0.45, height: 0.03 },
          selectedText: 'robustness of multi-agent deliberation',
        },
      },
    });
  }
  log(`${annotationCount + 2} annotations`);

  // --- Discussions -----------------------------------------------------------
  step('Discussions');
  const threads = [
    {
      title: 'Which attack taxonomy should we use in the thesis?',
      content: 'ASB groups attacks by pipeline stage while InjecAgent focuses on tool outputs. I think we should combine both views — thoughts?',
      tags: ['security', 'thesis'], pinned: true, resolved: false,
      messages: [
        { by: 'emily.carter@scholarflow.com', text: 'ASB\u2019s stage-based grouping is easier to defend in the literature review.' },
        { by: 'michael.chen@scholarflow.com', text: 'Agreed — and we can map InjecAgent\u2019s cases onto those stages in a table.' },
      ],
    },
    {
      title: 'Reproducing the MCPTox numbers',
      content: 'ToolGate reports lower attack success — has anyone reproduced this with the gated verification enabled?',
      tags: ['mcp', 'reproduction'], pinned: false, resolved: false,
      messages: [
        { by: 'pro.researcher@scholarflow.com', text: 'Ran it on the local benchmark — numbers hold within 3%.' },
      ],
    },
    {
      title: 'Debate protocol decision',
      content: 'We tested consensus vs. uncertainty-weighted debate. The uncertainty variant was more robust, so I suggest we adopt it.',
      tags: ['debate', 'decision'], pinned: false, resolved: true,
      messages: [
        { by: 'emily.carter@scholarflow.com', text: 'Agreed, moving forward with the uncertainty-aware protocol.' },
      ],
    },
  ];
  let messageCount = 0;
  for (const t of threads) {
    const thread = await prisma.discussionThread.create({
      data: {
        workspaceId: bob.__workspaceId,
        userId: bob.id,
        title: t.title,
        content: t.content,
        tags: t.tags,
        isPinned: t.pinned,
        isResolved: t.resolved,
      },
    });
    await prisma.discussionMessage.create({
      data: { threadId: thread.id, userId: bob.id, content: t.content },
    });
    for (const m of t.messages) {
      await prisma.discussionMessage.create({
        data: { threadId: thread.id, userId: usersByEmail[m.by]?.id || bob.id, content: m.text },
      });
      messageCount += 1;
    }
  }
  log(`${threads.length} threads, ${messageCount + threads.length} messages`);

  // --- Notifications ---------------------------------------------------------
  step('Notifications');
  const notifSpecs = [
    { type: 'INVITE', title: 'Sofia Rodriguez joined ML', message: 'Sofia accepted your invitation to the ML workspace.', actor: 'sofia.rodriguez@scholarflow.com', read: false },
    { type: 'SHARE', title: 'Emily shared a paper with you', message: 'Emily Carter gave you edit access to "DebUnc: Uncertainty-Aware Debate\u2026".', actor: 'emily.carter@scholarflow.com', read: false },
    { type: 'COMMENT', title: 'Michael commented on your paper', message: 'Michael Chen commented: "Agreed — and we can map InjecAgent\u2019s cases\u2026"', actor: 'michael.chen@scholarflow.com', read: true },
    { type: 'SYSTEM', title: 'Weekly research digest', message: '3 new papers matched your interests this week.', actor: null, read: true },
  ];
  for (const n of notifSpecs) {
    await prisma.notification.create({
      data: {
        userId: bob.id,
        type: n.type,
        title: n.title,
        message: n.message,
        actorId: n.actor ? usersByEmail[n.actor]?.id : null,
        read: n.read,
      },
    });
  }
  await prisma.notification.create({
    data: {
      userId: emily.id,
      type: 'INVITE',
      title: 'Bob invited you to ML',
      message: 'You now have editor access to the ML workspace.',
      actorId: bob.id,
      read: false,
    },
  });
  log('5 notifications');

  // --- Search history, exports, usage, activity ------------------------------
  step('History, analytics and activity');
  for (const q of ['prompt injection defenses', 'mcp tool poisoning', 'multi-agent debate robustness', 'uncertainty calibration llm']) {
    await prisma.searchHistory.create({
      data: { userId: bob.id, query: q, filters: { type: 'papers' }, results: { count: 3 } },
    });
  }
  const bibtex = bobPapers[normalize('ASB.pdf')];
  if (bibtex) {
    await prisma.citationExport.create({
      data: {
        userId: bob.id,
        paperId: bibtex,
        format: 'BIBTEX',
        content: '@article{asb2024, title={Agent Security Bench}, year={2024}}',
        metadata: { count: 1 },
      },
    });
  }
  if (agentSecurity) {
    await prisma.citationExport.create({
      data: {
        userId: bob.id,
        collectionId: agentSecurity.id,
        format: 'APA',
        content: 'Zhang, H., Cui, J., & Lu, Y. (2024). Agent Security Bench (ASB). arXiv preprint.',
        metadata: { count: 4 },
      },
    });
  }

  const usageKinds = [
    'upload', 'upload', 'upload', 'paper_view', 'paper_view', 'paper_view',
    'reading_session', 'reading_session', 'ai_summary', 'ai_summary',
    'semantic_search', 'semantic_search', 'annotation_created', 'editor_open',
  ];
  const bobPaperIds = Object.values(bobPapers);
  let usageCount = 0;
  for (const [email, count] of [
    ['teamlead@scholarflow.com', 42],
    ['pro.researcher@scholarflow.com', 14],
    ['emily.carter@scholarflow.com', 12],
    ['researcher@scholarflow.com', 8],
  ]) {
    const user = usersByEmail[email];
    if (!user) continue;
    for (let i = 0; i < count; i += 1) {
      await prisma.usageEvent.create({
        data: {
          userId: user.id,
          workspaceId: user.__workspaceId,
          kind: usageKinds[i % usageKinds.length],
          paperId: email === 'teamlead@scholarflow.com' && bobPaperIds.length ? bobPaperIds[i % bobPaperIds.length] : null,
          createdAt: daysAgo((i % 14) + 0),
        },
      });
      usageCount += 1;
    }
  }
  log(`${usageCount} usage events`);

  const activitySpecs = [
    ['paper', 'created', 'Uploaded "Agent Security Bench" to the workspace', 'INFO'],
    ['paper', 'created', 'Uploaded "InjecAgent" to the workspace', 'INFO'],
    ['collection', 'created', 'Created collection "Agent Security"', 'INFO'],
    ['paper', 'updated', 'Extracted text and embeddings for 10 papers', 'INFO'],
    ['member', 'joined', 'Sofia Rodriguez joined as editor', 'INFO'],
    ['discussion', 'created', 'Opened discussion "Which attack taxonomy should we use?"', 'INFO'],
    ['annotation', 'created', 'Added highlights on MCPTox', 'INFO'],
    ['citation', 'exported', 'Exported 4 citations in APA format', 'INFO'],
    ['workspace', 'updated', 'Storage usage passed 60% of the plan quota', 'WARNING'],
  ];
  for (const [entity, action, message, severity] of activitySpecs) {
    await prisma.activityLogEntry.create({
      data: {
        userId: bob.id,
        workspaceId: bob.__workspaceId,
        entity,
        entityId: bob.__workspaceId,
        action,
        details: { message },
        severity,
        createdAt: daysAgo(Math.floor(Math.random() * 7)),
      },
    });
  }
  log(`${activitySpecs.length} activity entries`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('ScholarFlow demo library seeder');
  console.log(`  flags: ${args.join(' ') || '(none)'}`);

  if (CLEANUP_E2E) await cleanupE2E();
  if (CLEANUP) {
    await cleanupSeededData();
    console.log('\nCleanup complete.');
    return;
  }

  // Resolve users
  const usersByEmail = {};
  for (const email of DEMO_EMAILS) {
    const user = await byEmail(email);
    usersByEmail[email] = user;
  }

  // Workspaces
  step('Workspaces and members');
  for (const email of DEMO_EMAILS) {
    const assignment = ASSIGNMENTS.find((a) => a.email === email);
    const { workspace, created } = await ensureWorkspace(
      usersByEmail[email],
      assignment?.workspaceName
    );
    usersByEmail[email].__workspaceId = workspace.id;
    if (created) log(`created workspace "${workspace.name}" for ${email}`);
  }

  const bob = usersByEmail['teamlead@scholarflow.com'];
  for (const [email, role] of [
    ['emily.carter@scholarflow.com', 'EDITOR'],
    ['michael.chen@scholarflow.com', 'VIEWER'],
    ['sofia.rodriguez@scholarflow.com', 'EDITOR'],
  ]) {
    const member = usersByEmail[email];
    const existing = await prisma.workspaceMember.findFirst({
      where: { workspaceId: bob.__workspaceId, userId: member.id },
    });
    if (existing) {
      if (existing.isDeleted) {
        await prisma.workspaceMember.update({
          where: { id: existing.id },
          data: { isDeleted: false, role },
        });
      }
    } else {
      await prisma.workspaceMember.create({
        data: { workspaceId: bob.__workspaceId, userId: member.id, role },
      });
    }
  }
  log('ML workspace members: emily (editor), michael (viewer), sofia (editor)');

  const pendingInvite = await prisma.workspaceInvitation.findFirst({
    where: { workspaceId: bob.__workspaceId, userId: usersByEmail['lucas.meyer@scholarflow.com'].id },
  });
  if (!pendingInvite) {
    await prisma.workspaceInvitation.create({
      data: {
        workspaceId: bob.__workspaceId,
        userId: usersByEmail['lucas.meyer@scholarflow.com'].id,
        role: 'EDITOR',
        status: 'PENDING',
        invitedById: bob.id,
        expiresAt: new Date(Date.now() + 7 * 86400000),
      },
    });
    log('pending invitation for lucas.meyer@scholarflow.com');
  }

  // Papers
  const paperIndex = {};
  let created = 0;
  let skipped = 0;
  const toExtract = [];

  if (!EXTRACT_ONLY) {
    step('Papers: upload + metadata');
    for (const assignment of ASSIGNMENTS) {
      const user = usersByEmail[assignment.email];
      paperIndex[assignment.email] = {};
      let index = 0;
      for (const rawFile of assignment.files) {
        const file = normalize(rawFile);
        const pdf = PDF_BY_KEY.get(file);
        if (!pdf) continue;
        if (LIMIT && created >= LIMIT) break;
        const result = await seedSinglePaper(user, user.__workspaceId, pdf, index);
        index += 1;
        if (!result) continue;
        paperIndex[assignment.email][file] = result.paperId;
        if (result.skipped) {
          skipped += 1;
          toExtract.push({ paperId: result.paperId, title: pdf.title, status: 'existing' });
        } else {
          created += 1;
          log(`+ ${assignment.email.split('@')[0]} <- ${file}`);
          toExtract.push({ paperId: result.paperId, title: pdf.title, status: 'new' });
        }
        if (LIMIT && created >= LIMIT) break;
      }
    }
    log(`created ${created}, skipped ${skipped} (already seeded)`);

    // Draft paper for the 404 test
    const draftExists = await prisma.paper.findFirst({
      where: { uploaderId: bob.id, title: { startsWith: 'Thesis Draft' } },
    });
    if (!draftExists) {
      const draft = await prisma.paper.create({
        data: {
          workspaceId: bob.__workspaceId,
          uploaderId: bob.id,
          title: 'Thesis Draft \u2014 Multi-Agent Security Survey',
          abstract: 'Working draft. Not ready for sharing.',
          metadata: { authors: ['Bob Team Lead'], year: 2026 },
          source: 'editor',
          isDraft: true,
          isPublished: false,
          tags: ['thesis', 'draft'],
        },
      });
      paperIndex['teamlead@scholarflow.com']['__draft'] = draft.id;
      log('+ draft paper (for the public-view 404 check)');
    }
  }

  // Extraction (new + previously failed)
  if (!SKIP_EXTRACTION) {
    step('Extraction + embeddings');
    const pendingPapers = EXTRACT_ONLY
      ? await prisma.paper.findMany({
          where: {
            uploaderId: { in: DEMO_EMAILS.map((e) => usersByEmail[e].id) },
            processingStatus: { in: ['UPLOADED', 'FAILED'] },
            file: { is: { isDeleted: false } },
          },
          select: { id: true, title: true },
        })
      : toExtract.filter((p) => p.status === 'new').concat(
          await prisma.paper.findMany({
            where: {
              uploaderId: { in: DEMO_EMAILS.map((e) => usersByEmail[e].id) },
              processingStatus: { in: ['UPLOADED', 'FAILED'] },
              file: { is: { isDeleted: false } },
            },
            select: { id: true, title: true },
          }).then((rows) => rows.map((r) => ({ paperId: r.id, title: r.title, status: 'pending' })))
        );

    const seen = new Set();
    let extracted = 0;
    for (const paper of pendingPapers) {
      if (seen.has(paper.paperId)) continue;
      seen.add(paper.paperId);
      const status = await prisma.paper.findUnique({
        where: { id: paper.paperId },
        select: { processingStatus: true },
      });
      if (status?.processingStatus === 'PROCESSED') continue;
      const ok = await extractPaper(paper.paperId, paper.title);
      if (ok) extracted += 1;
    }
    log(`extracted ${extracted} papers`);
  }

  if (!EXTRACT_ONLY) {
    const seededCollection = await prisma.collection.findFirst({
      where: { ownerId: bob.id, name: 'Agent Security' },
    });
    if (!seededCollection) {
      await seedContent(usersByEmail, paperIndex);
    } else {
      log('supporting demo content already seeded — skipping (use --cleanup to reset)');
    }

    // View-only share to Michael (403 demo) + edit share
    const bobPapers = paperIndex['teamlead@scholarflow.com'] || {};
    const shareTarget = bobPapers['InjectAgent.pdf'];
    if (shareTarget) {
      const share = await prisma.paperShare.findFirst({
        where: { paperId: shareTarget, email: 'michael.chen@scholarflow.com' },
      });
      if (!share) {
        await prisma.paperShare.create({
          data: {
            paperId: shareTarget,
            email: 'michael.chen@scholarflow.com',
            permission: 'view',
            sharedById: bob.id,
          },
        });
        log('view-only share to michael.chen@scholarflow.com');
      }
    }
  }

  // Summary
  const userIds = DEMO_EMAILS.map((e) => usersByEmail[e].id);
  const paperCount = await prisma.paper.count({
    where: { uploaderId: { in: userIds }, isDeleted: false },
  });
  const chunkStats = await prisma
    .$queryRaw`SELECT COUNT(*)::int AS total, COUNT(c.embedding)::int AS embedded
               FROM "PaperChunk" c JOIN "Paper" p ON p.id = c."paperId"
               WHERE p."uploaderId" = ANY(${userIds}) AND c."isDeleted" = false`
    .catch(() => null);

  console.log('\nDone.');
  console.log(`  demo papers: ${paperCount}`);
  if (chunkStats) {
    console.log(`  demo chunks: ${chunkStats[0].total} (${chunkStats[0].embedded} embedded)`);
  }
}

main()
  .catch((error) => {
    console.error('\nSeeder failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
