import { CheckCircle, DollarSign, Sparkles, Target, Users } from "lucide-react";

const objectives = [
  {
    icon: Target,
    title: "Unified Platform",
    description: "One centralized place to upload, manage, and analyze all research papers — no more switching between 4+ apps.",
    color: "from-blue-500 to-blue-600",
    accent: "border-blue-200 bg-blue-50/60",
    iconBg: "from-blue-500 to-blue-700",
    num: "01",
    numColor: "text-blue-200",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Auto-summarize papers, ask questions to your documents, and generate literature reviews in seconds — not hours.",
    color: "from-purple-500 to-purple-600",
    accent: "border-purple-200 bg-purple-50/60",
    iconBg: "from-purple-500 to-indigo-600",
    num: "02",
    numColor: "text-purple-200",
  },
  {
    icon: CheckCircle,
    title: "Automated Metadata",
    description: "AI extracts title, authors, abstract, keywords and references on upload — zero manual data entry required.",
    color: "from-emerald-500 to-green-600",
    accent: "border-emerald-200 bg-emerald-50/60",
    iconBg: "from-emerald-500 to-teal-600",
    num: "03",
    numColor: "text-emerald-200",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Shared workspaces, role-based access, inline annotations, and real-time activity tracking for every research group.",
    color: "from-rose-500 to-pink-600",
    accent: "border-rose-200 bg-rose-50/60",
    iconBg: "from-rose-500 to-red-600",
    num: "04",
    numColor: "text-rose-200",
  },
  {
    icon: DollarSign,
    title: "Affordable for All",
    description: "Generous free tier for students and individuals, with affordable team plans — far below $50–$250/month competitors.",
    color: "from-amber-500 to-orange-600",
    accent: "border-amber-200 bg-amber-50/60",
    iconBg: "from-amber-500 to-orange-600",
    num: "05",
    numColor: "text-amber-200",
  },
];

export default function SlideLab04Objectives() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        {/* Top accent bar */}
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Slide 04 · Objectives</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">What We Aim to Achieve</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">🎯</span>
            <span className="text-xl font-bold text-slate-900">5 Core Objectives</span>
          </div>
        </div>
      </div>

      {/* ── Objectives Grid: 3-top + 2-bottom ── */}
      <div className="flex-1 flex flex-col gap-3 relative z-10 my-3 min-h-0">
        {/* Row 1 — 3 cards */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          {objectives.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className={`bg-white rounded-2xl p-5 border-2 ${item.accent} shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-4xl font-black ${item.numColor} select-none`}>{item.num}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">{item.title}</h3>
                  <p className="text-xl font-semibold text-slate-800 leading-snug text-justify">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2 — 2 cards centered */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {objectives.slice(3, 5).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className={`bg-white rounded-2xl p-5 border-2 ${item.accent} shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-4xl font-black ${item.numColor} select-none`}>{item.num}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">{item.title}</h3>
                  <p className="text-xl font-semibold text-slate-800 leading-snug text-justify">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🚀 All 5 objectives are fully implemented and live at <span className="text-amber-300">scholar-flow-ai.vercel.app</span>
        </p>
      </div>
    </div>
  );
}