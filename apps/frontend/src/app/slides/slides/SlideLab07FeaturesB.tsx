import { BarChart3, BookOpen, CreditCard, Highlighter, Settings, Shield, Sparkles } from "lucide-react";

const features = [
  {
    num: "07",
    icon: BookOpen,
    title: "Citation Generator",
    desc: "Auto-generates APA, MLA, IEEE, Chicago & BibTeX citations from paper metadata. Zero manual formatting.",
    color: "from-indigo-500 to-indigo-700",
    accent: "border-indigo-200 bg-indigo-50/60",
    numColor: "text-indigo-200",
  },
  {
    num: "08",
    icon: Highlighter,
    title: "PDF Annotations",
    desc: "Highlight passages, add notes, bookmark sections directly on PDFs for collaborative review and reference.",
    color: "from-amber-500 to-orange-600",
    accent: "border-amber-200 bg-amber-50/60",
    numColor: "text-amber-200",
  },
  {
    num: "09",
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track reading progress, usage stats, and team activity with visual charts and productivity insights.",
    color: "from-cyan-500 to-teal-600",
    accent: "border-cyan-200 bg-cyan-50/60",
    numColor: "text-cyan-200",
  },
  {
    num: "10",
    icon: CreditCard,
    title: "Subscription Billing",
    desc: "Stripe-powered plans: free tier, pro, and team. Secure billing portal with usage-based pricing.",
    color: "from-emerald-500 to-green-600",
    accent: "border-emerald-200 bg-emerald-50/60",
    numColor: "text-emerald-200",
  },
  {
    num: "11",
    icon: Settings,
    title: "Admin Panel",
    desc: "Full admin dashboard — user management, system metrics, subscription oversight, and platform configuration.",
    color: "from-slate-600 to-slate-800",
    accent: "border-slate-200 bg-slate-50/60",
    numColor: "text-slate-300",
  },
  {
    num: "12",
    icon: Shield,
    title: "Enterprise Security",
    desc: "OAuth + JWT auth, rate limiting, HTTPS, CORS protection, and role-based access keep all data safe.",
    color: "from-rose-500 to-red-600",
    accent: "border-rose-200 bg-rose-50/60",
    numColor: "text-rose-200",
  },
];

export default function SlideLab07FeaturesB() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-rose-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-indigo-600 mb-0.5">Slide 07 · Advanced Features</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Core Features <span className="text-indigo-600">(Part 2 of 2)</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold text-slate-900">Features 07 – 12</span>
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 rounded-xl px-6 py-3 shadow-lg shadow-indigo-500/20 border border-indigo-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          ✅ All 12 features are <span className="text-amber-300">fully implemented and live</span> — ScholarFlow is production-ready
        </p>
      </div>
    </div>
  );
}