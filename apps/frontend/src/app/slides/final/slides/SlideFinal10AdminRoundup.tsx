import { LayoutDashboard, ShieldCheck } from "lucide-react";

interface ConsoleCard {
  icon: string;
  title: string;
  route: string;
  metric: string;
  desc: string;
  features: string[];
  headerGrad: string;
  borderAccent: string;
  metricColor: string;
}

const consoles: ConsoleCard[] = [
  {
    icon: "👥",
    title: "Users & Roles",
    route: "/dashboard/admin/users",
    metric: "RBAC & Account Ban",
    desc: "Manage researcher & student accounts, team lead rights, and active session revocations.",
    features: ["Role assignment & tiered access", "1-click session kill & ban controls", "Granular workspace permissions"],
    headerGrad: "from-blue-600 to-indigo-600",
    borderAccent: "border-blue-200 hover:border-blue-400",
    metricColor: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    icon: "📑",
    title: "Reports & Export",
    route: "/dashboard/admin/reports",
    metric: "CSV & JSON Export",
    desc: "Generate institutional intelligence on paper uploads, team growth, and workspace usage.",
    features: ["Scheduled platform usage digests", "Full raw dataset JSON/CSV download", "Institutional team activity breakdowns"],
    headerGrad: "from-emerald-600 to-teal-700",
    borderAccent: "border-emerald-200 hover:border-emerald-400",
    metricColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    icon: "🧾",
    title: "Security Audit Log",
    route: "/dashboard/admin/audit",
    metric: "Traceable History",
    desc: "Every critical admin action, permission change, and auth event logged with IP & timestamp.",
    features: ["Tamper-proof event sequence", "Filter by user, action & date", "Full request IP & user-agent tracking"],
    headerGrad: "from-purple-600 to-indigo-700",
    borderAccent: "border-purple-200 hover:border-purple-400",
    metricColor: "text-purple-700 bg-purple-50 border-purple-200",
  },
  {
    icon: "🖥️",
    title: "System Health",
    route: "/dashboard/admin/system",
    metric: "10s Live Refresh",
    desc: "Real-time CPU idle/delta, RSS memory, PostgreSQL connections & storage projections.",
    features: ["Live CPU/RAM delta charts", "DB connection pool & S3 quotas", "Proactive health status thresholds"],
    headerGrad: "from-cyan-600 to-blue-700",
    borderAccent: "border-cyan-200 hover:border-cyan-400",
    metricColor: "text-cyan-700 bg-cyan-50 border-cyan-200",
  },
  {
    icon: "💳",
    title: "Billing & Plans",
    route: "/dashboard/admin/billing",
    metric: "Stripe Webhooks",
    desc: "Manage subscription tiers, payment lifecycles, webhook health & customer portal access.",
    features: ["Live Stripe webhook telemetry", "Customer portal & plan catalog", "Automated subscription dunning sweeper"],
    headerGrad: "from-amber-500 to-orange-600",
    borderAccent: "border-amber-200 hover:border-amber-400",
    metricColor: "text-amber-800 bg-amber-50 border-amber-200",
  },
  {
    icon: "🔑",
    title: "Keys & Webhooks",
    route: "/dashboard/admin/webhooks",
    metric: "Outbound Delivery",
    desc: "Manage AI provider credentials, external developer keys & automated webhook retry queues.",
    features: ["Secret key rotation & scopes", "Exponential backoff retries", "Outbound payload delivery logs"],
    headerGrad: "from-rose-600 to-pink-700",
    borderAccent: "border-rose-200 hover:border-rose-400",
    metricColor: "text-rose-700 bg-rose-50 border-rose-200",
  },
];

export default function SlideFinal10AdminRoundup() {
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
            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/30">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-widest text-blue-600 mb-0.5">Operations Architecture</p>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                Admin Consoles <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Roundup</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl shadow-lg border-2 border-slate-800 flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xl font-mono font-black text-slate-100">dashboard/admin/*</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-800 leading-normal text-left mt-3 max-w-5xl">
          Beyond alerts and moderation — a unified operations cockpit. Every console is fully wired with real data and ready to inspect.
        </p>
      </div>

      {/* ── 6 Console Cards in 3x2 Grid ── */}
      <div className="flex-1 grid grid-cols-3 gap-4 relative z-10 my-3 min-h-0">
        {consoles.map((item, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border-2 ${item.borderAccent} shadow-lg flex flex-col overflow-hidden transition-all duration-150`}
          >
            {/* Card Header Strip */}
            <div className={`bg-gradient-to-r ${item.headerGrad} px-5 py-2.5 flex items-center justify-between flex-shrink-0`}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl leading-none">{item.icon}</span>
                <h3 className="text-xl font-black text-white leading-tight">{item.title}</h3>
              </div>
              <span className="text-xs font-mono font-black text-white/90 bg-white/20 px-2.5 py-0.5 rounded-md">
                {item.route.replace("/dashboard/admin/", "")}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col justify-between flex-1 gap-2.5 bg-slate-50/50">
              <p className="text-lg font-bold text-slate-800 leading-snug">
                {item.desc}
              </p>

              {/* Sub-features list */}
              <div className="flex flex-col gap-1.5 my-1">
                {item.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2.5 text-base font-black text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="leading-tight">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-200">
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${item.metricColor}`}>
                  {item.metric}
                </span>
                <span className="text-xs font-mono text-slate-500 font-black">Live API</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 border-2 border-blue-400/30 relative z-10 flex items-center justify-center gap-3">
        <ShieldCheck className="w-6 h-6 text-amber-300 flex-shrink-0" />
        <p className="text-center text-2xl font-black text-white tracking-wide">
          Complete production back-office — <span className="text-amber-300">users, billing, telemetry, system metrics &amp; audit trails</span>
        </p>
      </div>
    </div>
  );
}
