import { AlertCircle, Building2 } from "lucide-react";

const competitors = [
  {
    name: "Mendeley",
    company: "Elsevier",
    color: "from-orange-500 to-orange-600",
    type: "Reference Manager",
    users: "15M+",
    pricing: "Freemium",
    limitation: "Limited AI, Vendor lock-in",
  },
  {
    name: "Zotero",
    company: "Open Source",
    color: "from-red-500 to-red-600",
    type: "Reference Manager",
    users: "8M+",
    pricing: "Free (300MB)",
    limitation: "No native AI, Basic collaboration",
  },
  {
    name: "ResearchGate",
    company: "ResearchGate GmbH",
    color: "from-teal-500 to-teal-600",
    type: "Academic Network",
    users: "20M+",
    pricing: "Free + Ads",
    limitation: "Not a reference manager, No PDF tools",
  },
  {
    name: "EndNote",
    company: "Clarivate Analytics",
    color: "from-blue-700 to-blue-800",
    type: "Enterprise Ref",
    users: "3M+",
    pricing: "$250/yr",
    limitation: "Very expensive, Dated UI, No AI",
  },
];

const gaps = [
  {
    gap: "No AI-Powered Paper Summarization",
    impact: "Critical",
    affected: "Mendeley, Zotero, EndNote, ResearchGate",
    solution: "Instant AI summaries with key findings",
  },
  {
    gap: "No AI Chat Interface for Papers",
    impact: "Critical",
    affected: "All Competitors",
    solution: "Chat with papers or entire collections",
  },
  {
    gap: "Limited Real-time Collaboration",
    impact: "High",
    affected: "Zotero, ResearchGate, EndNote",
    solution: "Real-time workspace with presence",
  },
  {
    gap: "Expensive Enterprise Pricing",
    impact: "High",
    affected: "EndNote, Mendeley, Paperpile",
    solution: "$10-30/mo with generous free tier",
  },
];

export default function SlideLab08Benchmark() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">
          Benchmark Analysis
        </h1>
      </div>

      {/* Competitors Row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {competitors.map((comp, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${comp.color} rounded-xl p-4 text-white`}
          >
            <h3 className="font-bold text-lg mb-2">{comp.name}</h3>
            <p className="text-sm text-white/80 mb-1">{comp.type}</p>
            <div className="flex justify-between text-sm mt-2">
              <span>{comp.users}</span>
              <span>{comp.pricing}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs text-white/70">✗ {comp.limitation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gaps */}
      <h2 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        Critical Market Gaps
      </h2>
      <div className="flex-1 grid grid-cols-2 gap-3">
        {gaps.map((gap, i) => (
          <div
            key={i}
            className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-black text-sm">{gap.gap}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  gap.impact === "Critical"
                    ? "bg-red-100 text-red-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {gap.impact}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-1">
              Affected: {gap.affected}
            </p>
            <div className="bg-blue-50 rounded-lg px-3 py-1.5 mt-auto border border-blue-100">
              <span className="text-xs font-bold text-blue-800">
                ✓ {gap.solution}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 text-center">
        <span className="text-sm font-medium text-slate-700">
          <span className="font-bold text-blue-700">Market Gap:</span> No
          existing solution combines AI-first design, modern tech stack, and
          affordable team collaboration in one platform.
        </span>
      </div>
    </div>
  );
}
