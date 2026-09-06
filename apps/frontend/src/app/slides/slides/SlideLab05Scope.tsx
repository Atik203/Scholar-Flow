import { CheckCircle2, Globe, Layers, Settings } from "lucide-react";

const inScope = [
  {
    icon: Layers,
    title: "Paper Upload & Processing",
    description:
      "PDF/DOCX upload with AI metadata extraction — title, authors, abstract, keywords — stored securely via AWS S3.",
    color: "from-emerald-500 to-teal-600",
    accent: "border-emerald-200 bg-emerald-50/60",
    tag: "Core Module",
    tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    icon: CheckCircle2,
    title: "AI-Powered Features",
    description:
      "Auto-summarization, context-aware chat Q&A with documents, and AI-generated literature reviews from collections.",
    color: "from-blue-500 to-indigo-600",
    accent: "border-blue-200 bg-blue-50/60",
    tag: "AI Module",
    tagColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    icon: Globe,
    title: "Collaboration & Workspaces",
    description:
      "Team workspaces with role-based access, shared libraries, inline annotations, and real-time activity tracking.",
    color: "from-purple-500 to-indigo-600",
    accent: "border-purple-200 bg-purple-50/60",
    tag: "Team Module",
    tagColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    icon: Settings,
    title: "Editor & Billing System",
    description:
      "TipTap rich text editor with auto-save & PDF/DOCX export. Stripe billing with free tier, pro, and team plans.",
    color: "from-amber-500 to-orange-600",
    accent: "border-amber-200 bg-amber-50/60",
    tag: "Platform Module",
    tagColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

export default function SlideLab05Scope() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/40 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-emerald-600 mb-0.5">Project Scope</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">What ScholarFlow Will Deliver</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-600 px-5 py-2.5 rounded-xl shadow-md">
            <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-xl font-extrabold text-white">4 Core Modules</span>
          </div>
        </div>
      </div>

      {/* ── 2×2 In-Scope Grid ── */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 relative z-10 my-3 min-h-0">
        {inScope.map((item, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-5 border-2 ${item.accent} shadow-md flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-base font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">{item.title}</h3>
              <p className="text-xl font-semibold text-slate-800 leading-snug text-justify">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/20 border border-emerald-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🎯 All 4 modules are <span className="text-amber-300">prioritized and planned</span> for the initial release — delivering maximum research value from day one
        </p>
      </div>
    </div>
  );
}