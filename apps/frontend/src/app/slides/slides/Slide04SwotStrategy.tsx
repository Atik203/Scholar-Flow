import { ShieldCheck, TrendingUp } from "lucide-react";

const swotRows = [
  {
    label: "Strengths",
    items:
      "72.4% need validation, dual AI stack ready, 102 Figma screens, concentrated launch campus (UIU).",
    strategy:
      "Lead with polished demo + AI differentiation; launch closed beta at UIU to capture social proof fast.",
  },
  {
    label: "Weaknesses",
    items:
      "New brand, solo-founder bandwidth, privacy and pricing uncertainty, complex realtime + AI stack.",
    strategy:
      "Scope ruthlessly to validated features; add transparent privacy copy and lean pricing experiments in beta.",
  },
  {
    label: "Opportunities",
    items:
      "Low switching costs (mostly free tools), 82%+ AI interest, campus network effects, freemium appetite (58.6%).",
    strategy:
      "Offer frictionless importers and free tier with upgrade hooks; campus ambassador program for viral loops.",
  },
  {
    label: "Threats",
    items:
      "Incumbents (Drive/Notion/Zotero), price-sensitive students, AI cost volatility, compliance overhead.",
    strategy:
      "Differentiate on student-first UX and AI workflows; cap AI spend with quotas; publish trust & compliance roadmap.",
  },
];

const milestones = [
  {
    title: "Beta (UIU)",
    detail:
      "100 users, free Pro tier, measure activation on uploads, notes, and AI chats.",
  },
  {
    title: "Phase 2",
    detail:
      "500 users across 5 campuses; enable team workspaces, AI comparisons, billing toggle.",
  },
  {
    title: "Phase 3",
    detail:
      "Paid expansion with ambassadors + SOC 2 roadmap; optimize AI cost per active user.",
  },
];

export default function Slide04SwotStrategy() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50" />
      <div className="absolute top-6 right-6 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Go-to-Market
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            SWOT & Strategy
          </h1>
          <p className="text-lg text-slate-600 mt-2 max-w-4xl">
            Risks and levers paired directly with the actions we will take.
            Table format keeps the narrative crisp for stakeholders.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Guardrails</p>
            <p className="font-semibold text-slate-800">
              Privacy clarity · Cost caps · MVP discipline
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        <div className="xl:col-span-2 bg-white/80 border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <p className="font-semibold">SWOT aligned with strategic moves</p>
            <TrendingUp className="w-5 h-5" />
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-[180px]">
                  SWOT
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Strategic response
                </th>
              </tr>
            </thead>
            <tbody>
              {swotRows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                >
                  <td className="px-6 py-4 align-top">
                    <p className="text-sm font-semibold text-slate-900">
                      {row.label}
                    </p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {row.items}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">
                      {row.strategy}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white/90 border border-slate-200 rounded-3xl shadow-md p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold">
              ✓
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Execution ladder
              </p>
              <p className="font-semibold text-slate-900">
                Milestones tied to SWOT mitigations
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.title}
                className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {milestone.title}
                </p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {milestone.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
