import { AlertCircle, Search } from "lucide-react";

const gaps = [
  {
    gap: "No AI-Powered Paper Summarization",
    impact: "Critical",
    impactColor: "bg-red-100 text-red-800",
    description: "Hours reading irrelevant papers",
    affectedProducts: ["Mendeley", "Zotero", "EndNote", "ResearchGate"],
    scholarFlowSolution: "Instant AI summaries with key findings",
  },
  {
    gap: "No AI Literature Review Generation",
    impact: "Critical",
    impactColor: "bg-red-100 text-red-800",
    description: "Literature reviews take weeks",
    affectedProducts: ["All Competitors"],
    scholarFlowSolution: "Automated review drafts from collections",
  },
  {
    gap: "No AI Chat Interface for Papers",
    impact: "High",
    impactColor: "bg-orange-100 text-orange-800",
    description: "Can't ask questions about content",
    affectedProducts: ["All Competitors"],
    scholarFlowSolution: "Chat with papers or entire collections",
  },
  {
    gap: "Limited Real-time Collaboration",
    impact: "High",
    impactColor: "bg-orange-100 text-orange-800",
    description: "Teams can't work simultaneously",
    affectedProducts: ["Zotero", "ResearchGate", "EndNote"],
    scholarFlowSolution: "Real-time workspace with presence",
  },
  {
    gap: "Expensive Team/Enterprise Pricing",
    impact: "Medium",
    impactColor: "bg-amber-100 text-amber-800",
    description: "EndNote $250+/yr, prohibitive tiers",
    affectedProducts: ["EndNote", "Mendeley", "Paperpile"],
    scholarFlowSolution: "$10-30/mo with generous free tier",
  },
  {
    gap: "Outdated User Interfaces",
    impact: "Medium",
    impactColor: "bg-amber-100 text-amber-800",
    description: "Legacy UX not updated in years",
    affectedProducts: ["EndNote", "Zotero", "Mendeley"],
    scholarFlowSolution: "Modern, responsive UI with latest tech",
  },
];

export default function Slide11GapAnalysis() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-black">Market Gap Analysis</h1>
      </div>

      {/* Gap Cards */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {gaps.map((gap, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl p-3 border border-slate-200"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <h3 className="text-base font-bold text-black">{gap.gap}</h3>
              </div>
              <span
                className={`text-sm px-2 py-0.5 rounded-full font-semibold ${gap.impactColor}`}
              >
                {gap.impact}
              </span>
            </div>

            <p className="text-sm text-black mb-1.5">{gap.description}</p>

            <div className="text-sm mb-1.5">
              <span className="text-slate-600 font-medium">Affected: </span>
              <span className="text-black font-medium">
                {gap.affectedProducts.join(", ")}
              </span>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-100">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 text-base font-bold">✓</span>
                <span className="text-sm font-bold text-blue-800">
                  ScholarFlow:
                </span>
                <span className="text-sm text-black font-medium">
                  {gap.scholarFlowSolution}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-center gap-8 text-base">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">6</div>
            <div className="text-black text-sm font-medium">Critical Gaps</div>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">0</div>
            <div className="text-black text-sm font-medium">
              Existing AI Solutions
            </div>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">1</div>
            <div className="text-black text-sm font-medium">
              Platform Solving All
            </div>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div className="font-bold text-lg text-blue-700">
            = ScholarFlow 🚀
          </div>
        </div>
      </div>
    </div>
  );
}
