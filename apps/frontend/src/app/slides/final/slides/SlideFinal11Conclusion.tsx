import { CheckCircle, Rocket, Sparkles } from "lucide-react";
import { SiGithub } from "react-icons/si";

const takeaways = [
  {
    icon: "✅",
    badge: "100% Shipped & Wired",
    title: "Feature-Complete Platform",
    desc: "From papers, S3 storage and AI to notes, discussions, notifications and admin — every single planned module is built, integrated, and verified.",
    highlights: ["12 Modules Complete", "S3 & TipTap Live", "Stripe Checkout & Portal"],
    color: "from-emerald-500 to-teal-600",
    accent: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/40",
    badgeStyle: "text-emerald-700 bg-emerald-100/80 border-emerald-300",
  },
  {
    icon: "🤝",
    badge: "Live SSE & WebSockets",
    title: "Collaboration, End to End",
    desc: "Hierarchical research notes, threaded discussions, and real-time push streams close the loop — research is now an active team discipline.",
    highlights: ["Per-Paper Living Notes", "Live Discussion Feeds", "Real-Time SSE Mentions"],
    color: "from-blue-500 to-indigo-600",
    accent: "border-blue-200 hover:border-blue-400 bg-blue-50/40",
    badgeStyle: "text-blue-700 bg-blue-100/80 border-blue-300",
  },
  {
    icon: "🛡️",
    badge: "Institutional Trust",
    title: "Security & Operations",
    desc: "Two-factor authentication, active session revocation, immutable audit logs, central alerts, and moderation were shipped as core features.",
    highlights: ["TOTP 2FA Authenticator", "Live Session Revocation", "Tamper-Proof Audit Trail"],
    color: "from-purple-500 to-indigo-600",
    accent: "border-purple-200 hover:border-purple-400 bg-purple-50/40",
    badgeStyle: "text-purple-700 bg-purple-100/80 border-purple-300",
  },
  {
    icon: "🔭",
    badge: "Ready to Scale",
    title: "Future Horizons",
    desc: "Multi-model AI reasoning fallbacks, richer institutional exports, mobile PWA apps, and automated citation sync — the architecture is ready to expand.",
    highlights: ["Multi-Provider AI Fallback", "Automated Citation Sync", "Mobile PWA & Workspaces"],
    color: "from-amber-500 to-orange-600",
    accent: "border-amber-200 hover:border-amber-400 bg-amber-50/40",
    badgeStyle: "text-amber-800 bg-amber-100/80 border-amber-300",
  },
];

export default function SlideFinal11Conclusion() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/40 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-widest text-emerald-600 mb-0.5">Final Defense Summary</p>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                ScholarFlow Is Complete — <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Ready to Defend</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-2xl border-2 border-slate-200 shadow-md">
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <span className="text-2xl font-black text-slate-900">4 Core Pillars Delivered</span>
          </div>
        </div>
      </div>

      {/* ── 4 Takeaway Cards ── */}
      <div className="flex-1 grid grid-cols-2 gap-5 relative z-10 my-3.5 min-h-0">
        {takeaways.map((item, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-5 border-2 ${item.accent} shadow-lg flex gap-4 items-start transition-all duration-150 justify-between`}
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md text-white`}>
              <span className="text-3xl">{item.icon}</span>
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">{item.title}</h3>
                  <span className={`text-sm font-black uppercase tracking-wider px-3.5 py-1 rounded-full border ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-700 leading-relaxed text-left mb-2">{item.desc}</p>
              </div>

              {/* Sub-highlights */}
              <div className="flex flex-wrap gap-2.5 pt-2.5 border-t-2 border-slate-100">
                {item.highlights.map((h, hi) => (
                  <span key={hi} className="text-sm font-black uppercase tracking-wider text-slate-800 bg-slate-50 border-2 border-slate-300 px-3.5 py-1.5 rounded-xl shadow-sm">
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer With Links ── */}
      <div className="flex items-stretch gap-3 relative z-10">
        <div className="flex-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 rounded-xl px-8 py-3.5 shadow-lg border-2 border-emerald-400/30 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-300 animate-pulse flex-shrink-0" />
          <p className="text-2xl font-black text-white text-center">
            Shipped, verified &amp; defended — <span className="text-amber-300">ScholarFlow delivers the full SaaS research vision</span>
          </p>
        </div>
        <a
          href="https://github.com/Atik203/Scholar-Flow"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-2xl shadow-md hover:bg-slate-800 transition-colors flex-shrink-0"
        >
          <SiGithub className="w-6 h-6" /> GitHub
        </a>
      </div>
    </div>
  );
}
