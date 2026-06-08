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

  // Seed FAQs
  const faqs = [
    { question: 'How do I get started with ScholarFlow?', answer: 'Simply create an account, upload your first paper or start a new draft in the editor. Our AI will automatically extract metadata including title, authors, and abstract.', category: 'Getting Started', order: 1 },
    { question: 'What file formats are supported for upload?', answer: 'ScholarFlow supports PDF, DOCX, DOC, and TXT files. For PDFs, we extract text and metadata automatically. DOCX files are preserved for editing in our TipTap editor.', category: 'Getting Started', order: 2 },
    { question: 'Is there a limit on how many papers I can upload?', answer: 'Free plan users can upload up to 100 papers. Pro and Institutional plans offer unlimited uploads with additional features like AI analysis and team collaboration.', category: 'Getting Started', order: 3 },
    { question: 'How does the billing work?', answer: 'We offer monthly and annual billing options. Annual plans come with a 20% discount. You can upgrade, downgrade, or cancel your subscription at any time.', category: 'Account & Billing', order: 1 },
    { question: 'Can I export my papers if I cancel?', answer: 'Yes, you can export all your papers and data at any time, even after cancellation. We recommend downloading your data before the end of your billing period.', category: 'Account & Billing', order: 2 },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay via invoice.', category: 'Account & Billing', order: 3 },
    { question: 'How does the AI analysis work?', answer: 'Our AI uses advanced natural language processing to extract key information, generate summaries, identify research trends, and provide citation recommendations.', category: 'Features & Usage', order: 1 },
    { question: 'Can I collaborate with my team in real-time?', answer: 'Yes, ScholarFlow supports real-time collaboration including shared collections, annotations, comments, and discussion threads on papers.', category: 'Features & Usage', order: 2 },
    { question: 'How does the semantic search work?', answer: 'Our semantic search uses AI embeddings to understand the meaning of your queries, not just keywords. This helps you find relevant papers even with imprecise search terms.', category: 'Features & Usage', order: 3 },
    { question: 'How is my data protected?', answer: 'All data is encrypted at rest and in transit. We use AWS S3 for secure file storage, regular security audits, and comply with GDPR and SOC 2 standards.', category: 'Privacy & Security', order: 1 },
    { question: 'Who owns the papers I upload?', answer: 'You retain full ownership of all your research papers and data. ScholarFlow never claims any intellectual property rights to your content.', category: 'Privacy & Security', order: 2 },
    { question: 'Can I control who sees my papers?', answer: 'Yes, you can set papers as private, shared with specific team members, or public. Collections have granular permission controls for viewing and editing.', category: 'Privacy & Security', order: 3 },
  ];

  for (const faq of faqs) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Faq" (id, question, answer, category, "order", "isPublished", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      faq.question, faq.answer, faq.category, faq.order
    );
  }

  // Seed Testimonials
  const testimonials = [
    { name: 'Dr. Sarah Chen', title: 'Professor of Computer Science', company: 'MIT', content: 'ScholarFlow has revolutionized how our research group manages papers. The AI-powered categorization saves us hours each week.', rating: 5, order: 1 },
    { name: 'Prof. Michael Brown', title: 'Research Director', company: 'Stanford University', content: 'The collaboration features are exceptional. My team can now review and annotate papers together in real-time.', rating: 5, order: 2 },
    { name: 'Dr. Emily Zhang', title: 'Postdoctoral Researcher', company: 'Oxford University', content: 'The semantic search is a game-changer. I can find relevant papers even when I don\'t know the exact keywords.', rating: 5, order: 3 },
    { name: 'Alex Kim', title: 'PhD Candidate', company: 'UC Berkeley', content: 'ScholarFlow\'s citation management alone is worth it. It handles all major formats and integrates seamlessly with my writing workflow.', rating: 4, order: 4 },
    { name: 'Dr. James Wilson', title: 'Research Scientist', company: 'DeepMind', content: 'We use ScholarFlow for our entire research pipeline. The API access and enterprise features are outstanding.', rating: 5, order: 5 },
    { name: 'Prof. Maria Garcia', title: 'Department Head', company: 'University of Tokyo', content: 'Deploying ScholarFlow across our department was seamless. The administrative controls and usage analytics are exactly what we needed.', rating: 5, order: 6 },
  ];

  for (const t of testimonials) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Testimonial" (id, name, title, company, content, rating, "order", "isPublished", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      t.name, t.title, t.company, t.content, t.rating, t.order
    );
  }

  // Seed Page Content
  const pageContents = [
    { slug: 'about', title: 'About ScholarFlow', content: '# About ScholarFlow\n\nScholarFlow is an AI-powered research platform designed to accelerate scientific discovery. Our mission is to make research more efficient, collaborative, and accessible for everyone.\n\n## Our Mission\n\nWe believe that the best research happens when tools get out of the way. ScholarFlow combines powerful AI with an intuitive interface to help researchers spend less time managing papers and more time doing research.' },
    { slug: 'privacy', title: 'Privacy Policy', content: '# Privacy Policy\n\nLast updated: January 2026\n\n## Information We Collect\n\nWe collect information you provide directly to us, including name, email address, and research papers you upload.\n\n## How We Use Your Information\n\nWe use your information to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your account.' },
    { slug: 'terms', title: 'Terms of Service', content: '# Terms of Service\n\nLast updated: January 2026\n\n## Acceptance of Terms\n\nBy accessing or using ScholarFlow, you agree to be bound by these Terms of Service.\n\n## User Responsibilities\n\nYou are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
  ];

  for (const pc of pageContents) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "PageContent" (id, slug, title, content, "isPublished", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW())
       ON CONFLICT (slug) DO NOTHING`,
      pc.slug, pc.title, pc.content
    );
  }

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
  console.log('💬 Seeded FAQs:', faqs.length);
  console.log('⭐ Seeded Testimonials:', testimonials.length);
  console.log('📄 Seeded Page Content:', pageContents.length);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
