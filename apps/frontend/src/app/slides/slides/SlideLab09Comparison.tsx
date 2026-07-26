import { cn } from "@/lib/utils";
import { Check, Minus, Table, X } from "lucide-react";

const features = [
  "Smart Paper Upload", "AI Summarization", "AI Chat Q&A", "Rich Text Editor",
  "Team Workspaces", "Collections & Tagging", "Citation Generator", "PDF Annotations",
  "Real-time Collaboration", "Analytics Dashboard", "Subscription Billing", "Enterprise Security",
];

const products = [
  { name: "ScholarFlow", sub: "Our Platform" },
  { name: "Paperpal", sub: "Cactus AI" },
  { name: "EndNote 21", sub: "Clarivate" },
  { name: "Mendeley", sub: "Elsevier" },
  { name: "Zotero", sub: "Open Source" },
];

const support: number[][] = [
  [2, 1, 2, 2, 2], // Smart Paper Upload
  [2, 2, 0, 0, 0], // AI Summarization
  [2, 2, 0, 0, 0], // AI Chat Q&A
  [2, 2, 0, 0, 0], // Rich Text Editor
  [2, 0, 1, 1, 1], // Team Workspaces
  [2, 0, 2, 2, 2], // Collections & Tagging
  [2, 1, 2, 2, 2], // Citation Generator
  [2, 0, 2, 2, 2], // PDF Annotations
  [2, 0, 0, 0, 0], // Real-time Collaboration
  [2, 1, 1, 1, 0], // Analytics Dashboard
  [2, 2, 0, 0, 0], // Subscription Billing
  [2, 1, 2, 2, 2], // Enterprise Security
];

function SupportIcon({ level }: { level: number }) {
  if (level === 2) return <Check className="w-5 h-5 text-emerald-600 mx-auto" strokeWidth={3} />;
  if (level === 1) return <Minus className="w-5 h-5 text-amber-500 mx-auto" strokeWidth={3} />;
  return <X className="w-5 h-5 text-red-500 mx-auto" strokeWidth={3} />;
}

export default function SlideLab09Comparison() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Table className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-indigo-600 mb-0.5">Slide 09 · Feature Matrix</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Detailed Feature Comparison</h1>
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            {[{ Icon: Check, label: "Full", color: "text-emerald-600" }, { Icon: Minus, label: "Partial", color: "text-amber-500" }, { Icon: X, label: "None", color: "text-red-500" }].map(({ Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className={`w-5 h-5 ${color}`} strokeWidth={3} />
                <span className="text-xl font-bold text-slate-800">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 relative z-10 my-3 min-h-0 overflow-hidden bg-white rounded-2xl border-2 border-slate-200 shadow-md">
        <table className="w-full h-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 bg-slate-100 border-b-2 border-slate-200 font-extrabold text-slate-700 text-xl w-[30%]">Feature</th>
              {products.map((p, i) => (
                <th key={i} className={cn("px-3 py-2 border-b-2 text-center", i === 0 ? "bg-gradient-to-b from-blue-600 to-indigo-700 border-indigo-500" : "bg-slate-100 border-slate-200")}>
                  <div className={cn("font-extrabold text-xl leading-tight", i === 0 ? "text-white" : "text-slate-900")}>{p.name}</div>
                  <div className={cn("text-base font-bold", i === 0 ? "text-blue-200" : "text-slate-500")}>{p.sub}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, fIdx) => (
              <tr key={fIdx} className={fIdx % 2 === 0 ? "bg-white" : "bg-slate-50/80"}>
                <td className="px-4 py-1.5 border-b border-slate-100 font-bold text-slate-900 text-xl">{feature}</td>
                {products.map((_, pIdx) => (
                  <td key={pIdx} className={cn("px-3 py-1.5 border-b border-slate-100 text-center", pIdx === 0 && "bg-blue-50/60")}>
                    <SupportIcon level={support[fIdx][pIdx]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
              <td className="px-4 py-2 font-extrabold text-slate-800 text-xl border-t-2 border-slate-200">Total Full Support</td>
              {products.map((_, pIdx) => {
                const score = support.filter(row => row[pIdx] === 2).length;
                return (
                  <td key={pIdx} className="px-3 py-2 text-center border-t-2 border-slate-200">
                    <span className={cn("font-black text-2xl", pIdx === 0 ? "text-blue-700" : "text-slate-600")}>{score}/12</span>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-xl px-6 py-3 shadow-lg border border-indigo-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          🏆 ScholarFlow scores <span className="text-amber-300">12/12</span> — the only platform combining full reference management, AI insights, and real-time collaboration
        </p>
      </div>
    </div>
  );
}