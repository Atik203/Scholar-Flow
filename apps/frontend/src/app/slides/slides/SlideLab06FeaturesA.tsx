import { Bot, Building2, FileEdit, FolderOpen, MessageSquare, Sparkles, Upload } from "lucide-react";

const features = [
  {
    num: "01",
    icon: Upload,
    title: "Smart Paper Upload",
    desc: "Upload PDF or DOCX files — AI instantly extracts title, authors, abstract, and keywords. No manual entry needed.",
    color: "from-blue-500 to-blue-700",
    accent: "border-blue-200 bg-blue-50/60",
    numColor: "text-blue-200",
  },
  {
    num: "02",
    icon: Bot,
    title: "AI Summarization",
    desc: "One-click AI summaries of any paper — key findings, methodology, and conclusions extracted in seconds.",
    color: "from-emerald-500 to-teal-600",
    accent: "border-emerald-200 bg-emerald-50/60",
    numColor: "text-emerald-200",
  },
  {
    num: "03",
    icon: MessageSquare,
    title: "AI Chat Q&A",
    desc: "Ask questions directly to your papers. Context-aware AI understands the full document and answers accurately.",
    color: "from-teal-500 to-cyan-600",
    accent: "border-teal-200 bg-teal-50/60",
    numColor: "text-teal-200",
  },
  {
    num: "04",
    icon: FileEdit,
    title: "Rich Text Editor",
    desc: "Built-in TipTap editor for writing research notes. Auto-saves drafts and exports to PDF or DOCX format.",
    color: "from-purple-500 to-indigo-600",
    accent: "border-purple-200 bg-purple-50/60",
    numColor: "text-purple-200",
  },
  {
    num: "05",
    icon: FolderOpen,
    title: "Smart Collections",
    desc: "Organize papers into collections with tags, filters, and full-text search for quick access to your research.",
    color: "from-orange-500 to-amber-600",
    accent: "border-orange-200 bg-orange-50/60",
    numColor: "text-orange-200",
  },
  {
    num: "06",
    icon: Building2,
    title: "Team Workspaces",
    desc: "Shared workspaces with viewer, editor, and admin roles. Collaborate on paper libraries with your research team.",
    color: "from-rose-500 to-pink-600",
    accent: "border-rose-200 bg-rose-50/60",
    numColor: "text-rose-200",
  },
];

export default function SlideLab06FeaturesA() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Slide 06 · Key Features</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Core Features <span className="text-blue-600">(Part 1 of 2)</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-slate-900">Features 01 – 06</span>
          </div>
        </div>
      </div>

      {/* ── 3×2 Feature Grid ── */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3 relative z-10 my-3 min-h-0">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.num}
              className={`bg-white rounded-2xl p-4 border-2 ${feature.accent} shadow-md flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-11 h-11 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Large faded number */}
                  <span className={`text-4xl font-black ${feature.numColor} select-none leading-none`}>{feature.num}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1.5 leading-tight">{feature.title}</h3>
                <p className="text-xl font-semibold text-slate-800 leading-snug text-justify">{feature.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🔁 Continued on Slide 7 — <span className="text-amber-300">6 more advanced features</span> including Semantic Search, Billing & Admin Dashboard
        </p>
      </div>
    </div>
  );
}