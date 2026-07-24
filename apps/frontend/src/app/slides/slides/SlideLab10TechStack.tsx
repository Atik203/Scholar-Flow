import { Layers, Bot, Shield } from "lucide-react";
import {
  SiAmazons3, SiExpress, SiJsonwebtokens, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPrisma, SiRedis, SiRedux, SiStripe,
  SiTailwindcss, SiTypescript, SiVercel, SiZod,
} from "react-icons/si";

interface TechItem { icon: React.ElementType; name: string; color: string; why: string; }

const TechBadge = ({ icon: Icon, name, color, why }: TechItem) => (
  <div className="bg-white rounded-lg px-3 py-2.5 border border-slate-200 flex items-center gap-3 hover:shadow-md transition-shadow">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <span className="text-black text-base font-bold">{name}</span>
      <p className="text-black text-sm font-semibold leading-tight">{why}</p>
    </div>
  </div>
);

export default function SlideLab10TechStack() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">Technology Stack &amp; Justification</h1>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <h2 className="text-xl font-bold text-black">Frontend</h2>
            <span className="text-black text-sm font-semibold ml-auto">App Router + SSR</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <TechBadge icon={SiNextdotjs} name="Next.js 16" color="#000" why="Server Components, SSR for SEO, App Router for file-based routing" />
            <TechBadge icon={SiTypescript} name="TypeScript" color="#3178C6" why="Type safety across the stack, better maintainability and IDE support" />
            <TechBadge icon={SiTailwindcss} name="Tailwind CSS" color="#06B6D4" why="Utility-first framework for rapid UI development and consistent design" />
            <TechBadge icon={SiRedux} name="Redux Toolkit" color="#764ABC" why="Predictable state with RTK Query for API cache invalidation system" />
            <TechBadge icon={SiZod} name="Zod" color="#3E67B1" why="Runtime schema validation with automatic TypeScript type inference" />
            <TechBadge icon={Shield} name="Better Auth" color="#000" why="Modern auth handling Google, GitHub OAuth and email/password login" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="text-xl font-bold text-black">Backend API</h2>
            <span className="text-black text-sm font-semibold ml-auto">REST + SQL</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <TechBadge icon={SiNodedotjs} name="Node.js" color="#339933" why="Non-blocking I/O, unified JavaScript stack across frontend and backend" />
            <TechBadge icon={SiExpress} name="Express.js" color="#000" why="Minimalist framework, mature middleware ecosystem, well-tested and reliable" />
            <TechBadge icon={SiTypescript} name="TypeScript" color="#3178C6" why="Shared types with frontend, safer refactoring across the entire monorepo" />
            <TechBadge icon={SiPrisma} name="Prisma ORM" color="#2D3748" why="Type-safe queries, automatic migrations, and native pgvector support" />
            <TechBadge icon={SiZod} name="Zod" color="#3E67B1" why="Request validation, consistent error responses across all API endpoints" />
            <TechBadge icon={SiJsonwebtokens} name="JWT + bcrypt" color="#000" why="Stateless auth with refresh tokens and password hashing" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <h2 className="text-xl font-bold text-black">Infrastructure</h2>
            <span className="text-black text-sm font-semibold ml-auto">Cloud-Native</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <TechBadge icon={SiPostgresql} name="PostgreSQL + pgvector" color="#4169E1" why="Relational data with vector search for AI-powered semantic queries" />
            <TechBadge icon={SiAmazons3} name="AWS S3" color="#569A31" why="Scalable file storage with presigned URLs for secure browser uploads" />
            <TechBadge icon={SiRedis} name="Redis" color="#DC382D" why="In-memory caching for sessions, rate limiting, and pub/sub messaging" />
            <TechBadge icon={SiStripe} name="Stripe" color="#635BFF" why="Industry payment infrastructure, webhooks, customer portal" />
            <TechBadge icon={Bot} name="Gemini + OpenAI" color="#8B5CF6" why="Multi-provider AI for summarization, chat Q&A, and embeddings" />
            <TechBadge icon={SiVercel} name="Vercel" color="#000" why="Serverless deployment with edge network and auto-scaling" />
          </div>
        </div>
      </div>
    </div>
  );
}