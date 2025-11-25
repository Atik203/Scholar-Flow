import { cn } from "@/lib/utils";
import { Check, Minus, Table, X } from "lucide-react";

const features = [
  "Smart Paper Upload",
  "AI Summarization",
  "AI Chat with Papers",
  "Rich Text Editor",
  "Team Workspaces",
  "Collections & Tagging",
  "Citation Generator",
  "PDF Annotations",
  "Real-time Collaboration",
];

const products = [
  {
    name: "ScholarFlow",
    color: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
  },
  { name: "Mendeley", color: "bg-orange-100 text-orange-800" },
  { name: "Zotero", color: "bg-red-100 text-red-800" },
  { name: "ResearchGate", color: "bg-teal-100 text-teal-800" },
  { name: "Paperpile", color: "bg-indigo-100 text-indigo-800" },
  { name: "EndNote", color: "bg-blue-100 text-blue-800" },
];

// Feature support matrix: 2 = full, 1 = partial, 0 = no
const support: number[][] = [
  [2, 2, 2, 1, 2, 2], // Smart Paper Upload
  [2, 0, 0, 0, 0, 0], // AI Summarization
  [2, 0, 0, 0, 0, 0], // AI Chat with Papers
  [2, 1, 0, 0, 0, 0], // Rich Text Editor
  [2, 1, 0, 0, 1, 2], // Team Workspaces
  [2, 2, 2, 1, 2, 2], // Collections & Tagging
  [2, 2, 2, 1, 2, 2], // Citation Generator
  [2, 2, 2, 0, 2, 1], // PDF Annotations
  [2, 1, 0, 0, 1, 1], // Real-time Collaboration
];

function SupportIcon({ level }: { level: number }) {
  if (level === 2)
    return <Check className="w-5 h-5 text-emerald-600" strokeWidth={3} />;
  if (level === 1)
    return <Minus className="w-5 h-5 text-amber-500" strokeWidth={3} />;
  return <X className="w-5 h-5 text-red-500" strokeWidth={3} />;
}

export default function Slide09Comparison() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Table className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800">
          Feature Comparison Matrix
        </h1>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 mb-4">
        <div className="flex items-center gap-2">
          <Check className="w-7 h-7 text-emerald-600" strokeWidth={3} />
          <span className="text-base font-bold text-slate-700">
            Full Support
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="w-7 h-7 text-amber-500" strokeWidth={3} />
          <span className="text-base font-bold text-slate-700">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-7 h-7 text-red-500" strokeWidth={3} />
          <span className="text-base font-bold text-slate-700">
            Not Available
          </span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="flex-1 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 bg-slate-100 border-b-2 border-slate-300 font-bold text-slate-800 text-lg w-[200px]">
                Feature
              </th>
              {products.map((product, i) => (
                <th
                  key={i}
                  className="p-2 bg-slate-100 border-b-2 border-slate-300 text-center"
                >
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold ${product.color}`}
                  >
                    {product.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, fIndex) => (
              <tr
                key={fIndex}
                className={fIndex % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
              >
                <td className="p-2.5 border-b border-slate-200 font-semibold text-slate-800 text-base">
                  {feature}
                </td>
                {products.map((_, pIndex) => (
                  <td
                    key={pIndex}
                    className={cn(
                      "p-2 border-b border-slate-200 text-center",
                      pIndex === 0 && "bg-blue-50/60"
                    )}
                  >
                    <div className="flex justify-center">
                      <SupportIcon level={support[fIndex][pIndex]} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* Score Row */}
          <tfoot>
            <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
              <td className="p-2 font-bold text-slate-800 text-sm">
                Features Supported
              </td>
              {products.map((_, pIndex) => {
                const fullSupport = support.filter(
                  (row) => row[pIndex] === 2
                ).length;
                return (
                  <td key={pIndex} className="p-2 text-center">
                    <span
                      className={`font-bold ${pIndex === 0 ? "text-blue-700 text-lg" : "text-slate-700 text-sm"}`}
                    >
                      {fullSupport}/9
                    </span>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
