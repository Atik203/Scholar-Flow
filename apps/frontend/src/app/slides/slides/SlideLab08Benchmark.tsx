import { AlertCircle, Building2 } from "lucide-react";

const competitors = [
  {
    name: "Mendeley", company: "Elsevier", color: "from-orange-500 to-orange-600",
    type: "Reference Manager", users: "15M+", pricing: "Freemium",
    limitation: "Limited AI features and vendor lock-in with Elsevier ecosystem",
  },
  {
    name: "Zotero", company: "Open Source", color: "from-red-500 to-red-600",
    type: "Reference Manager", users: "8M+", pricing: "Free (300MB)",
    limitation: "No native AI capabilities, basic collaboration features only",
  },
  {
    name: "ResearchGate", company: "ResearchGate GmbH", color: "from-teal-500 to-teal-600",
    type: "Academic Network", users: "20M+", pricing: "Free + Ads",
    limitation: "Not a reference manager, no PDF annotation or analysis tools",
  },
  {
    name: "EndNote", company: "Clarivate Analytics", color: "from-blue-700 to-blue-800",
    type: "Enterprise Ref", users: "3M+", pricing: "$250/yr",
    limitation: "Very expensive, dated UI, no AI integration, limited collaboration",
  },
];

const gaps = [
  {
    gap: "No AI-Powered Paper Summarization", impact: "Critical",
    affected: "Mendeley, Zotero, EndNote, ResearchGate",
    solution: "Instant AI summaries with key findings, methodology, and conclusions extracted automatically from any paper",
  },
  {
    gap: "No AI Chat Interface for Papers", impact: "Critical",
    affected: "All competing platforms lack this feature entirely",
    solution: "Chat with individual papers or entire collections using context-aware AI that understands document content",
  },
  {
    gap: "Limited Real-time Collaboration", impact: "High",
    affected: "Zotero, ResearchGate, EndNote have basic or no real-time sync capabilities",
    solution: "Real-time collaborative workspaces with presence indicators, activity tracking, and shared libraries",
  },
  {
    gap: "Expensive Enterprise Pricing", impact: "High",
    affected: "EndNote $250+/yr, Mendeley and Paperpile have expensive team tiers",
    solution: "Affordable $10-30/month plans with a generous free tier accessible to students and individuals",
  },
];

export default function SlideLab08Benchmark() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">Benchmark Analysis</h1>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {competitors.map((comp, i) => (
          <div key={i} className={`bg-gradient-to-br ${comp.color} rounded-xl p-4 text-white`}>
            <h3 className="font-bold text-xl mb-1">{comp.name}</h3>
            <p className="text-xs text-white/80">{comp.type}</p>
            <div className="flex justify-between text-sm mt-2">
              <span className="font-semibold">{comp.users}</span>
              <span className="font-semibold">{comp.pricing}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs text-white/80"><span className="font-bold text-white">✗</span> {comp.limitation}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        Critical Market Gaps That ScholarFlow Fills
      </h2>
      <div className="flex-1 grid grid-cols-2 gap-3">
        {gaps.map((gap, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-black text-lg">{gap.gap}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${gap.impact === "Critical" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}>{gap.impact}</span>
            </div>
            <p className="text-base text-black font-semibold mb-1">Affected: {gap.affected}</p>
            <div className="bg-blue-50 rounded-lg px-3 py-2 mt-auto border border-blue-100">
              <span className="text-base font-bold text-blue-800">✓ ScholarFlow: {gap.solution}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 text-center">
        <span className="text-xl font-bold text-black">
          <span className="text-blue-700">Market Gap:</span> No existing solution combines AI-first design, modern tech stack, and affordable team collaboration in one platform.
        </span>
      </div>
    </div>
  );
}