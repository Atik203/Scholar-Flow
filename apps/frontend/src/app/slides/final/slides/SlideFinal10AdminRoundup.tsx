import { LayoutDashboard } from "lucide-react";

const consoles = [
  { icon: "👥", title: "Users & Roles", desc: "Manage accounts, roles and access across the platform." },
  { icon: "📑", title: "Reports", desc: "Generate platform reports with CSV/JSON export." },
  { icon: "🧾", title: "Audit Log", desc: "Every sensitive action recorded — fully traceable." },
  { icon: "🖥️", title: "System Health", desc: "Live CPU, memory, storage and DB metrics." },
  { icon: "💳", title: "Billing & Plans", desc: "Subscriptions, payments and plan catalog in one place." },
  { icon: "🔑", title: "Keys & Webhooks", desc: "API keys, AI keys and outbound webhook deliveries." },
];

export default function SlideFinal10AdminRoundup() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Project Update — Admin</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Admin Consoles <span className="text-blue-600">Roundup</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-5 py-2.5 rounded-2xl shadow-md flex-shrink-0">
            <span className="text-lg font-mono font-bold text-slate-200">dashboard/admin/*</span>
          </div>
        </div>
        <p className="text-xl font-semibold text-slate-800 leading-snug text-justify mt-3 max-w-5xl">
          Beyond alerts and moderation — a complete operations cockpit. Every console is live in the demo after this deck.
        </p>
      </div>

      {/* ── 6 consoles ── */}
      <div className="flex-1 grid grid-cols-3 gap-4 relative z-10 my-3 min-h-0">
        {consoles.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-md flex flex-col items-start justify-center gap-2">
            <span className="text-3xl">{item.icon}</span>
            <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{item.title}</h3>
            <p className="text-xl font-semibold text-slate-800 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🎛️ Full admin suite — <span className="text-amber-300">users, billing, AI, system, audit</span> and more
        </p>
      </div>
    </div>
  );
}
