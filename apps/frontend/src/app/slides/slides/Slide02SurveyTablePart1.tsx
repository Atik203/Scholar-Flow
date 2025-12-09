import { ClipboardList, Sparkles } from "lucide-react";

const rows = [
  {
    question: "Current tools",
    responses: "Browser PDFs 34.5%, Local 31%, Cloud 31%, No tool 27.6%",
    decision:
      "Importers for folders/cloud; show immediate upgrade for 'no-tool' users",
  },
  {
    question: "Reading cadence",
    responses: "Rarely 48.3%, Multi/day 20.7%, Weekly 20.7%",
    decision:
      "Dual journeys: nudge light readers; power views for heavy researchers",
  },
  {
    question: "Pain points",
    responses: "Notes 44.8%, Finding papers 37.9%, Organization 31%",
    decision: "Lead with annotation, tagging, retrieval; keep UX simple",
  },
  {
    question: "Collaboration",
    responses: "Work alone 55.2%, Share via chat/email 20.7%",
    decision:
      "Position 'from solo to shared' workspaces with low-friction invites",
  },
  {
    question: "Need intensity",
    responses: "72.4% moderate–extreme need",
    decision: "Prioritize onboarding + first-week value with quick wins",
  },
  {
    question: "Interest in ScholarFlow",
    responses: "51.7% very interested · 6.9% extremely",
    decision: "Use demos/waitlist CTA and fast follow-up emails",
  },
  {
    question: "Satisfaction with current tools",
    responses: "Avg 3.31/5 · 41.4% rate 3",
    decision: "Compete on UX speed/reliability; show side-by-side wins",
  },
];

export default function Slide02SurveyTablePart1() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      <div className="absolute top-10 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-700">
            Feasibility Analysis
          </p>
          <h1 className="text-4xl font-bold text-black mt-2">
            Survey Result Table (1/2)
          </h1>
          <p className="text-lg text-black mt-2 max-w-4xl">
            Top responses from the survey mapped to product decisions for
            clarity in planning.
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <p className="font-semibold">
              Top responses mapped to product decisions
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
