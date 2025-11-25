import { AlertCircle, Search } from "lucide-react";

const gaps = [
  {
    gap: "No AI-Powered Paper Summarization",
    impact: "Critical",
    impactColor: "bg-red-100 text-red-700",
    description:
      "Researchers spend hours reading papers that may not be relevant",
    affectedProducts: [
      "Mendeley",
      "Zotero",
      "EndNote",
      "ResearchGate",
      "Paperpile",
    ],
    scholarFlowSolution: "Instant AI summaries with key findings extraction",
  },
  {
    gap: "No AI Literature Review Generation",
    impact: "Critical",
    impactColor: "bg-red-100 text-red-700",
    description: "Literature reviews take weeks of manual synthesis",
    affectedProducts: ["All Competitors"],
    scholarFlowSolution:
      "Automated literature review drafts from paper collections",
  },
  {
    gap: "No AI Chat Interface for Papers",
    impact: "High",
    impactColor: "bg-orange-100 text-orange-700",
    description: "Users can't ask questions about paper content",
    affectedProducts: ["All Competitors"],
    scholarFlowSolution: "Chat with individual papers or entire collections",
  },
  {
    gap: "Limited Real-time Collaboration",
    impact: "High",
    impactColor: "bg-orange-100 text-orange-700",
    description: "Teams can't work together on research simultaneously",
    affectedProducts: ["Zotero", "ResearchGate", "EndNote"],
    scholarFlowSolution: "Real-time workspace collaboration with presence",
  },
  {
    gap: "Expensive Team/Enterprise Pricing",
    impact: "Medium",
    impactColor: "bg-amber-100 text-amber-700",
    description: "EndNote costs $250+/yr, enterprise tiers are prohibitive",
    affectedProducts: ["EndNote", "Mendeley", "Paperpile"],
    scholarFlowSolution: "$10-30/mo for teams with generous free tier",
  },
  {
    gap: "Outdated User Interfaces",
    impact: "Medium",
    impactColor: "bg-amber-100 text-amber-700",
    description: "Legacy tools haven't updated UX in years",
    affectedProducts: ["EndNote", "Zotero", "Mendeley"],
    scholarFlowSolution: "Modern, responsive UI built with latest tech",
  },
];

export default function Slide11GapAnalysis() {
  return (
    <div className="w-full h-full bg-white p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Market Gap Analysis
        </h1>
      </div>

      {/* Gap Cards */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {gaps.map((gap, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl p-3 border border-slate-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <h3 className="text-sm font-bold text-slate-800">{gap.gap}</h3>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${gap.impactColor}`}
              >
                {gap.impact}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-2">{gap.description}</p>

            <div className="text-xs mb-2">
              <span className="text-slate-400">Affected: </span>
              <span className="text-slate-600">
                {gap.affectedProducts.join(", ")}
              </span>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-100">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span className="text-xs font-medium text-blue-700">
                  ScholarFlow:
                </span>
              </div>
              <p className="text-xs text-slate-700 ml-4">
                {gap.scholarFlowSolution}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-3 text-white">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">6</div>
            <div className="text-slate-400 text-xs">Critical Gaps</div>
          </div>
          <div className="h-8 w-px bg-slate-600" />
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">0</div>
            <div className="text-slate-400 text-xs">Existing AI Solutions</div>
          </div>
          <div className="h-8 w-px bg-slate-600" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">1</div>
            <div className="text-slate-400 text-xs">Platform Solving All</div>
          </div>
          <div className="h-8 w-px bg-slate-600" />
          <div className="font-medium text-blue-400">= ScholarFlow 🚀</div>
        </div>
      </div>
    </div>
  );
}
