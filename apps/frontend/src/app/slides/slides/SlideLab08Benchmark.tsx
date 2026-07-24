import { BarChart3, CheckCircle2, TrendingUp, XCircle } from "lucide-react";

const competitors = [
  {
    name: "Mendeley",
    company: "Elsevier",
    color: "from-orange-500 to-orange-600",
    pricing: "Freemium",
    features: [true, false, false, false],
    limitation: "Vendor lock-in, no AI",
  },
  {
    name: "Zotero",
    company: "Open Source",
    color: "from-red-500 to-rose-600",
    pricing: "Free (300 MB)",
    features: [true, false, false, false],
    limitation: "No AI, 300 MB cap",
  },
  {
    name: "Paperpile",
    company: "Paperpile LLC",
    color: "from-indigo-500 to-indigo-600",
    pricing: "$2.99 / mo",
    features: [true, false, false, false],
    limitation: "No AI, Google Docs only",
  },
  {
    name: "EndNote",
    company: "Clarivate",
    color: "from-blue-700 to-blue-800",
    pricing: "$250 / yr",
    features: [true, false, false, false],
    limitation: "Expensive, dated UI",
  },
];

const featureLabels = [
  "PDF Annotation",
  "AI Summarization",
  "AI Chat Q&A",
  "Team Collaboration",
];

const scholarFlowFeatures = [true, true, true, true];

export default function SlideLab08Benchmark() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Slide 08 · Benchmark Analysis</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">ScholarFlow vs. Competitors</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <TrendingUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xl font-bold text-slate-900">Market Gap Analysis</span>
          </div>
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <div className="flex-1 grid grid-cols-5 gap-3 relative z-10 my-3 min-h-0">

        {/* ── ScholarFlow Column (highlighted) ── */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-2xl p-4 flex flex-col shadow-2xl shadow-indigo-500/30 border border-white/10">
          {/* Header */}
          <div className="text-center mb-3 pb-3 border-b border-white/20">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/30">
              <span className="text-xl">⭐</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white leading-tight">ScholarFlow</h3>
            <p className="text-lg font-bold text-blue-200">AI-Powered Platform</p>
            <div className="mt-1.5 bg-emerald-500 text-white text-base font-extrabold px-3 py-0.5 rounded-full inline-block">Free Tier Available</div>
          </div>

          {/* Feature checks */}
          <div className="flex flex-col gap-2.5 flex-1">
            {featureLabels.map((label, i) => (
              <div key={i} className="bg-white/20 rounded-xl px-3 py-2 border border-white/25 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span className="text-xl font-bold text-white leading-tight">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/20 text-center">
            <span className="text-xl font-extrabold text-emerald-300">✅ All 4 supported</span>
          </div>
        </div>

        {/* ── Competitor Columns ── */}
        {competitors.map((comp, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 shadow-md flex flex-col overflow-hidden">
            {/* Coloured header strip */}
            <div className={`bg-gradient-to-r ${comp.color} px-4 py-3 text-white text-center`}>
              <h3 className="text-2xl font-extrabold leading-tight">{comp.name}</h3>
              <p className="text-lg font-bold text-white/90">{comp.company}</p>
              <div className="mt-1 bg-white/20 text-white text-base font-bold px-3 py-0.5 rounded-full inline-block">{comp.pricing}</div>
            </div>

            {/* Feature rows */}
            <div className="flex flex-col gap-2 p-3 flex-1">
              {featureLabels.map((label, j) => (
                <div key={j} className={`rounded-xl px-3 py-2 border flex items-center gap-2 ${comp.features[j] ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                  {comp.features[j] ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className={`text-xl font-bold leading-tight ${comp.features[j] ? "text-emerald-800" : "text-red-700"}`}>{label}</span>
                </div>
              ))}
            </div>

            {/* Limitation footer */}
            <div className="px-3 pb-3">
              <div className="bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
                <p className="text-xl font-bold text-slate-700 leading-tight text-center">⚠️ {comp.limitation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🏆 <span className="text-amber-300">Market Gap:</span> No existing tool combines AI-first design, real-time collaboration, and affordable pricing — ScholarFlow does.
        </p>
      </div>
    </div>
  );
}