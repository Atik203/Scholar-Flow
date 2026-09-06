import { AlertTriangle, ArrowRight, Bot, Clock, FolderX, Lightbulb, Monitor, Users, Zap } from "lucide-react";

const problems = [
  {
    icon: FolderX,
    title: "Fragmented Tools",
    description: "Researchers juggle 4+ disconnected apps with no single place to store, search, or manage papers.",
    stat: "65%",
    statText: "use 4+ separate tools",
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50 border-rose-200",
    statColor: "text-rose-700",
  },
  {
    icon: Bot,
    title: "Zero AI Assistance",
    description: "Summarization, literature review, and analysis are all done manually — wasting hours of research time.",
    stat: "91%",
    statText: "receive no AI support",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 border-amber-200",
    statColor: "text-amber-700",
  },
  {
    icon: Users,
    title: "Weak Collaboration",
    description: "No shared workspaces or role controls — research teams work in silos and constantly lose context.",
    stat: "78%",
    statText: "struggle to collaborate",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50 border-purple-200",
    statColor: "text-purple-700",
  },
  {
    icon: Clock,
    title: "Wasted Time",
    description: "Metadata entry, citations, and paper organization are tedious manual tasks that slow every researcher down.",
    stat: "82%",
    statText: "still fully manual",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 border-blue-200",
    statColor: "text-blue-700",
  },
];

const solutions = [
  { icon: "📄", title: "Smart Paper Upload", desc: "Auto-extracts title, authors & abstract" },
  { icon: "🔍", title: "AI Semantic Search", desc: "Find exact passages across all papers" },
  { icon: "🧠", title: "AI Summaries", desc: "Condense papers into crisp insights" },
  { icon: "📂", title: "Team Collections", desc: "Share and explore papers as a group" },
  { icon: "✏️", title: "Inline Annotations", desc: "Highlight, comment & discuss in-doc" },
  { icon: "🔒", title: "Role-Based Access", desc: "Viewer, editor & admin per workspace" },
];

export default function SlideLab02Problem() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 via-blue-50/40 to-indigo-50/60 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-rose-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-[55%] -translate-y-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header with top accent bar ── */}
      <div className="relative z-10">
        {/* Top accent bar */}
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-indigo-500 to-blue-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-rose-600 mb-0.5">Problem Statement</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Why Does ScholarFlow Exist?</h1>
            </div>
          </div>

          {/* Subtitle pill */}
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span className="text-xl font-bold text-slate-900">The Research Management Crisis</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="flex-1 grid grid-cols-11 gap-3 relative z-10 my-3 min-h-0">

        {/* Left — 4 Problem Cards (6 cols) */}
        <div className="col-span-6 grid grid-cols-2 gap-3">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-md flex flex-col justify-between hover:border-slate-300 transition-colors duration-150"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <problem.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{problem.title}</h3>
                </div>
                <p className="text-xl font-semibold text-slate-900 leading-snug text-justify">
                  {problem.description}
                </p>
              </div>
              <div className={`mt-3 flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 ${problem.bgColor}`}>
                <span className={`text-3xl font-black bg-gradient-to-r ${problem.color} bg-clip-text text-transparent leading-none`}>
                  {problem.stat}
                </span>
                <span className={`text-xl font-bold ${problem.statColor} leading-tight`}>
                  {problem.statText}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Center Arrow Connector */}
        <div className="col-span-1 flex flex-col items-center justify-center gap-2">
          <div className="flex-1 w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent" />
        </div>

        {/* Right — Solution Card (4 cols) */}
        <div className="col-span-4 bg-gradient-to-br from-blue-700 via-indigo-700 to-indigo-900 rounded-2xl p-5 shadow-2xl shadow-indigo-500/30 flex flex-col border border-white/10">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span className="text-base font-extrabold uppercase tracking-widest text-blue-200">The Solution</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">ScholarFlow</h2>
            </div>
          </div>

          {/* Elevator Pitch — left amber border accent */}
          <p className="text-xl font-bold text-white leading-snug mb-3 border-l-4 border-amber-400 pl-3">
            One AI-powered platform to upload, search, summarize, annotate & collaborate on research papers.
          </p>

          {/* Feature List — subtitles bumped to text-lg */}
          <div className="flex flex-col gap-1.5 flex-1">
            {solutions.map((item, i) => (
              <div key={i} className="bg-white/20 rounded-xl px-3 py-2 border border-white/25 flex items-center gap-2.5">
                <span className="text-xl flex-shrink-0 leading-none">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold text-white leading-tight">{item.title}</p>
                  <p className="text-lg font-bold text-blue-100 leading-tight truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer: two-part proactive message + stat source ── */}
      <div className="relative z-10 flex items-stretch gap-3">
        {/* Main CTA */}
        <div className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center gap-3">
          <span className="text-2xl">✅</span>
          <p className="text-xl font-extrabold text-white tracking-wide text-center">
            ScholarFlow solves all 4 problems — at a price every student can afford.
          </p>
        </div>
        {/* Cost context pill */}
        <div className="bg-white rounded-xl px-5 py-3 border-2 border-amber-200 shadow-md flex flex-col items-center justify-center flex-shrink-0">
          <p className="text-2xl font-black text-amber-600 leading-none">$50–$250</p>
          <p className="text-base font-bold text-slate-700 leading-tight text-center">per month<br/>competitor tools</p>
        </div>
        {/* Stat source note */}
        <div className="bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-md flex flex-col items-center justify-center flex-shrink-0">
          <p className="text-sm font-semibold text-slate-500 leading-tight text-center">* Stats adapted from</p>
          <p className="text-base font-extrabold text-slate-800 leading-tight text-center">ResearchGate Survey</p>
        </div>
      </div>
    </div>
  );
}