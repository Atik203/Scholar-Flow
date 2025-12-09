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
    responses: "Moderate+ need 72.4%",
    decision:
      "Invest in onboarding + discovery; validate early with beta cohorts",
  },
  {
    question: "Interest level",
    responses: "Very interested 51.7%, Extremely 6.9%",
    decision: "Use social proof and waitlist CTA to convert warm intent",
  },
  {
    question: "AI priorities",
    responses: "Compare/mind maps 65.5%, Summaries 62.1%",
    decision: "Ship AI copilot early; include workflows not just features",
  },
  {
    question: "Free tier",
    responses: "Likely 31%, Very likely 27.6%",
    decision: "Freemium with clear upgrade hooks (storage, AI limits)",
  },
];

export default function Slide02SurveyTable() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      <div className="absolute top-10 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Feasibility Analysis
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            Survey Result Table
          </h1>
          <p className="text-lg text-slate-600 mt-2 max-w-4xl">
            Condensed findings from 21 questions turned into immediate product
            decisions to keep the MVP laser-focused on what respondents actually
            need.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <ClipboardList className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="text-xs text-slate-500">Decision cadence</p>
            <p className="font-semibold text-slate-800">
              Every survey item maps to a build move
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 bg-white/80 border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <p className="font-semibold">
              Top responses mapped to product decisions
            </p>
          </div>
          <p className="text-sm text-white/80">Sample size: 32 respondents</p>
        </div>
        <div className="overflow-auto max-h-[520px]">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide w-[180px]">
                  Question
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Top responses
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide w-[320px]">
                  Strategic decision
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.question}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                >
                  <td className="px-6 py-4 align-top">
                    <p className="font-semibold text-slate-900">
                      {row.question}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-top text-slate-700 text-sm">
                    {row.responses}
                  </td>
                  <td className="px-6 py-4 align-top text-slate-800 text-sm font-medium">
                    {row.decision}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
