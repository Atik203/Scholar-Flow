import { Calendar, CheckCircle2 } from "lucide-react";

interface TimelineWeek {
  week: string;
  label: string;
  color: string;
  items: string[];
}

const row1: TimelineWeek[] = [
  { week: "W1", label: "Setup & Config", color: "from-emerald-500 to-teal-600", items: ["Turborepo monorepo + Yarn Berry", "CI/CD with ESLint & type-check", "Prisma schema + pgvector migrations", "Environment config & dev tooling"] },
  { week: "W2", label: "Authentication", color: "from-blue-500 to-blue-700", items: ["Better Auth — Google, GitHub, email", "Register, login, password reset", "RBAC: admin & member roles", "JWT middleware + route protection"] },
  { week: "W3", label: "Paper Upload", color: "from-purple-500 to-indigo-600", items: ["PDF/DOCX → AWS S3 presigned URLs", "AI metadata extraction (title/authors)", "Search, filter, sort & paginate papers", "Paper detail, download & delete"] },
  { week: "W4", label: "AI Core", color: "from-rose-500 to-red-600", items: ["Gemini + OpenAI paper summarization", "Key findings & methodology extraction", "AI chat interface for paper Q&A", "pgvector embeddings for semantic search"] },
];

const row2: TimelineWeek[] = [
  { week: "W5", label: "Editor & Collections", color: "from-amber-500 to-orange-600", items: ["TipTap editor + auto-save + export", "Draft/publish state workflows", "Collections with tagging & search", "Citation gen: APA, MLA, IEEE, BibTeX"] },
  { week: "W6", label: "Team Workspaces", color: "from-cyan-500 to-teal-600", items: ["Workspace creation + invitations", "Viewer / editor / admin roles", "Shared paper libraries per workspace", "Presence indicators + activity feed"] },
  { week: "W7", label: "Billing & Admin", color: "from-green-500 to-emerald-700", items: ["Stripe: free / pro / team plans", "Webhook handlers + lifecycle mgmt", "Admin dashboard — users & metrics", "Analytics: usage charts & reports"] },
  { week: "W8", label: "Testing & Deploy", color: "from-slate-600 to-slate-800", items: ["Integration + E2E test coverage", "Performance: caching + code splitting", "Deploy: Vercel (FE) + Railway (BE)", "Documentation + demo handoff"] },
];

function WeekCard({ week }: { week: TimelineWeek }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col overflow-hidden">
      {/* Gradient header */}
      <div className={`bg-gradient-to-r ${week.color} px-4 py-2.5 flex-shrink-0`}>
        <p className="text-2xl font-extrabold text-white leading-none">{week.week}</p>
        <p className="text-xl font-bold text-white/90 leading-tight">{week.label}</p>
      </div>
      {/* Items */}
      <div className="flex-1 p-3 flex flex-col gap-1.5">
        {week.items.map((item, j) => (
          <div key={j} className="flex items-start gap-2">
            <span className="text-blue-500 font-black flex-shrink-0 text-base leading-snug mt-0.5">•</span>
            <span className="text-xl font-semibold text-slate-800 leading-snug">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SlideLab14Timeline() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-slate-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Slide 14 · Timeline</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">8-Week Implementation Plan</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xl font-bold text-slate-900">4 Members · 8 Weeks · 32 Deliverables</span>
          </div>
        </div>
      </div>

      {/* ── Row 1: W1–W4 ── */}
      <div className="grid grid-cols-4 gap-3 relative z-10 flex-1 mt-3 mb-2 min-h-0">
        {row1.map((week) => <WeekCard key={week.week} week={week} />)}
      </div>

      {/* ── Row 2: W5–W8 ── */}
      <div className="grid grid-cols-4 gap-3 relative z-10 flex-1 mb-3 min-h-0">
        {row2.map((week) => <WeekCard key={week.week} week={week} />)}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 rounded-xl px-6 py-3 shadow-lg border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white">
          ⏱️ <span className="text-amber-300">8 weeks · 32 deliverables · 4 team members</span> — Turborepo monorepo with CI/CD from day one
        </p>
      </div>
    </div>
  );
}