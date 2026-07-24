import { Layers, Bot, Shield } from "lucide-react";
import { SiAmazons3, SiExpress, SiJsonwebtokens, SiNextdotjs, SiNodedotjs, SiPostgresql, SiPrisma, SiRedis, SiRedux, SiStripe, SiTailwindcss, SiTypescript, SiVercel, SiZod } from "react-icons/si";

const TechBadge = ({ icon: Icon, name, color }: { icon: React.ElementType; name: string; color: string }) => (
  <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 flex items-center gap-2 hover:shadow-md transition-shadow">
    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <span className="text-black text-base font-bold">{name}</span>
  </div>
);

export default function SlideLab10TechStack() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Layers className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">Technology Stack</h1>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-black mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" /> Frontend
          </h2>
          <div className="space-y-2">
            <TechBadge icon={SiNextdotjs} name="Next.js 16" color="#000" />
            <TechBadge icon={SiTypescript} name="TypeScript" color="#3178C6" />
            <TechBadge icon={SiTailwindcss} name="Tailwind CSS" color="#06B6D4" />
            <TechBadge icon={SiRedux} name="Redux Toolkit" color="#764ABC" />
            <TechBadge icon={SiZod} name="Zod" color="#3E67B1" />
            <TechBadge icon={Shield} name="Better Auth" color="#000" />
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-base font-bold text-black">Why Next.js 16?</p>
            <p className="text-base font-normal text-black leading-snug">Server Components for SEO, App Router for file-based routing, SSR for performance. Unified TypeScript keeps the frontend and backend in sync.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-black mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Backend API
          </h2>
          <div className="space-y-2">
            <TechBadge icon={SiNodedotjs} name="Node.js" color="#339933" />
            <TechBadge icon={SiExpress} name="Express.js" color="#000" />
            <TechBadge icon={SiTypescript} name="TypeScript" color="#3178C6" />
            <TechBadge icon={SiPrisma} name="Prisma ORM" color="#2D3748" />
            <TechBadge icon={SiZod} name="Zod" color="#3E67B1" />
            <TechBadge icon={SiJsonwebtokens} name="JWT + bcrypt" color="#000" />
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-base font-bold text-black">Why Express.js?</p>
            <p className="text-base font-normal text-black leading-snug">Minimal, mature middleware ecosystem. Prisma ORM provides type-safe queries and native pgvector support for AI semantic search.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-black mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" /> Infrastructure
          </h2>
          <div className="space-y-2">
            <TechBadge icon={SiPostgresql} name="PostgreSQL + pgvector" color="#4169E1" />
            <TechBadge icon={SiAmazons3} name="AWS S3" color="#569A31" />
            <TechBadge icon={SiRedis} name="Redis" color="#DC382D" />
            <TechBadge icon={SiStripe} name="Stripe" color="#635BFF" />
            <TechBadge icon={Bot} name="Gemini + OpenAI" color="#8B5CF6" />
            <TechBadge icon={SiVercel} name="Vercel" color="#000" />
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-base font-bold text-black">Why PostgreSQL?</p>
            <p className="text-base font-normal text-black leading-snug">pgvector enables vector similarity search for AI. Multi-provider AI (Gemini + OpenAI) ensures reliability and flexibility for all features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}