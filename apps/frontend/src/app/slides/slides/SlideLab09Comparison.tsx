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
  "Analytics Dashboard",
  "Subscription Billing",
  "Enterprise Security",
];

const products = [
  {
    name: "ScholarFlow",
    color: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
  },
  { name: "Mendeley", color: "bg-orange-100 text-orange-900" },
  { name: "Zotero", color: "bg-red-100 text-red-900" },
  { name: "ResearchGate", color: "bg-teal-100 text-teal-900" },
  { name: "Paperpile", color: "bg-indigo-100 text-indigo-900" },
  { name: "EndNote", color: "bg-blue-100 text-blue-900" },
];

const support: number[][] = [
  [2, 2, 2, 1, 2, 2],
  [2, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0],
  [2, 1, 0, 0, 0, 0],
  [2, 1, 0, 0, 1, 2],
  [2, 2, 2, 1, 2, 2],
  [2, 2, 2, 1, 2, 2],
  [2, 2, 2, 0, 2, 1],
  [2, 1, 0, 0, 1, 1],
  [2, 1, 1, 1, 1, 1],
  [2, 2, 0, 0, 2, 2],
  [2, 2, 2, 1, 2, 2],
];

function SupportIcon({ level }: { level: number }) {
  if (level === 2)
    return <Check className="w-6 h-6 text-emerald-600" strokeWidth={3} />;
  if (level === 1)
    return <Minus className="w-6 h-6 text-amber-600" strokeWidth={3} />;
  return <X className="w-6 h-6 text-red-600" strokeWidth={3} />;
}

export default function SlideLab09Comparison() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Table className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">
          Feature Comparison Matrix
        </h1>
      </div>

      <div className="flex justify-center gap-8 mb-4">
        <div className="flex items-center gap-2">
          <Check className="w-6 h-6 text-emerald-600" strokeWidth={3} />
          <span className="text-base font-bold text-black">Full Support</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="w-6 h-6 text-amber-600" strokeWidth={3} />
          <span className="text-base font-bold text-black">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-6 h-6 text-red-600" strokeWidth={3} />
          <span className="text-base font-bold text-black">Not Available</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 bg-slate-100 border-b-2 border-slate-300 font-bold text-black text-base w-[180px]">
                Feature
              </th>
              {products.map((product, i) => (
                <th
                  key={i}
                  className="p-2 bg-slate-100 border-b-2 border-slate-300 text-center"
                >
                  <span
                    className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${product.color}`}
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
                <td className="p-2 border-b border-slate-200 font-semibold text-black text-sm">
                  {feature}
                </td>
                {products.map((_, pIndex) => (
                  <td
                    key={pIndex}
                    className={cn(
                      "p-1 border-b border-slate-200 text-center",
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
          <tfoot>
            <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
              <td className="p-2 font-bold text-black text-sm">
                Features Supported
              </td>
              {products.map((_, pIndex) => {
                const fullSupport = support.filter(
                  (row) => row[pIndex] === 2
                ).length;
                return (
                  <td key={pIndex} className="p-2 text-center">
                    <span
                      className={`font-bold ${pIndex === 0 ? "text-blue-700 text-base" : "text-black text-sm"}`}
                    >
                      {fullSupport}/12
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
