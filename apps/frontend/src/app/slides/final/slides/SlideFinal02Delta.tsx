import { CheckCircle2, History, Sparkles } from "lucide-react";

const covered = [
  { icon: "📄", tag: "Core", title: "Papers & S3 Upload", desc: "AI extraction (title/author/abstract), secure preview, AWS S3 storage" },
  { icon: "📂", tag: "Teams", title: "Collections & Workspaces", desc: "Role-based sharing (viewer, editor, lead) with email invitations" },
  { icon: "✍️", tag: "Editor", title: "TipTap Rich-Text Editor", desc: "Debounced auto-save, drafts, resizable images, PDF & DOCX export" },
  { icon: "🧠", tag: "AI", title: "AI Research Suite", desc: "Chat Q&A, contextual summaries, insights & pgvector semantic search" },
  { icon: "💳", tag: "Billing", title: "Stripe Subscriptions", desc: "Checkout sessions, idempotent webhooks & self-serve customer portal" },
  { icon: "🛠️", tag: "Admin", title: "Core Admin Console", desc: "User management, subscription tiers, health metrics & system settings" },
];

const fresh = [
  { icon: "📓", tag: "Notes", title: "Research Notes Workspace", desc: "Hierarchical living notebooks tied directly to each research paper" },
  { icon: "💬", tag: "Discussions", title: "Live Threaded Discussions", desc: "Contextual debate feed with real-time updates and workspace scope" },
  { icon: "🔔", tag: "SSE", title: "Real-time Notifications", desc: "Server-Sent Events stream, activity center & granular noise control" },
  { icon: "🛡️", tag: "Trust", title: "Institutional Security", desc: "TOTP 2FA, active session revocation & complete login audit history" },
  { icon: "📊", tag: "Insights", title: "Multi-Tier Analytics", desc: "Personal reading progress, team activity & exportable usage reports" },
  { icon: "🚨", tag: "Ops", title: "Admin Alerts & Moderation", desc: "Central incident alert console & dedicated community moderation queue" },
];

export default function SlideFinal02Delta() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <History className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-widest text-blue-600 mb-0.5">Project Roadmap &amp; Progress</p>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Since the Last Update</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-2xl border-2 border-slate-200 shadow-md">
            <span className="text-3xl">📦</span>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Milestone</p>
              <p className="text-xl font-black text-slate-900 leading-none">Update 3 of 3 · Final Defense</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two Columns: Covered vs Fresh ── */}
      <div className="flex-1 grid grid-cols-2 gap-5 relative z-10 my-3.5 min-h-0">
        {/* Left Column — Updates 1 & 2 */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg flex flex-col min-h-0 overflow-hidden">
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-slate-300 flex-shrink-0" />
              <h3 className="text-2xl font-black text-white tracking-wide">Delivered in Updates 1 &amp; 2</h3>
            </div>
            <span className="text-sm font-black uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full border border-white/20">
              6 Modules Shipped
            </span>
          </div>

          {/* List items */}
          <ul className="flex flex-col gap-2.5 p-4 min-h-0 flex-1 justify-between bg-slate-50/50">
            {covered.map((item, i) => (
              <li key={i} className="flex items-center gap-4 bg-white border-2 border-slate-200 rounded-xl px-5 py-2.5 shadow-sm">
                <span className="text-3xl flex-shrink-0 leading-none">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-xl font-black text-slate-900 leading-tight truncate">{item.title}</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-600 leading-tight truncate">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column — Update 3 Fresh */}
        <div className="bg-white rounded-2xl border-2 border-emerald-400 shadow-xl shadow-emerald-500/10 flex flex-col min-h-0 overflow-hidden">
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse flex-shrink-0" />
              <h3 className="text-2xl font-black text-white tracking-wide">New in This Final Update</h3>
            </div>
            <span className="text-sm font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-3 py-1 rounded-full shadow-sm">
              Today&apos;s Defense ✨
            </span>
          </div>

          {/* List items */}
          <ul className="flex flex-col gap-2.5 p-4 min-h-0 flex-1 justify-between bg-emerald-50/30">
            {fresh.map((item, i) => (
              <li key={i} className="flex items-center gap-4 bg-white border-2 border-emerald-200 rounded-xl px-5 py-2.5 shadow-sm">
                <span className="text-3xl flex-shrink-0 leading-none">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-xl font-black text-slate-900 leading-tight truncate">{item.title}</span>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-700 leading-tight truncate">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 border-2 border-blue-400/30 relative z-10 flex items-center justify-center gap-3">
        <span className="text-2xl">🎯</span>
        <p className="text-center text-2xl font-black text-white tracking-wide">
          Core paper management proven before — today we defend <span className="text-amber-300">collaboration, institutional security &amp; operations</span>
        </p>
      </div>
    </div>
  );
}
