import { Bot, Layers, Shield } from "lucide-react";
import { SiAmazons3, SiExpress, SiJsonwebtokens, SiNextdotjs, SiNodedotjs, SiPostgresql, SiPrisma, SiRedis, SiRedux, SiStripe, SiTailwindcss, SiTypescript, SiVercel, SiZod } from "react-icons/si";

const TechBadge = ({ icon: Icon, name, color }: { icon: React.ElementType; name: string; color: string }) => (
  <div className="bg-white rounded-xl px-3 py-2.5 border border-slate-200 shadow-sm flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "18" }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <span className="text-xl font-bold text-slate-900">{name}</span>
  </div>
);

const columns = [
  {
    label: "Frontend",
    dot: "bg-blue-500",
    accent: "border-blue-200 bg-blue-50/50",
    header: "from-blue-600 to-blue-700",
    why: "Why Next.js 16?",
    reason: "Server Components, App Router, SSR performance & TypeScript end-to-end.",
    reasonColor: "text-blue-700",
    items: [
      { icon: SiNextdotjs, name: "Next.js 16", color: "#000" },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
      { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
      { icon: SiRedux, name: "Redux Toolkit", color: "#764ABC" },
      { icon: SiZod, name: "Zod Validation", color: "#3E67B1" },
      { icon: Shield, name: "Better Auth", color: "#374151" },
    ],
  },
  {
    label: "Backend API",
    dot: "bg-emerald-500",
    accent: "border-emerald-200 bg-emerald-50/50",
    header: "from-emerald-600 to-teal-700",
    why: "Why Express.js?",
    reason: "Mature middleware ecosystem + Prisma ORM for type-safe pgvector queries.",
    reasonColor: "text-emerald-700",
    items: [
      { icon: SiNodedotjs, name: "Node.js 22+", color: "#339933" },
      { icon: SiExpress, name: "Express.js", color: "#333" },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
      { icon: SiPrisma, name: "Prisma ORM", color: "#2D3748" },
      { icon: SiZod, name: "Zod Validation", color: "#3E67B1" },
      { icon: SiJsonwebtokens, name: "JWT + bcrypt", color: "#d63aff" },
    ],
  },
  {
    label: "Infrastructure",
    dot: "bg-purple-500",
    accent: "border-purple-200 bg-purple-50/50",
    header: "from-purple-600 to-indigo-700",
    why: "Why PostgreSQL?",
    reason: "pgvector enables AI semantic search; multi-provider AI ensures reliability.",
    reasonColor: "text-purple-700",
    items: [
      { icon: SiPostgresql, name: "PostgreSQL + pgvector", color: "#4169E1" },
      { icon: SiAmazons3, name: "AWS S3", color: "#569A31" },
      { icon: SiRedis, name: "Redis Cache", color: "#DC382D" },
      { icon: SiStripe, name: "Stripe Billing", color: "#635BFF" },
      { icon: Bot, name: "Gemini + OpenAI", color: "#8B5CF6" },
      { icon: SiVercel, name: "Vercel (Deploy)", color: "#000" },
    ],
  },
];

export default function SlideLab10TechStack() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Slide 10 · Technology Stack</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Tech Stack Overview</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">⚙️</span>
            <span className="text-xl font-bold text-slate-900">3 Layers · 18 Technologies</span>
          </div>
        </div>
      </div>

      {/* ── Three-Column Grid ── */}
      <div className="flex-1 grid grid-cols-3 gap-4 relative z-10 my-3 min-h-0">
        {columns.map((col) => (
          <div key={col.label} className={`bg-white rounded-2xl border-2 ${col.accent} shadow-md flex flex-col overflow-hidden`}>
            {/* Column header bar */}
            <div className={`bg-gradient-to-r ${col.header} px-5 py-3 flex items-center gap-2.5`}>
              <span className="w-3 h-3 rounded-full bg-white/70 flex-shrink-0" />
              <h2 className="text-2xl font-extrabold text-white">{col.label}</h2>
            </div>

            {/* Tech badges */}
            <div className="flex flex-col gap-2 p-4 flex-1">
              {col.items.map((t) => (
                <TechBadge key={t.name} icon={t.icon} name={t.name} color={t.color} />
              ))}
            </div>

            {/* "Why" callout */}
            <div className="px-4 pb-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className={`text-base font-extrabold uppercase tracking-wide mb-0.5 ${col.reasonColor}`}>{col.why}</p>
                <p className="text-xl font-semibold text-slate-800 leading-snug">{col.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🛠️ Full-stack TypeScript monorepo — <span className="text-amber-300">frontend and backend share type safety end-to-end</span>
        </p>
      </div>
    </div>
  );
}