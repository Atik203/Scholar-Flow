import { CheckCircle2, Globe, Layers, ListX, Settings, XCircle } from "lucide-react";

const inScope = [
  {
    icon: Layers,
    title: "Paper Upload & Processing",
    description: "PDF/DOCX upload with AI metadata extraction — title, authors, abstract, keywords — stored securely via AWS S3.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: CheckCircle2,
    title: "AI-Powered Features",
    description: "Auto-summarization, context-aware chat Q&A with documents, and AI-generated literature reviews from collections.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Globe,
    title: "Collaboration & Workspaces",
    description: "Team workspaces with role-based access, shared libraries, inline annotations, and real-time activity tracking.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: Settings,
    title: "Editor & Billing System",
    description: "TipTap rich text editor with auto-save & PDF/DOCX export. Stripe billing with free tier, pro, and team plans.",
    color: "from-amber-500 to-orange-600",
  },
];

const outScope = [
  { icon: "📱", text: "Native mobile apps (iOS/Android)", reason: "Web-responsive only" },
  { icon: "📴", text: "Offline / desktop mode", reason: "Requires active internet" },
  { icon: "📥", text: "Third-party data import", reason: "Manual upload only for now" },
];

export default function SlideLab05Scope() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/40 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-red-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-red-400 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-emerald-600 mb-0.5">Slide 05 · Project Scope</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">What Is Included & What Is Not</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-xl shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-xl font-extrabold text-white">In Scope: 4</span>
            </div>
            <div className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-xl shadow-md">
              <XCircle className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-xl font-extrabold text-white">Out of Scope: 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 my-3 min-h-0">

        {/* ── In Scope Column ── */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-md flex flex-col overflow-hidden">
          {/* Column header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
            <h3 className="text-2xl font-extrabold text-white">✅ In Scope</h3>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 p-4">
            {inScope.map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900 leading-tight">{item.title}</h4>
                </div>
                <p className="text-xl font-semibold text-slate-800 leading-snug text-justify">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Out of Scope Column ── */}
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-md flex flex-col overflow-hidden">
          {/* Column header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-white flex-shrink-0" />
            <h3 className="text-2xl font-extrabold text-white">❌ Out of Scope</h3>
          </div>

          <div className="flex-1 flex flex-col gap-3 p-4 justify-start">
            {outScope.map((item, i) => (
              <div key={i} className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-center gap-4">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold text-slate-900 leading-tight">{item.text}</p>
                  <p className="text-xl font-semibold text-red-600 leading-tight">{item.reason}</p>
                </div>
              </div>
            ))}

            {/* Why callout */}
            <div className="mt-auto bg-slate-900 rounded-xl p-4 border border-slate-700">
              <p className="text-xl font-bold text-white leading-snug text-justify">
                🔭 These features are intentionally deferred to keep the initial release focused, stable, and deliverable within the project timeline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/20 border border-emerald-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🎯 All In-Scope features are <span className="text-amber-300">fully implemented and deployed</span> — live at scholar-flow-ai.vercel.app
        </p>
      </div>
    </div>
  );
}