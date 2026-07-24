import { Layers } from "lucide-react";
import {
  SiAmazons3,
  SiExpress,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiRedis,
  SiRedux,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
  SiZod,
} from "react-icons/si";

interface TechItem {
  icon: React.ElementType;
  name: string;
  color: string;
  why: string;
}

const TechBadge = ({ icon: Icon, name, color, why }: TechItem) => (
  <div className="bg-white rounded-lg px-4 py-2.5 border border-slate-200 flex items-center gap-3 hover:shadow-md transition-shadow">
    <Icon className="w-8 h-8 flex-shrink-0" style={{ color }} />
    <div>
      <span className="text-black text-sm font-semibold">{name}</span>
      <p className="text-slate-500 text-xs leading-tight">{why}</p>
    </div>
  </div>
);

export default function SlideLab10TechStack() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">
          Technology Stack &amp; Justification
        </h1>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Frontend */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <h2 className="text-lg font-bold text-black">Frontend</h2>
            <span className="text-slate-500 text-xs ml-auto">App Router + SSR</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <TechBadge
              icon={SiNextdotjs}
              name="Next.js 16"
              color="#000000"
              why="Server Components, SSR for SEO, App Router"
            />
            <TechBadge
              icon={SiTypescript}
              name="TypeScript"
              color="#3178C6"
              why="Type safety, better maintainability, IDE support"
            />
            <TechBadge
              icon={SiTailwindcss}
              name="Tailwind CSS"
              color="#06B6D4"
              why="Utility-first, rapid UI, production-optimized"
            />
            <TechBadge
              icon={SiRedux}
              name="Redux Toolkit"
              color="#764ABC"
              why="Predictable state, RTK Query caching, devtools"
            />
            <TechBadge
              icon={SiZod}
              name="Zod"
              color="#3E67B1"
              why="Runtime validation, TypeScript inference, form schemas"
            />
            <TechBadge
              icon={SiOpenai}
              name="Better Auth"
              color="#000000"
              why="Modern auth, OAuth providers, session management"
            />
          </div>
        </div>

        {/* Backend */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="text-lg font-bold text-black">Backend API</h2>
            <span className="text-slate-500 text-xs ml-auto">REST + SQL</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <TechBadge
              icon={SiNodedotjs}
              name="Node.js"
              color="#339933"
              why="Non-blocking I/O, unified JS stack, huge ecosystem"
            />
            <TechBadge
              icon={SiExpress}
              name="Express.js"
              color="#000000"
              why="Minimal, mature, middleware-rich, well-tested"
            />
            <TechBadge
              icon={SiTypescript}
              name="TypeScript"
              color="#3178C6"
              why="Shared types with frontend, safer refactoring"
            />
            <TechBadge
              icon={SiPrisma}
              name="Prisma ORM"
              color="#2D3748"
              why="Type-safe queries, migrations, pgvector support"
            />
            <TechBadge
              icon={SiZod}
              name="Zod"
              color="#3E67B1"
              why="Request validation, consistent error responses"
            />
            <TechBadge
              icon={SiOpenai}
              name="JWT + bcrypt"
              color="#000000"
              why="Stateless auth, refresh tokens, rate limiting"
            />
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <h2 className="text-lg font-bold text-black">Infrastructure</h2>
            <span className="text-slate-500 text-xs ml-auto">Cloud-Native</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <TechBadge
              icon={SiPostgresql}
              name="PostgreSQL + pgvector"
              color="#4169E1"
              why="Relational integrity, vector search for AI semantic queries"
            />
            <TechBadge
              icon={SiAmazons3}
              name="AWS S3"
              color="#569A31"
              why="Scalable file storage, presigned URLs for security"
            />
            <TechBadge
              icon={SiRedis}
              name="Redis"
              color="#DC382D"
              why="Session caching, rate limiting, real-time pub/sub"
            />
            <TechBadge
              icon={SiStripe}
              name="Stripe"
              color="#635BFF"
              why="Proven billing infra, webhooks, customer portal"
            />
            <TechBadge
              icon={SiOpenai}
              name="Gemini + OpenAI"
              color="#000000"
              why="Multi-provider AI: summarization, chat, embeddings"
            />
            <TechBadge
              icon={SiNextdotjs}
              name="Vercel"
              color="#000000"
              why="Serverless deployment, edge network, auto-scaling"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
