import { Building2 } from "lucide-react";
import { HiAcademicCap } from "react-icons/hi2";
import { SiElsevier, SiResearchgate, SiZotero } from "react-icons/si";
import { TbBrandCitymapper } from "react-icons/tb";

const competitors = [
  {
    name: "Mendeley",
    company: "Elsevier",
    icon: SiElsevier,
    color: "from-orange-500 to-orange-600",
    type: "Reference Manager",
    users: "15M+",
    founded: "2008",
    pricing: "Freemium",
    strengths: "PDF annotation, Social networking",
    weaknesses: "Limited AI, Vendor lock-in",
  },
  {
    name: "Zotero",
    company: "Open Source",
    icon: SiZotero,
    color: "from-red-500 to-red-600",
    type: "Reference Manager",
    users: "8M+",
    founded: "2006",
    pricing: "Free (300MB)",
    strengths: "Browser extension, Free core",
    weaknesses: "No native AI, Basic collaboration",
  },
  {
    name: "ResearchGate",
    company: "ResearchGate GmbH",
    icon: SiResearchgate,
    color: "from-teal-500 to-teal-600",
    type: "Academic Network",
    users: "20M+",
    founded: "2008",
    pricing: "Free + Ads",
    strengths: "Author networking, Publication discovery",
    weaknesses: "Not a reference manager, No PDF tools",
  },
  {
    name: "Paperpile",
    company: "Paperpile LLC",
    icon: TbBrandCitymapper,
    color: "from-indigo-500 to-indigo-600",
    type: "Reference Manager",
    users: "1M+",
    founded: "2012",
    pricing: "$2.99/mo",
    strengths: "Google Docs integration, Modern UI",
    weaknesses: "Limited free tier, No AI summarization",
  },
  {
    name: "EndNote",
    company: "Clarivate Analytics",
    icon: HiAcademicCap,
    color: "from-blue-700 to-blue-800",
    type: "Enterprise Reference",
    users: "3M+",
    founded: "1988",
    pricing: "$250/yr",
    strengths: "Enterprise features, Deep integration",
    weaknesses: "Very expensive, Dated UI, No AI",
  },
];

export default function Slide08Competitors() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          Market Competitors
        </h1>
      </div>

      {/* Competitor Cards */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-4 w-full max-w-6xl">
          {competitors.map((comp, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col"
            >
              {/* Header */}
              <div
                className={`bg-gradient-to-br ${comp.color} rounded-lg p-3 mb-2`}
              >
                <comp.icon className="w-8 h-8 text-white mx-auto mb-1" />
                <h3 className="text-white font-bold text-center text-sm">
                  {comp.name}
                </h3>
              </div>

              {/* Info */}
              <div className="flex-1 text-xs space-y-1.5">
                <div>
                  <span className="text-slate-400">By:</span>
                  <span className="text-slate-700 ml-1">{comp.company}</span>
                </div>
                <div>
                  <span className="text-slate-400">Type:</span>
                  <span className="text-slate-700 ml-1">{comp.type}</span>
                </div>
                <div>
                  <span className="text-slate-400">Users:</span>
                  <span className="text-slate-700 ml-1 font-semibold">
                    {comp.users}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Founded:</span>
                  <span className="text-slate-700 ml-1">{comp.founded}</span>
                </div>
                <div>
                  <span className="text-slate-400">Pricing:</span>
                  <span className="text-slate-700 ml-1">{comp.pricing}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 my-1.5" />

                {/* Strengths */}
                <div>
                  <span className="text-emerald-600 font-medium">✓ </span>
                  <span className="text-slate-600">{comp.strengths}</span>
                </div>

                {/* Weaknesses */}
                <div>
                  <span className="text-red-500 font-medium">✗ </span>
                  <span className="text-slate-600">{comp.weaknesses}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
        <p className="text-slate-700 text-sm text-center">
          <span className="font-bold text-blue-700">Market Gap:</span> No
          existing solution combines{" "}
          <span className="font-semibold">AI-first design</span>,{" "}
          <span className="font-semibold">modern tech stack</span>, and{" "}
          <span className="font-semibold">affordable team collaboration</span>{" "}
          in one platform.
        </p>
      </div>
    </div>
  );
}
