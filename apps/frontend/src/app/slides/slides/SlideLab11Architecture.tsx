import { ArrowDown, Bot, Cloud, Database, Monitor, Server, User } from "lucide-react";

const FlowArrow = () => (
  <div className="flex justify-center py-1">
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-0.5 h-4 bg-blue-300" />
      <ArrowDown className="w-5 h-5 text-blue-400" strokeWidth={3} />
    </div>
  </div>
);

export default function SlideLab11Architecture() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Server className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-purple-600 mb-0.5">Slide 11 · Architecture</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">System Architecture Overview</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold text-slate-900">3-Tier Decoupled Architecture</span>
          </div>
        </div>
      </div>

      {/* ── Architecture Flow ── */}
      <div className="flex-1 flex flex-col justify-center relative z-10 my-2 gap-0">

        {/* User Layer */}
        <div className="bg-white rounded-2xl px-6 py-3 border-2 border-slate-200 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-slate-500">User Layer</p>
              <p className="text-2xl font-extrabold text-slate-900">Browser · Desktop & Mobile</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["Researcher", "Student", "Team Admin"].map(r => (
              <span key={r} className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-xl font-bold text-slate-700">{r}</span>
            ))}
          </div>
        </div>

        <FlowArrow />

        {/* Frontend Layer */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-6 py-3 border-2 border-blue-500 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="w-8 h-8 text-white flex-shrink-0" />
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-200">Frontend Layer</p>
              <p className="text-2xl font-extrabold text-white">Next.js 16 — App Router</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {["RTK Query", "Better Auth", "Tailwind CSS", "TipTap"].map(t => (
              <span key={t} className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-xl font-bold text-white">{t}</span>
            ))}
            <span className="bg-white text-blue-700 rounded-lg px-3 py-1 text-xl font-extrabold ml-2">Vercel</span>
          </div>
        </div>

        <FlowArrow />

        {/* Backend Layer */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl px-6 py-3 border-2 border-emerald-500 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-white flex-shrink-0" />
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-emerald-200">Backend API Layer</p>
              <p className="text-2xl font-extrabold text-white">Express.js — REST API</p>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            {["Auth", "Papers", "Collections", "AI", "Billing", "Notifications"].map(m => (
              <span key={m} className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-xl font-bold text-white">{m}</span>
            ))}
            <span className="bg-white text-emerald-700 rounded-lg px-3 py-1 text-xl font-extrabold ml-2">Railway</span>
          </div>
        </div>

        {/* Branched arrows to 3 services */}
        <div className="relative flex justify-center gap-28 py-2">
          <ArrowDown className="w-5 h-5 text-purple-400" strokeWidth={3} />
          <ArrowDown className="w-5 h-5 text-orange-400" strokeWidth={3} />
          <ArrowDown className="w-5 h-5 text-blue-400" strokeWidth={3} />
          <div className="absolute top-4 left-[20%] right-[20%] h-0.5 bg-slate-300 -z-0" />
        </div>

        {/* Data / Services Layer */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-4 border-2 border-purple-400 shadow-lg text-white flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-7 h-7 flex-shrink-0" />
              <span className="text-2xl font-extrabold">PostgreSQL</span>
            </div>
            <span className="text-xl font-bold text-purple-100">pgvector — semantic search</span>
            <span className="text-xl font-bold text-purple-100">Redis — caching layer</span>
            <span className="text-xl font-bold text-purple-100">Prisma ORM — type-safe</span>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-4 border-2 border-orange-400 shadow-lg text-white flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <Cloud className="w-7 h-7 flex-shrink-0" />
              <span className="text-2xl font-extrabold">AWS S3</span>
            </div>
            <span className="text-xl font-bold text-orange-100">Presigned URL uploads</span>
            <span className="text-xl font-bold text-orange-100">PDF/DOCX storage</span>
            <span className="text-xl font-bold text-orange-100">Stripe — billing</span>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 border-2 border-blue-400 shadow-lg text-white flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-7 h-7 flex-shrink-0" />
              <span className="text-2xl font-extrabold">AI APIs</span>
            </div>
            <span className="text-xl font-bold text-blue-100">Gemini 2.5 Flash Pro</span>
            <span className="text-xl font-bold text-blue-100">OpenAI GPT-4o</span>
            <span className="text-xl font-bold text-blue-100">Multi-provider fallback</span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl px-6 py-3 shadow-lg border border-purple-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white">
          🔌 Frontend & Backend are <span className="text-amber-300">fully decoupled</span> — REST API only, no shared code between layers
        </p>
      </div>
    </div>
  );
}