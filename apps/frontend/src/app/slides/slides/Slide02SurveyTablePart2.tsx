import { ClipboardList, Sparkles } from "lucide-react";

const rows = [
  {
    question: "Search frustration",
    responses: "Hard to find papers 65.5%",
    decision: "Invest in semantic search + filters; relevance over breadth",
  },
  {
    question: "Notes & highlights",
    responses: "Must-have 69%",
    decision: "Ship annotation, sync, and export early; keep latency low",
  },
  {
    question: "Sharing preferences",
    responses: "Email 41%, Chat 37.9%",
    decision: "One-click share to email/chat; auto-generate summaries",
  },
  {
    question: "Integrations",
    responses: "Google Scholar 41.4%, arXiv 27.6%",
    decision: "Prioritize Scholar + arXiv connectors; add alerts later",
  },
  {
    question: "Organization & search",
    responses: "59.4% want collections/upload/store",
    decision: "Collections + filters upfront; saved searches and tags",
  },
  {
    question: "AI features",
    responses: "Mind maps 68.8%, summaries 65.6%, Q&A 62.5%",
    decision: "Launch AI copilot with budgets, caching, and reliable Q&A",
  },
  {
    question: "Pricing & free tier",
    responses: "62.6% likely to try freemium",
    decision: "Freemium with clear limits; upgrade hooks on storage/AI",
  },
];

export default function Slide02SurveyTablePart2() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" />
      <div className="absolute top-10 right-0 w-64 h-64 bg-blue-500/12 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/12 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-700">
            Feasibility Analysis
          </p>
          <h1 className="text-4xl font-bold text-black mt-2">
            Survey Result Table (2/2)
          </h1>
          <p className="text-lg text-black mt-2 max-w-4xl">
            Continuation of responses paired with the product actions they
            inform.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/90 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <ClipboardList className="w-6 h-6 text-indigo-700" />
          <div>
            <p className="text-xs text-slate-700">Decision cadence</p>
            <p className="font-semibold text-black">
              Every survey item maps to a build move
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 bg-white/90 border border-slate-200 rounded-3xl shadow-lg overflow-hidden max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <p className="font-semibold">
              Continuing responses mapped to product decisions
            </p>
          </div>
          <p className="text-sm text-white/90">Sample size: 32 respondents</p>
        </div>
        <table className="w-full text-left table-fixed">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-800 uppercase tracking-wide w-[230px]">
                Question
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Top responses
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-800 uppercase tracking-wide w-[360px]">
                Strategic decision
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.question}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
              >
                <td className="px-6 py-4 align-top">
                  <p className="font-semibold text-black text-base">
                    {row.question}
                  </p>
                </td>
                <td className="px-6 py-4 align-top text-black text-sm leading-relaxed">
                  {row.responses}
                </td>
                <td className="px-6 py-4 align-top text-black text-sm font-medium leading-relaxed">
                  {row.decision}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
