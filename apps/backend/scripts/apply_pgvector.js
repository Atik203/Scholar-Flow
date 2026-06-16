require("dotenv/config");
const prisma = require("../dist/app/shared/prisma").default;

async function main() {
  console.log("Enabling pgvector extension...");
  try {
    await prisma.$executeRawUnsafe("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("✅ vector extension enabled");
  } catch (e) {
    console.error("CREATE EXTENSION vector failed:", e.message);
  }

  console.log("Adding embedding column...");
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "PaperChunk" ADD COLUMN IF NOT EXISTS embedding vector(1536)');
    console.log("✅ embedding column added");
  } catch (e) {
    console.error("ALTER TABLE failed:", e.message);
  }

  console.log("Creating HNSW index...");
  try {
    await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_paperchunk_embedding_hnsw ON "PaperChunk" USING hnsw(embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)');
    console.log("✅ HNSW index created");
  } catch (e) {
    console.error("CREATE INDEX failed:", e.message);
  }

  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
