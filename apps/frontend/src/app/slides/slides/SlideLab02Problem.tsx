import { AlertTriangle, Bot, Clock, FolderX, Lightbulb, Monitor, Users, Zap } from "lucide-react";

const problems = [
  {
    icon: FolderX,
    title: "Fragmented Tools",
    description: "Researchers switch between 4+ disconnected apps with no unified place to store, search, or manage research papers.",
    stat: "65%",
    statText: "use 4+ separate tools",
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50 border-rose-200",
    statColor: "text-rose-700",
  },
  {
    icon: Bot,
    title: "Zero AI Assistance",
    description: "Paper reading, summarization, and literature reviews are done manually — wasting hours that could go into actual research.",
    stat: "91%",
    statText: "get no AI help",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 border-amber-200",
    statColor: "text-amber-700",
  },
  {
    icon: Users,
    title: "Weak Collaboration",
    description: "No shared workspaces, role controls, or co-annotation tools — research teams work in silos and lose context.",
    stat: "78%",
    statText: "struggle to collaborate",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50 border-purple-200",
    statColor: "text-purple-700",
  },
  {
    icon: Clock,
    title: "Wasted Time",
    description: "Metadata entry, citation formatting, and paper organization are tedious manual tasks that slow every researcher down.",
    stat: "82%",
    statText: "still work manually",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 border-blue-200",
    statColor: "text-blue-700",
  },
];

const solutions = [
  { icon: "📄", title: "Smart Paper Upload", desc: "Auto-extracts title, authors & abstract on upload" },
  { icon: "🔍", title: "AI Semantic Search", desc: "Find relevant passages across all your papers instantly" },
  { icon: "🧠", title: "AI Summaries", desc: "Condense any paper into crisp, readable insights" },
  { icon: "📂", title: "Team Collections", desc: "Group, share and explore papers together" },
  { icon: "✏️", title: "Inline Annotations", desc: "Highlight, comment and discuss within the paper" },
  { icon: "🔒", title: "Role-Based Access", desc: "Viewer, editor and admin controls per workspace" },
];

export default function SlideLab02Problem() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-12 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/25">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-base font-bold uppercase tracking-widest text-rose-600 mb-0.5">Slide 02 · Problem Statement</p>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Why ScholarFlow?</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
          <Zap className="w-5 h-5 text-amber-500" />
          <span className="text-xl font-bold text-slate-900">The Research Management Crisis</span>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="flex-1 grid grid-cols-5 gap-5 relative z-10 my-4 min-h-0">

        {/* Left — 4 Problem Cards */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Title Row */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <problem.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{problem.title}</h3>
                </div>

                {/* Description */}
                <p className="text-xl font-semibold text-slate-800 leading-snug text-justify">
                  {problem.description}
                </p>
              </div>

              {/* Stat Badge */}
              <div className={`mt-3 flex items-center gap-2.5 px-3 py-2 rounded-xl border ${problem.bgColor}`}>
                <span className={`text-3xl font-black bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}>
                  {problem.stat}
                </span>
                <span className={`text-xl font-bold ${problem.statColor} leading-tight`}>
                  {problem.statText}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Solution Card */}
        <div className="col-span-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-2xl p-5 shadow-xl shadow-indigo-500/25 flex flex-col">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <span className="text-base font-extrabold uppercase tracking-widest text-blue-100">Our Solution</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">What is ScholarFlow?</h2>
            </div>
          </div>

          {/* Elevator Pitch */}
          <p className="text-xl font-bold text-white leading-snug mb-4 border-l-4 border-amber-400 pl-3">
            One platform to upload, search, summarize, annotate and collaborate on research papers — powered by AI.
          </p>

          {/* Feature List */}
          <div className="flex flex-col gap-2 flex-1">
            {solutions.map((item, i) => (
              <div key={i} className="bg-white/20 rounded-xl px-3 py-2.5 border border-white/25 flex items-center gap-3">
                <span className="text-2xl flex-shrink-0 leading-none">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold text-white leading-none">{item.title}</p>
                  <p className="text-base font-semibold text-blue-100 leading-tight truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-bold text-white tracking-wide">
          💸 Existing tools cost <span className="text-amber-300 font-extrabold">$50–$250/month</span> — ScholarFlow brings it all together, affordably, for students & researchers.
        </p>
      </div>
    </div>
  );
}