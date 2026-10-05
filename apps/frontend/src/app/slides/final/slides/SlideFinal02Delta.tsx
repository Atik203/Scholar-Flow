import { CheckCircle2, History, Sparkles } from "lucide-react";

const covered = [
  { icon: "📄", title: "Papers & Upload", desc: "PDF upload, AI title/author/abstract extraction, secure preview, S3 storage" },
  { icon: "📂", title: "Collections & Workspaces", desc: "Sharing, email invites, viewer / editor / Team-Lead roles" },
  { icon: "✍️", title: "TipTap Editor", desc: "Auto-save, drafts, resizable images, PDF/DOCX export" },
  { icon: "🧠", title: "AI Suite", desc: "Chat Q&A, summaries, insights, pgvector semantic search" },
  { icon: "💳", title: "Billing", desc: "Stripe checkout, idempotent webhooks, customer portal" },
  { icon: "🛠️", title: "Full Admin Console", desc: "Users, plans, system metrics, reports, audit log, settings" },
];

const fresh = [
  { icon: "📓", title: "Research Notes", desc: "Notebook hierarchy linked to every paper" },
  { icon: "💬", title: "Live Discussions", desc: "Threaded debate with real-time feed" },
  { icon: "🔔", title: "Notifications", desc: "SSE stream, center, history & settings" },
  { icon: "🛡️", title: "Security", desc: "2FA, active sessions & login history" },
  { icon: "📊", title: "Analytics", desc: "Personal stats, workspace activity & usage reports" },
  { icon: "🚨", title: "Admin Deep-Dive", desc: "Alerts console, moderation queue & ops roundup" },
];

export default function SlideFinal02Delta() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <History className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Project Update</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Since the Last Update</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">📦</span>
            <span className="text-xl font-bold text-slate-900">Update 3 of 3 — Final</span>
          </div>
        </div>
      </div>

      {/* ── Two columns ── */}
      <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 my-3 min-h-0">
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-4 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-slate-400 flex-shrink-0" />
            <h3 className="text-2xl font-extrabold text-slate-700">Covered in Updates 1 &amp; 2</h3>
          </div>
          <ul className="flex flex-col gap-1.5 min-h-0">
            {covered.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-2xl flex-shrink-0 leading-none">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold text-slate-900 leading-tight">{item.title}</p>
                  <p className="text-lg font-semibold text-slate-600 leading-tight truncate">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-md shadow-emerald-100 p-4 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-100 flex-shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <h3 className="text-2xl font-extrabold text-slate-900">New in This Update ✨</h3>
          </div>
          <ul className="flex flex-col gap-1.5 min-h-0">
            {fresh.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl px-3 py-1.5">
                <span className="text-2xl flex-shrink-0 leading-none">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold text-slate-900 leading-tight">{item.title}</p>
                  <p className="text-lg font-semibold text-slate-700 leading-tight truncate">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🎯 Core platform demoed before — today we go deep on <span className="text-amber-300">collaboration, trust &amp; operations</span>
        </p>
      </div>
    </div>
  );
}
