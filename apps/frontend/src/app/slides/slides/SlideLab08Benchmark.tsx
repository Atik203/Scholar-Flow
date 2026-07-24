import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const competitors = [
  {
    name: "Mendeley", company: "Elsevier", color: "from-orange-500 to-orange-600",
    type: "Reference Manager", users: "15M+", pricing: "Freemium",
    features: [
      { name: "PDF Annotation", ok: true },
      { name: "AI Summarization", ok: false },
      { name: "AI Chat with Papers", ok: false },
      { name: "Real-time Collaboration", ok: false },
    ],
    limitation: "Limited AI, vendor lock-in with Elsevier",
  },
  {
    name: "Zotero", company: "Open Source", color: "from-red-500 to-red-600",
    type: "Reference Manager", users: "8M+", pricing: "Free (300MB)",
    features: [
      { name: "PDF Annotation", ok: true },
      { name: "AI Summarization", ok: false },
      { name: "AI Chat with Papers", ok: false },
      { name: "Real-time Collaboration", ok: false },
    ],
    limitation: "No native AI, basic collab, 300MB limit",
  },
  {
    name: "Paperpile", company: "Paperpile LLC", color: "from-indigo-500 to-indigo-600",
    type: "Reference Manager", users: "1M+", pricing: "$2.99/mo",
    features: [
      { name: "PDF Annotation", ok: true },
      { name: "AI Summarization", ok: false },
      { name: "AI Chat with Papers", ok: false },
      { name: "Real-time Collaboration", ok: false },
    ],
    limitation: "Limited free tier, no AI, Google Docs only",
  },
  {
    name: "EndNote", company: "Clarivate Analytics", color: "from-blue-700 to-blue-800",
    type: "Enterprise Reference", users: "3M+", pricing: "$250/yr",
    features: [
      { name: "PDF Annotation", ok: true },
      { name: "AI Summarization", ok: false },
      { name: "AI Chat with Papers", ok: false },
      { name: "Real-time Collaboration", ok: false },
    ],
    limitation: "Very expensive, dated UI, no AI at all",
  },
];

const scholarFlowFeatures = [
  { name: "PDF Annotation", ok: true },
  { name: "AI Summarization", ok: true },
  { name: "AI Chat with Papers", ok: true },
  { name: "Real-time Collaboration", ok: true },
];

export default function SlideLab08Benchmark() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">Benchmark Analysis</h1>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-3">
        {/* ScholarFlow column highlighted */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white flex flex-col">
          <div className="text-center mb-3">
            <h3 className="text-2xl font-bold">ScholarFlow</h3>
            <p className="text-sm text-blue-100 font-semibold">AI-Powered Platform</p>
            <p className="text-sm text-blue-100">Freemium · 2025</p>
          </div>
          <div className="border-t border-white/20 pt-3 space-y-2 flex-1">
            {scholarFlowFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="text-lg font-semibold">{f.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-white/20 text-center">
            <span className="text-lg font-bold text-green-300">✓ All features supported</span>
          </div>
        </div>

        {competitors.map((comp, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col">
            <div className={`bg-gradient-to-br ${comp.color} rounded-lg px-3 py-2 text-white text-center mb-3`}>
              <h3 className="text-2xl font-bold">{comp.name}</h3>
              <p className="text-xs font-semibold">{comp.type}</p>
              <p className="text-xs">{comp.users} · {comp.pricing}</p>
            </div>
            <div className="space-y-2 flex-1">
              {comp.features.map((f, j) => (
                <div key={j} className="flex items-center gap-2">
                  {f.ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-2xl font-normal text-black">{f.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200">
              <p className="text-sm text-black font-semibold">✗ {comp.limitation}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 text-center">
        <span className="text-2xl font-bold text-black">
          <span className="text-blue-700">Market Gap:</span> No existing solution combines AI-first design, modern tech stack, and affordable team collaboration in one platform.
        </span>
      </div>
    </div>
  );
}