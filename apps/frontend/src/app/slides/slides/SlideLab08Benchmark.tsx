import { BarChart3, CheckCircle2, TrendingUp, XCircle } from "lucide-react";

const competitors = [
  {
    name: "Paperpal",
    company: "Cactus / Researcher.Life",
    color: "from-purple-600 to-indigo-700",
    pricing: "$12–$29 / mo",
    features: [false, true, true, false, false, true],
    limitation: "Writing tool; no ref library, team workspaces, or PDF annotations",
  },
  {
    name: "EndNote 21",
    company: "Clarivate Analytics",
    color: "from-blue-700 to-slate-800",
    pricing: "$275 / license",
    features: [true, false, false, false, true, false],
    limitation: "Expensive upfront cost, legacy UI, zero native AI tools",
  },
  {
    name: "Mendeley",
    company: "Elsevier",
    color: "from-orange-500 to-red-600",
    pricing: "Freemium (2 GB)",
    features: [true, false, false, false, true, false],
    limitation: "Elsevier lock-in, no AI Q&A or automated summaries",
  },
  {
    name: "Zotero",
    company: "Open Source",
    color: "from-emerald-600 to-teal-700",
    pricing: "Free (300 MB cap)",
    features: [true, false, false, false, true, false],
    limitation: "No native AI, tight storage limits without plugins",
  },
];

const featureLabels = [
  "Reference Management",
  "AI Paper Summaries",
  "Contextual AI Q&A",
  "Team Workspaces",
  "PDF Annotations",
  "Rich Text Editor",
];

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
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">ScholarFlow vs. Market Leaders</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <TrendingUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xl font-bold text-slate-900">Updated 2026 Feature Benchmark</span>
          </div>
        </div>
      </div>

      {/* ── Comparison Grid ── */}
      <div className="flex-1 grid grid-cols-5 gap-3 relative z-10 my-4 min-h-0">

        {/* ── ScholarFlow Column (highlighted) ── */}
        <div className="bg-white rounded-2xl border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 flex flex-col overflow-hidden h-full">
          {/* Header Strip - matching exact 100px height */}
          <div className="h-[100px] bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 px-3 py-2 text-white text-center flex-shrink-0 flex flex-col justify-center items-center">
            <h3 className="text-2xl font-extrabold text-white leading-tight flex items-center gap-1.5">
              <span>⭐</span> ScholarFlow
            </h3>
            <p className="text-sm font-bold text-blue-200">Our Platform</p>
            <div className="mt-1 bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-block">Free Tier + Pro</div>
          </div>

          {/* Feature checks starting at top */}
          <div className="p-3 flex flex-col gap-2 flex-1 justify-start bg-blue-50/40">
            {featureLabels.map((label, i) => (
              <div key={i} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl px-3 py-2.5 border border-indigo-500 flex items-center gap-2.5 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span className="text-xl font-bold text-white leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* Bottom Summary Pill */}
          <div className="px-3 pb-3 bg-blue-50/40">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-xl px-3 py-2 border border-indigo-600 min-h-[52px] flex items-center justify-center">
              <span className="text-xl font-extrabold text-emerald-300">✅ All 6 Supported</span>
            </div>
          </div>
        </div>

        {/* ── Competitor Columns ── */}
        {competitors.map((comp, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 shadow-md flex flex-col overflow-hidden h-full">
            {/* Coloured header strip - matching exact 100px height */}
            <div className={`h-[100px] bg-gradient-to-r ${comp.color} px-3 py-2 text-white text-center flex-shrink-0 flex flex-col justify-center items-center`}>
              <h3 className="text-2xl font-extrabold leading-tight">{comp.name}</h3>
              <p className="text-sm font-bold text-white/90 truncate max-w-full">{comp.company}</p>
              <div className="mt-1 bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full inline-block">{comp.pricing}</div>
            </div>

            {/* Feature rows starting at top */}
            <div className="p-3 flex flex-col gap-2 flex-1 justify-start">
              {featureLabels.map((label, j) => (
                <div key={j} className={`rounded-xl px-3 py-2.5 border flex items-center gap-2.5 ${comp.features[j] ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
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
              <div className="bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 min-h-[52px] flex items-center justify-center">
                <p className="text-base font-bold text-slate-700 leading-tight text-center">⚠️ {comp.limitation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🏆 <span className="text-amber-300">Market Gap:</span> Legacy managers (EndNote/Mendeley/Zotero) lack native AI, while AI writing tools (Paperpal) lack reference libraries & team workspaces.
        </p>
      </div>
    </div>
  );
}